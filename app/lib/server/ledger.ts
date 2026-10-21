import { DatabaseSync } from 'node:sqlite';
import { randomUUID } from 'node:crypto';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { Bill, Operation, Review, ReviewInput, reviewInput } from '../../flows/contracts';
import { resolveBill } from '../../flows/catalogue';
type Row = {
  id: string;
  session: string;
  draft: string;
  attempt: string;
  bill: string;
  status: Operation['status'];
  created: number;
  ready: number;
};
export const MAX_REVIEWS_PER_SESSION = 100;
export const MAX_OPERATIONS_PER_SESSION = 50;
export const RETENTION_MS = 7 * 24 * 60 * 60 * 1000;
export class Ledger {
  private db: DatabaseSync;
  constructor(
    path: string,
    private now = () => Date.now(),
  ) {
    mkdirSync(dirname(path), { recursive: true });
    this.db = new DatabaseSync(path);
    this.db.exec(`PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000;
   CREATE TABLE IF NOT EXISTS reviews(id TEXT PRIMARY KEY,session TEXT NOT NULL,draft TEXT NOT NULL,attempt TEXT NOT NULL,bill TEXT NOT NULL,created INTEGER NOT NULL DEFAULT 0,UNIQUE(session,attempt));
   CREATE TABLE IF NOT EXISTS operations(id TEXT PRIMARY KEY,session TEXT NOT NULL,draft TEXT NOT NULL,attempt TEXT NOT NULL,bill TEXT NOT NULL,status TEXT NOT NULL,created INTEGER NOT NULL,ready INTEGER NOT NULL,UNIQUE(session,draft),UNIQUE(session,attempt));`);
    const columns = this.db.prepare('PRAGMA table_info(reviews)').all() as { name: string }[];
    if (!columns.some((column) => column.name === 'created')) {
      this.db.exec('ALTER TABLE reviews ADD COLUMN created INTEGER NOT NULL DEFAULT 0');
      this.db.prepare('UPDATE reviews SET created=? WHERE created=0').run(this.now());
    }
    this.cleanup();
  }
  close() {
    this.db.close();
  }
  private cleanup() {
    const cutoff = this.now() - RETENTION_MS;
    this.db.prepare('DELETE FROM operations WHERE created < ?').run(cutoff);
    this.db.prepare('DELETE FROM reviews WHERE created < ?').run(cutoff);
  }
  review(session: string, input: ReviewInput): Review {
    const data = reviewInput.parse(input);
    const bill = resolveBill(data.service, data.code);
    this.cleanup();
    if (
      this.db
        .prepare('SELECT id FROM operations WHERE session=? AND draft=?')
        .get(session, data.draftId)
    )
      throw new Error('Esta práctica ya tiene un resultado. Consultalo desde el inicio.');
    const existing = this.db
      .prepare('SELECT * FROM reviews WHERE session=? AND attempt=?')
      .get(session, data.key) as Row | undefined;
    if (existing) {
      if (existing.draft !== data.draftId || existing.bill !== JSON.stringify(bill))
        throw new Error('La factura cambió. Volvé a buscarla antes de confirmar.');
      return { id: existing.id, draftId: data.draftId, key: data.key, bill };
    }
    const count = this.db
      .prepare('SELECT COUNT(*) AS n FROM reviews WHERE session=?')
      .get(session) as { n: number };
    if (count.n >= MAX_REVIEWS_PER_SESSION)
      throw new Error(
        'Esta práctica alcanzó el límite de intentos de este navegador. Borrá los datos de práctica para empezar de nuevo.',
      );
    const id = randomUUID();
    this.db
      .prepare('INSERT INTO reviews(id,session,draft,attempt,bill,created) VALUES(?,?,?,?,?,?)')
      .run(id, session, data.draftId, data.key, JSON.stringify(bill), this.now());
    return { id, draftId: data.draftId, key: data.key, bill };
  }
  private atomic<T>(action: () => T): T {
    this.db.exec('BEGIN IMMEDIATE');
    try {
      const result = action();
      this.db.exec('COMMIT');
      return result;
    } catch (error) {
      this.db.exec('ROLLBACK');
      throw error;
    }
  }
  // The only commit boundary. Review identifiers are bound to a session and attempt.
  commit(session: string, reviewId: string, key: string): Operation {
    this.cleanup();
    return this.atomic(() => {
      const review = this.db
        .prepare('SELECT * FROM reviews WHERE id=? AND session=? AND attempt=?')
        .get(reviewId, session, key) as Row | undefined;
      if (!review)
        throw new Error('No pudimos verificar la factura. Volvé a revisarla antes de confirmar.');
      const prior = this.db
        .prepare('SELECT * FROM operations WHERE session=? AND draft=?')
        .get(session, review.draft) as Row | undefined;
      if (prior) {
        if (prior.attempt !== key)
          throw new Error('Esta práctica ya fue confirmada. Consultá el resultado.');
        return this.operation(prior);
      }
      const count = this.db
        .prepare('SELECT COUNT(*) AS n FROM operations WHERE session=?')
        .get(session) as { n: number };
      if (count.n >= MAX_OPERATIONS_PER_SESSION)
        throw new Error(
          'Esta práctica alcanzó el límite de operaciones de este navegador. Borrá los datos de práctica para empezar de nuevo.',
        );
      const bill = JSON.parse(review.bill) as Bill;
      const id = randomUUID();
      const now = this.now();
      const status =
        bill.scenario === 'normal'
          ? 'succeeded'
          : bill.scenario === 'pending'
            ? 'pending'
            : 'failed';
      this.db
        .prepare('INSERT INTO operations VALUES(?,?,?,?,?,?,?,?)')
        .run(id, session, review.draft, key, review.bill, status, now, now + 60000);
      return this.operation(this.db.prepare('SELECT * FROM operations WHERE id=?').get(id) as Row);
    });
  }
  private operation(row: Row): Operation {
    if (row.status === 'pending' && this.now() >= row.ready) {
      this.db
        .prepare("UPDATE operations SET status='succeeded' WHERE id=? AND status='pending'")
        .run(row.id);
      row = { ...row, status: 'succeeded' };
    }
    return {
      id: row.id,
      draftId: row.draft,
      status: row.status,
      bill: JSON.parse(row.bill) as Bill,
      createdAt: row.created,
      readyAt: row.ready,
    };
  }
  get(session: string, id: string): Operation | undefined {
    const row = this.db
      .prepare('SELECT * FROM operations WHERE session=? AND id=?')
      .get(session, id) as Row | undefined;
    return row ? this.operation(row) : undefined;
  }
  list(session: string, draft?: string): Operation[] {
    const rows = (
      draft
        ? this.db
            .prepare('SELECT * FROM operations WHERE session=? AND draft=?')
            .all(session, draft)
        : this.db
            .prepare('SELECT * FROM operations WHERE session=? ORDER BY created DESC LIMIT 50')
            .all(session)
    ) as Row[];
    return rows.map((row) => this.operation(row));
  }
  cancel(session: string, id: string): Operation {
    return this.atomic(() => {
      const op = this.get(session, id);
      if (!op) throw new Error('No encontramos esa práctica en este navegador.');
      if (op.status === 'pending')
        this.db
          .prepare(
            "UPDATE operations SET status='cancelled' WHERE id=? AND session=? AND status='pending'",
          )
          .run(id, session);
      return this.get(session, id)!;
    });
  }
  clear(session: string) {
    this.atomic(() => {
      this.db.prepare('DELETE FROM operations WHERE session=?').run(session);
      this.db.prepare('DELETE FROM reviews WHERE session=?').run(session);
    });
  }
}
let singleton: Ledger | undefined;
export function ledger() {
  return (singleton ??= new Ledger(process.env.LEDGER_PATH || '.data/practice.sqlite'));
}
