import { setup, assign } from 'xstate';
import { Draft, Operation, Review, Service, Step, createDraft } from './contracts';
type Context = { draft: Draft | null };
export type PracticeEvent =
  | { type: 'RESTORE'; draft: Draft | null }
  | { type: 'START' }
  | { type: 'RESUME' }
  | { type: 'LEAVE' }
  | { type: 'SELECT'; service: Service }
  | { type: 'CHOOSE'; service: Service }
  | { type: 'CODE'; code: string }
  | { type: 'REVIEW'; review: Review }
  | { type: 'BACK' }
  | { type: 'CONFIRM' }
  | { type: 'VERIFIED'; operation: Operation }
  | { type: 'OPEN'; operation: Operation }
  | { type: 'RESET' };
const restoreTargets = (['service', 'bill', 'review', 'submitting', 'result'] as const).map(
  (step) => ({
    guard: ({ context }: { context: Context }) => context.draft?.step === step,
    target: step,
  }),
);
export const procedureMachine = setup({
  types: { context: {} as Context, events: {} as PracticeEvent },
  guards: {
    matchingResult: ({ context, event }) =>
      event.type === 'VERIFIED' && event.operation.draftId === context.draft?.id,
    matchingReview: ({ context, event }) =>
      event.type === 'REVIEW' &&
      event.review.draftId === context.draft?.id &&
      event.review.key === context.draft.key &&
      event.review.bill.code === context.draft.code,
  },
  actions: {
    recordResult: assign({
      draft: ({ context, event }) =>
        context.draft && event.type === 'VERIFIED'
          ? { ...context.draft, step: 'result' as const, operation: event.operation }
          : context.draft,
    }),
  },
}).createMachine({
  id: 'practice',
  initial: 'loading',
  context: { draft: null },
  on: {
    LEAVE: { target: '.home' },
    START: { target: '.service', actions: assign({ draft: () => createDraft() }) },
    OPEN: {
      target: '.result',
      actions: assign({
        draft: ({ event }) =>
          event.type === 'OPEN'
            ? {
                version: 1,
                id: event.operation.draftId,
                key: crypto.randomUUID(),
                step: 'result',
                service: event.operation.bill.service,
                code: event.operation.bill.code,
                operation: event.operation,
              }
            : null,
      }),
    },
    VERIFIED: { guard: 'matchingResult', target: '.result', actions: 'recordResult' },
    RESET: { target: '.home', actions: assign({ draft: () => null }) },
  },
  states: {
    loading: {
      on: {
        RESTORE: { target: 'restored', actions: assign({ draft: ({ event }) => event.draft }) },
      },
    },
    restored: { always: [...restoreTargets, { target: 'home' }] },
    home: {
      on: {
        VERIFIED: { guard: 'matchingResult', actions: 'recordResult' },
        RESUME: restoreTargets,
      },
    },
    service: {
      entry: assign({
        draft: ({ context }) => (context.draft ? { ...context.draft, step: 'service' } : null),
      }),
      on: {
        CHOOSE: {
          actions: assign({
            draft: ({ context, event }) => ({
              ...context.draft!,
              service: event.service,
              code: event.service === context.draft?.service ? context.draft.code : '',
              review: undefined,
            }),
          }),
        },
        SELECT: {
          target: 'bill',
          actions: assign({
            draft: ({ context, event }) => ({
              ...context.draft!,
              service: event.service,
              code: context.draft?.service === event.service ? context.draft.code : '',
              review: undefined,
              key: crypto.randomUUID(),
            }),
          }),
        },
        BACK: 'home',
      },
    },
    bill: {
      entry: assign({
        draft: ({ context }) => (context.draft ? { ...context.draft, step: 'bill' } : null),
      }),
      on: {
        CODE: {
          actions: assign({
            draft: ({ context, event }) => ({
              ...context.draft!,
              code: event.code,
              key: event.code === context.draft?.code ? context.draft.key : crypto.randomUUID(),
              review: undefined,
            }),
          }),
        },
        REVIEW: {
          guard: 'matchingReview',
          target: 'review',
          actions: assign({
            draft: ({ context, event }) => ({ ...context.draft!, review: event.review }),
          }),
        },
        BACK: {
          target: 'service',
          actions: assign({
            draft: ({ context }) => ({
              ...context.draft!,
              key: crypto.randomUUID(),
              review: undefined,
            }),
          }),
        },
      },
    },
    review: {
      entry: assign({
        draft: ({ context }) => (context.draft ? { ...context.draft, step: 'review' } : null),
      }),
      on: {
        CONFIRM: 'submitting',
        BACK: {
          target: 'bill',
          actions: assign({
            draft: ({ context }) => ({
              ...context.draft!,
              key: crypto.randomUUID(),
              review: undefined,
            }),
          }),
        },
      },
    },
    submitting: {
      entry: assign({
        draft: ({ context }) => (context.draft ? { ...context.draft, step: 'submitting' } : null),
      }),
      on: {
        REVIEW: {
          guard: 'matchingReview',
          target: 'review',
          actions: assign({
            draft: ({ context, event }) => ({ ...context.draft!, review: event.review }),
          }),
        },
      },
    },
    result: {
      entry: assign({
        draft: ({ context }) => (context.draft ? { ...context.draft, step: 'result' } : null),
      }),
    },
  },
});
export function currentStep(value: unknown): Step | 'loading' {
  return value as Step | 'loading';
}
