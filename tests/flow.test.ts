import test from 'node:test';
import assert from 'node:assert/strict';
import { createActor } from 'xstate';
import { procedureMachine } from '../app/flows/procedure-machine';
import { stepCopy } from '../app/flows/contracts';
import { command } from '../app/speech/commands';
test('all screens have help, a primary action and a safe exit', () => {
  for (const copy of Object.values(stepCopy)) {
    assert.ok(copy.help);
    assert.ok(copy.back);
    assert.ok(copy.primary);
  }
});
test('voice cannot recognize payment confirmation as authority', () => {
  for (const phrase of ['sí', 'confirmar', 'pagar', 'confirmar pago de práctica'])
    assert.equal(command(phrase), 'unknown');
  assert.equal(command('quiero pagar la luz'), 'pay');
});
test('review never commits on entry or a repeated preceding event', () => {
  const actor = createActor(procedureMachine).start();
  actor.send({ type: 'RESTORE', draft: null });
  actor.send({ type: 'START' });
  actor.send({ type: 'SELECT', service: 'luz' });
  actor.send({ type: 'CODE', code: '100200300' });
  const draft = actor.getSnapshot().context.draft!;
  const review = {
    id: crypto.randomUUID(),
    draftId: draft.id,
    key: draft.key,
    bill: {
      code: '100200300',
      service: 'luz' as const,
      company: 'Example',
      holder: 'Marta',
      account: '100200',
      period: 'Octubre',
      amount: 100,
      scenario: 'normal' as const,
    },
  };
  actor.send({ type: 'REVIEW', review });
  actor.send({ type: 'REVIEW', review });
  assert.equal(actor.getSnapshot().value, 'review');
  actor.send({ type: 'CONFIRM' });
  assert.equal(actor.getSnapshot().value, 'submitting');
  actor.send({ type: 'LEAVE' });
  assert.equal(actor.getSnapshot().value, 'home');
  assert.equal(actor.getSnapshot().context.draft?.operation, undefined);
  actor.stop();
});

test('completed or abandoned practice can deliberately start again', () => {
  const actor = createActor(procedureMachine).start();
  actor.send({ type: 'RESTORE', draft: null });
  actor.send({ type: 'START' });
  const old = actor.getSnapshot().context.draft!;
  actor.send({
    type: 'VERIFIED',
    operation: {
      id: crypto.randomUUID(),
      draftId: old.id,
      status: 'failed',
      bill: {
        code: '100200300',
        service: 'luz',
        company: 'Example',
        holder: 'Marta',
        account: '100200',
        period: 'Octubre',
        amount: 100,
        scenario: 'failed',
      },
      createdAt: 1,
      readyAt: 1,
    },
  });
  actor.send({ type: 'START' });
  assert.equal(actor.getSnapshot().value, 'service');
  assert.notEqual(actor.getSnapshot().context.draft?.id, old.id);
  actor.stop();
});
test('late response cannot replace a newer draft or pull someone back from home', () => {
  const actor = createActor(procedureMachine).start();
  actor.send({ type: 'RESTORE', draft: null });
  actor.send({ type: 'START' });
  const old = actor.getSnapshot().context.draft!;
  const operation = {
    id: crypto.randomUUID(),
    draftId: old.id,
    status: 'succeeded' as const,
    bill: {
      code: '100200300',
      service: 'luz' as const,
      company: 'Example',
      holder: 'Marta',
      account: '100200',
      period: 'Octubre',
      amount: 100,
      scenario: 'normal' as const,
    },
    createdAt: 1,
    readyAt: 1,
  };
  actor.send({ type: 'LEAVE' });
  actor.send({ type: 'VERIFIED', operation });
  assert.equal(actor.getSnapshot().value, 'home');
  assert.equal(actor.getSnapshot().context.draft?.operation?.id, operation.id);
  actor.send({ type: 'START' });
  const newer = actor.getSnapshot().context.draft!.id;
  actor.send({ type: 'VERIFIED', operation });
  assert.equal(actor.getSnapshot().value, 'service');
  assert.equal(actor.getSnapshot().context.draft!.id, newer);
  assert.equal(actor.getSnapshot().context.draft!.operation, undefined);
  actor.stop();
});

test('clearing local data resets the procedure without a draft', () => {
  const actor = createActor(procedureMachine).start();
  actor.send({ type: 'RESTORE', draft: null });
  actor.send({ type: 'START' });
  actor.send({ type: 'SELECT', service: 'luz' });
  actor.send({ type: 'RESET' });
  assert.equal(actor.getSnapshot().value, 'home');
  assert.equal(actor.getSnapshot().context.draft, null);
  actor.stop();
});
test('service choice and entered bill survive backward navigation', () => {
  const actor = createActor(procedureMachine).start();
  actor.send({ type: 'RESTORE', draft: null });
  actor.send({ type: 'START' });
  actor.send({ type: 'CHOOSE', service: 'gas' });
  assert.equal(actor.getSnapshot().context.draft?.service, 'gas');
  assert.equal(actor.getSnapshot().value, 'service');
  actor.send({ type: 'SELECT', service: 'gas' });
  actor.send({ type: 'CODE', code: '200300300' });
  actor.send({ type: 'BACK' });
  actor.send({ type: 'SELECT', service: 'gas' });
  assert.equal(actor.getSnapshot().context.draft?.code, '200300300');
  actor.stop();
});
