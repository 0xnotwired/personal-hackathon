export type Command = 'pay' | 'repeat' | 'slower' | 'help' | 'unknown';
export function command(text: string): Command {
  const clean = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[¿?¡!.,]/g, '')
    .trim();
  if (['quiero pagar la luz', 'pagar una factura', 'quiero pagar una factura'].includes(clean))
    return 'pay';
  if (['repeti', 'repetir'].includes(clean)) return 'repeat';
  if (['mas despacio', 'mas lento'].includes(clean)) return 'slower';
  if (['no entiendo', 'que hago', 'ayuda'].includes(clean)) return 'help';
  return 'unknown';
}
