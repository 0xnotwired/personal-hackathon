import { z } from 'zod';
export const services = ['luz', 'gas', 'agua'] as const;
export type Service = (typeof services)[number];
export const serviceNames: Record<Service, string> = { luz: 'Luz', gas: 'Gas', agua: 'Agua' };
export const reviewInput = z
  .object({
    draftId: z.uuid(),
    key: z.uuid(),
    service: z.enum(services),
    code: z.string().regex(/^\d{9}$/),
  })
  .strict();
export const commitInput = z
  .object({ reviewId: z.uuid(), key: z.uuid(), confirmed: z.literal(true) })
  .strict();
export type ReviewInput = z.infer<typeof reviewInput>;
export type Bill = {
  code: string;
  service: Service;
  company: string;
  holder: string;
  account: string;
  period: string;
  amount: number;
  scenario: 'normal' | 'pending' | 'failed';
};
export type Review = { id: string; draftId: string; key: string; bill: Bill };
export type Operation = {
  id: string;
  draftId: string;
  status: 'succeeded' | 'pending' | 'failed' | 'cancelled';
  bill: Bill;
  createdAt: number;
  readyAt: number;
};
export const stepCopy = {
  home: {
    title: '¿Qué necesitás hacer?',
    help: 'Elegí Pagar una factura para practicar. Es un simulador: no es tu banco ni una app de pagos real, y no necesitás una cuenta ni datos bancarios.',
    primary: 'Pagar una factura',
    back: 'Inicio',
  },
  service: {
    title: '¿Qué servicio querés pagar?',
    help: 'Elegí luz, gas o agua. Usaremos una factura de ejemplo, sin dinero real.',
    primary: 'Seguir',
    back: 'Inicio',
  },
  bill: {
    title: 'Busquemos tu factura de práctica',
    help: 'Escribí el número de 9 cifras de la factura de ejemplo. No uses datos de una factura real.',
    primary: 'Buscar factura',
    back: 'Cambiar servicio',
  },
  review: {
    title: 'Revisá antes de confirmar',
    help: 'Leé a quién corresponde la factura, el número de cuenta, el mes y el importe. Si está bien, confirmá con el botón. La voz no puede confirmar.',
    primary: 'Confirmar pago de práctica',
    back: 'Corregir factura',
  },
  submitting: {
    title: 'Estamos consultando el resultado',
    help: 'Esperá el resultado o elegí Consultar resultado. Salir no cancela la operación. No hace falta volver a pagar.',
    primary: 'Consultar resultado',
    back: 'Guardar y salir',
  },
  result: {
    title: 'Resultado de tu práctica',
    help: 'El resultado viene del registro de práctica. Si está en revisión podés consultarlo o pedir una cancelación. Salir no cancela una operación.',
    primary: 'Consultar resultado',
    back: 'Inicio',
  },
} as const;
export type Step = keyof typeof stepCopy;
export type Draft = {
  version: 1;
  id: string;
  key: string;
  step: Step;
  service: Service;
  code: string;
  review?: Review;
  operation?: Operation;
};
export function createDraft(): Draft {
  return {
    version: 1,
    id: crypto.randomUUID(),
    key: crypto.randomUUID(),
    step: 'service',
    service: 'luz',
    code: '',
  };
}
export const money = (centavos: number) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(centavos / 100);

export const billSchema = z
  .object({
    code: z.string().regex(/^\d{9}$/),
    service: z.enum(services),
    company: z.string().max(100),
    holder: z.string().max(100),
    account: z.string().max(30),
    period: z.string().max(50),
    amount: z.number().int().positive().max(100000000),
    scenario: z.enum(['normal', 'pending', 'failed']),
  })
  .strict();
export const reviewSchema = z
  .object({ id: z.uuid(), draftId: z.uuid(), key: z.uuid(), bill: billSchema })
  .strict();
export const operationSchema = z
  .object({
    id: z.uuid(),
    draftId: z.uuid(),
    status: z.enum(['succeeded', 'pending', 'failed', 'cancelled']),
    bill: billSchema,
    createdAt: z.number().int(),
    readyAt: z.number().int(),
  })
  .strict();
