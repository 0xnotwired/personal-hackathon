// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Anna Tchijova
// Communication guidance adapted from ÍMPETU agent/prompts.py,
// commit 2e90c8f4ccd96f056a7d054e16545d61177e3bf6.
// Modified for es-AR digital practice: concrete optional next actions, no
// diagnosis, energy scoring, proactive nudges, account access or external agent.
import type { Step } from '../flows/contracts';
export const nextMove: Record<Step, { label: string; instruction: string }> = {
  home: {
    label: 'Elegir una práctica',
    instruction: 'Podés empezar con “Quiero practicar”, en la tarjeta Pagar una factura.',
  },
  service: {
    label: 'Elegir un servicio',
    instruction: 'Podés elegir luz, gas o agua. Después tocá el botón para seguir para seguir.',
  },
  bill: {
    label: 'Usar una factura de ejemplo',
    instruction:
      'Podés tocar “Usar este número de ejemplo”. Lo escribimos en el casillero; vos elegís cuándo buscarlo.',
  },
  review: {
    label: 'Mirar el nombre y el importe',
    instruction:
      'Podés empezar por el nombre de la factura. Después mirá el mes y el importe. Confirmá solo si querés continuar con esa factura de práctica.',
  },
  submitting: {
    label: 'Consultar qué pasó',
    instruction:
      'Podés tocar “Consultar resultado”. Consultar no vuelve a pagar. Salir tampoco cancela una operación.',
  },
  result: {
    label: 'Revisar el resultado',
    instruction:
      'Si dice “en revisión”, el pago todavía no está aprobado. Podés consultarlo. Si terminó, podés guardar el comprobante o practicar de nuevo.',
  },
};
