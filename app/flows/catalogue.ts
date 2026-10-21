import { Bill, Service } from './contracts';
const catalogue: Record<Service, { company: string; prefix: string; amount: number }> = {
  luz: { company: 'Luz del Barrio (ficticia)', prefix: '100200', amount: 1850040 },
  gas: { company: 'Gas del Barrio (ficticia)', prefix: '200300', amount: 1240000 },
  agua: { company: 'Agua del Barrio (ficticia)', prefix: '300400', amount: 890000 },
};
export function examples(service: Service) {
  const c = catalogue[service];
  return [
    { code: c.prefix + '300', label: 'Pago aprobado' },
    { code: c.prefix + '301', label: 'Pago en revisión' },
    { code: c.prefix + '302', label: 'Pago rechazado' },
  ];
}
export function resolveBill(service: Service, code: string): Bill {
  const c = catalogue[service];
  const example = examples(service).find((x) => x.code === code);
  if (!example)
    throw new Error('Usá uno de los números de ejemplo. No encontramos esa factura de práctica.');
  return {
    code,
    service,
    company: c.company,
    holder: 'Marta Ejemplo',
    account: code.slice(0, 6),
    period: 'Octubre de 2026',
    amount: c.amount,
    scenario: code.endsWith('300') ? 'normal' : code.endsWith('301') ? 'pending' : 'failed',
  };
}
