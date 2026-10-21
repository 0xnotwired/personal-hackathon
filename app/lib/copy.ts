export const resultCopy = {
  succeeded: {
    title: '¡Pago de práctica completado!',
    text: 'Terminaste el recorrido. No se movió dinero y no pagaste una factura real.',
    icon: 'check',
  },
  pending: {
    title: 'Tu pago de práctica está en revisión',
    text: 'Todavía no está aprobado. Podés consultar el resultado o pedir que se cancele. Salir no lo cancela.',
    icon: 'clock',
  },
  failed: {
    title: 'El pago de práctica fue rechazado',
    text: 'Este ejemplo muestra un rechazo. No se completó el pago. Podés volver a practicar con otra factura de ejemplo.',
    icon: 'help',
  },
  cancelled: {
    title: 'Tu pago de práctica fue cancelado',
    text: 'El registro confirmó la cancelación. No se completó el pago. Podés volver a practicar.',
    icon: 'check',
  },
};
