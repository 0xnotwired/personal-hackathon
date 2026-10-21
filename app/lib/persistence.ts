import Dexie, { type EntityTable } from 'dexie';
import { z } from 'zod';
import { Draft, reviewSchema, operationSchema } from '../flows/contracts';
export type Preferences = { favorite: boolean; rate: number; muted: boolean };
export type Saved = {
  id: 'current';
  draft: Draft | null;
  preferences: Preferences;
  revision?: number;
};
export class SaveConflictError extends Error {
  constructor() {
    super('Otra pestaña cambió esta práctica guardada.');
    this.name = 'SaveConflictError';
  }
}
const database = new Dexie('autonomia-practica') as Dexie & { state: EntityTable<Saved, 'id'> };
database.version(1).stores({ state: 'id' });
const draftSchema = z.object({
  version: z.literal(1),
  id: z.uuid(),
  key: z.uuid(),
  step: z.enum(['home', 'service', 'bill', 'review', 'submitting', 'result']),
  service: z.enum(['luz', 'gas', 'agua']),
  code: z.string().max(9),
  review: reviewSchema.optional(),
  operation: operationSchema.optional(),
});
const savedSchema = z.object({
  id: z.literal('current'),
  draft: draftSchema.nullable(),
  preferences: z.object({
    favorite: z.boolean(),
    rate: z.number().min(0.5).max(1.5),
    muted: z.boolean(),
  }),
  revision: z.number().int().nonnegative().optional(),
});
let recoveryRequired = false;
let expectedRevision = 0;
let forceNextSave = false;
export function beginNewDraft() {
  recoveryRequired = false;
  forceNextSave = true;
}
export async function load(): Promise<Saved | undefined> {
  const value = await database.state.get('current');
  if (!value) return undefined;
  const parsed = savedSchema.safeParse(value);
  if (!parsed.success) {
    recoveryRequired = true;
    throw new Error('No pudimos leer lo guardado. Podés comenzar una práctica nueva.');
  }
  const draft = parsed.data.draft;
  if (
    draft?.step === 'review' &&
    (!draft.review || draft.review.draftId !== draft.id || draft.review.key !== draft.key)
  ) {
    recoveryRequired = true;
    throw new Error('La revisión guardada no está completa.');
  }
  expectedRevision = parsed.data.revision ?? 0;
  return { ...parsed.data, revision: expectedRevision };
}
let queue: Promise<unknown> = Promise.resolve();
function sameContent(current: Saved | undefined, value: Saved) {
  return (
    current !== undefined &&
    JSON.stringify(current.draft) === JSON.stringify(value.draft) &&
    JSON.stringify(current.preferences) === JSON.stringify(value.preferences)
  );
}
export function save(value: Saved, options: { force?: boolean } = {}) {
  if (recoveryRequired)
    return Promise.reject(
      new Error('Primero elegí comenzar una práctica nueva. Los datos anteriores se conservaron.'),
    );
  const write = queue
    .catch(() => {})
    .then(() =>
      database.transaction('rw', database.state, async () => {
        const current = await database.state.get('current');
        const storedRevision = current?.revision ?? 0;
        if (!options.force && !forceNextSave && storedRevision !== expectedRevision) {
          if (sameContent(current, value)) {
            expectedRevision = storedRevision;
            return storedRevision;
          }
          throw new SaveConflictError();
        }
        const revision = Math.max(storedRevision, expectedRevision) + 1;
        await database.state.put({ ...value, revision });
        expectedRevision = revision;
        forceNextSave = false;
        return revision;
      }),
    );
  queue = write;
  return write;
}
export function clear() {
  const write = queue
    .catch(() => {})
    .then(async () => {
      await database.state.clear();
      recoveryRequired = false;
      expectedRevision = 0;
      forceNextSave = false;
    });
  queue = write;
  return write;
}
