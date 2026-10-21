import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import {
  Ledger,
  MAX_OPERATIONS_PER_SESSION,
  MAX_REVIEWS_PER_SESSION,
  RETENTION_MS,
} from '../app/lib/server/ledger';

function fixture() {
  const dir = mkdtempSync(join(tmpdir(), 'autonomia-test-'));
  let time = 1000;
  const path = join(dir, 'ledger.sqlite');
  const ledger = new Ledger(path, () => time);
  const session = randomUUID();
  const draftId = randomUUID();
  const key = randomUUID();
  return {
    ledger,
    session,
    draftId,
    key,
    path,
    tick: () => {
      time += 61000;
    },
    now: () => time,
    clean: () => {
      ledger.close();
      rmSync(dir, { recursive: true, force: true });
    },
  };
}

test('review uses synthetic catalogue, rejects real/unknown codes and tampered bindings', () => {
  const f = fixture();
  try {
    assert.throws(() =>
      f.ledger.review(f.session, {
        draftId: f.draftId,
        key: f.key,
        service: 'luz',
        code: '999999999',
      }),
    );
    const r = f.ledger.review(f.session, {
      draftId: f.draftId,
      key: f.key,
      service: 'luz',
      code: '100200300',
    });
    assert.equal(r.bill.amount, 1850040);
    assert.throws(() => f.ledger.commit('other', r.id, f.key));
    assert.throws(() => f.ledger.commit(f.session, r.id, randomUUID()));
    assert.equal(f.ledger.list(f.session).length, 0);
  } finally {
    f.clean();
  }
});
test('confirmation is idempotent, survives reopen, and remains session isolated', () => {
  const f = fixture();
  try {
    const r = f.ledger.review(f.session, {
      draftId: f.draftId,
      key: f.key,
      service: 'luz',
      code: '100200300',
    });
    const a = f.ledger.commit(f.session, r.id, f.key);
    const b = f.ledger.commit(f.session, r.id, f.key);
    assert.equal(a.id, b.id);
    assert.equal(a.status, 'succeeded');
    assert.equal(f.ledger.list(f.session).length, 1);
    assert.equal(f.ledger.get('other', a.id), undefined);
    const reopened = new Ledger(f.path, f.now);
    assert.equal(reopened.get(f.session, a.id)?.id, a.id);
    reopened.close();
  } finally {
    f.clean();
  }
});
test('a second tab cannot create another operation for the same draft', () => {
  const f = fixture();
  try {
    const r = f.ledger.review(f.session, {
      draftId: f.draftId,
      key: f.key,
      service: 'luz',
      code: '100200300',
    });
    f.ledger.commit(f.session, r.id, f.key);
    assert.throws(() =>
      f.ledger.review(f.session, {
        draftId: f.draftId,
        key: randomUUID(),
        service: 'gas',
        code: '200300300',
      }),
    );
    assert.equal(f.ledger.list(f.session).length, 1);
  } finally {
    f.clean();
  }
});
test('pending cancellation is persisted and idempotent; leaving is not cancellation', () => {
  const f = fixture();
  try {
    const r = f.ledger.review(f.session, {
      draftId: f.draftId,
      key: f.key,
      service: 'luz',
      code: '100200301',
    });
    const op = f.ledger.commit(f.session, r.id, f.key);
    assert.equal(op.status, 'pending');
    assert.equal(f.ledger.get(f.session, op.id)?.status, 'pending');
    assert.equal(f.ledger.cancel(f.session, op.id).status, 'cancelled');
    f.tick();
    assert.equal(f.ledger.cancel(f.session, op.id).status, 'cancelled');
    const reopened = new Ledger(f.path, f.now);
    assert.equal(reopened.get(f.session, op.id)?.status, 'cancelled');
    reopened.close();
  } finally {
    f.clean();
  }
});
test('pending settlement is verified on lookup; completed operation cannot be annulled', () => {
  const f = fixture();
  try {
    const r = f.ledger.review(f.session, {
      draftId: f.draftId,
      key: f.key,
      service: 'luz',
      code: '100200301',
    });
    const op = f.ledger.commit(f.session, r.id, f.key);
    f.tick();
    assert.equal(f.ledger.get(f.session, op.id)?.status, 'succeeded');
    assert.equal(f.ledger.cancel(f.session, op.id).status, 'succeeded');
  } finally {
    f.clean();
  }
});
test('failed simulation never becomes success', () => {
  const f = fixture();
  try {
    const r = f.ledger.review(f.session, {
      draftId: f.draftId,
      key: f.key,
      service: 'luz',
      code: '100200302',
    });
    const op = f.ledger.commit(f.session, r.id, f.key);
    f.tick();
    assert.equal(f.ledger.get(f.session, op.id)?.status, 'failed');
  } finally {
    f.clean();
  }
});

test('operation survives writer process exit and is idempotent in another process', async () => {
  const { spawnSync } = await import('node:child_process');
  const f = fixture();
  try {
    const source = `import {Ledger} from './app/lib/server/ledger.ts';const ledger=new Ledger(${JSON.stringify(f.path)});const review=ledger.review(${JSON.stringify(f.session)},{draftId:${JSON.stringify(f.draftId)},key:${JSON.stringify(f.key)},service:'luz',code:'100200300'});const operation=ledger.commit(${JSON.stringify(f.session)},review.id,${JSON.stringify(f.key)});console.log(JSON.stringify({id:operation.id,reviewId:review.id}));ledger.close();`;
    const first = spawnSync(process.execPath, ['node_modules/tsx/dist/cli.mjs', '-e', source], {
      encoding: 'utf8',
    });
    assert.equal(first.status, 0, first.stderr);
    const receipt = JSON.parse(first.stdout);
    const retry = `import {Ledger} from './app/lib/server/ledger.ts';const ledger=new Ledger(${JSON.stringify(f.path)});console.log(ledger.commit(${JSON.stringify(f.session)},${JSON.stringify(receipt.reviewId)},${JSON.stringify(f.key)}).id);ledger.close();`;
    const second = spawnSync(process.execPath, ['node_modules/tsx/dist/cli.mjs', '-e', retry], {
      encoding: 'utf8',
    });
    assert.equal(second.status, 0, second.stderr);
    assert.equal(second.stdout.trim(), receipt.id);
    assert.equal(f.ledger.list(f.session).length, 1);
    assert.equal(f.ledger.list(f.session)[0].id, receipt.id);
  } finally {
    f.clean();
  }
});

test('competing valid reviews created before submission cannot both commit', () => {
  const f = fixture();
  try {
    const first = f.ledger.review(f.session, {
      draftId: f.draftId,
      key: f.key,
      service: 'luz',
      code: '100200300',
    });
    const otherKey = randomUUID();
    const second = f.ledger.review(f.session, {
      draftId: f.draftId,
      key: otherKey,
      service: 'gas',
      code: '200300300',
    });
    f.ledger.commit(f.session, first.id, f.key);
    assert.throws(() => f.ledger.commit(f.session, second.id, otherKey), /ya fue confirmada/);
    assert.equal(f.ledger.list(f.session).length, 1);
  } finally {
    f.clean();
  }
});
test('review cap rejects unbounded attempts and clear releases the session', () => {
  const f = fixture();
  try {
    for (let i = 0; i < MAX_REVIEWS_PER_SESSION; i++)
      f.ledger.review(f.session, {
        draftId: randomUUID(),
        key: randomUUID(),
        service: 'luz',
        code: '100200300',
      });
    assert.throws(
      () =>
        f.ledger.review(f.session, {
          draftId: randomUUID(),
          key: randomUUID(),
          service: 'luz',
          code: '100200300',
        }),
      /límite de intentos/,
    );
    f.ledger.clear(f.session);
    assert.ok(
      f.ledger.review(f.session, {
        draftId: randomUUID(),
        key: randomUUID(),
        service: 'luz',
        code: '100200300',
      }).id,
    );
  } finally {
    f.clean();
  }
});
test('operation cap prevents unbounded confirmed practices', () => {
  const f = fixture();
  try {
    for (let i = 0; i < MAX_OPERATIONS_PER_SESSION; i++) {
      const review = f.ledger.review(f.session, {
        draftId: randomUUID(),
        key: randomUUID(),
        service: 'luz',
        code: '100200300',
      });
      f.ledger.commit(f.session, review.id, review.key);
    }
    assert.equal(f.ledger.list(f.session).length, MAX_OPERATIONS_PER_SESSION);
    const review = f.ledger.review(f.session, {
      draftId: randomUUID(),
      key: randomUUID(),
      service: 'luz',
      code: '100200300',
    });
    assert.throws(() => f.ledger.commit(f.session, review.id, review.key), /límite de operaciones/);
  } finally {
    f.clean();
  }
});
test('records older than the retention window are removed on reopen', () => {
  const dir = mkdtempSync(join(tmpdir(), 'autonomia-retention-'));
  const path = join(dir, 'ledger.sqlite');
  const session = randomUUID();
  try {
    const first = new Ledger(path, () => 1000);
    const review = first.review(session, {
      draftId: randomUUID(),
      key: randomUUID(),
      service: 'luz',
      code: '100200300',
    });
    first.commit(session, review.id, review.key);
    assert.equal(first.list(session).length, 1);
    first.close();
    const second = new Ledger(path, () => 1000 + RETENTION_MS + 1);
    assert.equal(second.list(session).length, 0);
    second.close();
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
