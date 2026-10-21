import Dexie, { type EntityTable } from 'dexie';
import { z } from 'zod';
import { Draft, reviewSchema, operationSchema } from '../flows/contracts';
export type Preferences = { favorite: boolean; rate: number; muted: boolean };
export type Saved = { id: 'current'; draft: Draft | null; preferences: Preferences };
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
});
let recoveryRequired = false;
export function beginNewDraft() {
  recoveryRequired = false;
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
  return parsed.data as Saved;
}
let queue: Promise<unknown> = Promise.resolve();
export function save(value: Saved) {
  if (recoveryRequired)
    return Promise.reject(
      new Error('Primero elegí comenzar una práctica nueva. Los datos anteriores se conservaron.'),
    );
  const write = queue.catch(() => {}).then(() => database.state.put(value));
  queue = write;
  return write;
}
