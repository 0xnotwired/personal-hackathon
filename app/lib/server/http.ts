import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { ZodType } from 'zod';
const cookieName = 'autonomia-session';
export function session(req: NextRequest) {
  const id = req.cookies.get(cookieName)?.value;
  return id && /^[0-9a-f-]{36}$/.test(id) ? id : undefined;
}
export function json(req: NextRequest, data: unknown, status = 200, newSession?: string) {
  const res = NextResponse.json(data, { status, headers: { 'Cache-Control': 'no-store' } });
  if (newSession)
    res.cookies.set(cookieName, newSession, {
      httpOnly: true,
      sameSite: 'strict',
      secure: req.nextUrl.protocol === 'https:',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });
  return res;
}
export function sameOrigin(req: NextRequest) {
  if (req.headers.get('origin') !== `${req.nextUrl.protocol}//${req.headers.get('host')}`)
    throw new Error('Abrí esta página desde su dirección original para continuar.');
}
export async function parse<T>(req: NextRequest, schema: ZodType<T>): Promise<T> {
  sameOrigin(req);
  if (!req.headers.get('content-type')?.startsWith('application/json'))
    throw new Error('La solicitud no tiene el formato esperado.');
  const reader = req.body?.getReader();
  if (!reader) throw new Error('Faltan los datos de la solicitud.');
  let size = 0;
  const chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 4096) {
      await reader.cancel();
      throw new Error('La solicitud es demasiado larga.');
    }
    chunks.push(value);
  }
  const parsed = schema.safeParse(JSON.parse(Buffer.concat(chunks).toString('utf8')));
  if (!parsed.success) throw new Error('Revisá los datos de práctica e intentá de nuevo.');
  return parsed.data;
}
export function fail(req: NextRequest, error: unknown) {
  const message = error instanceof Error ? error.message : '';
  // Do not disclose SQL paths, payloads or engine errors to the browser/logs.
  const safe =
    /^(Usá|Esta práctica|La factura|No pudimos verificar|No encontramos|Abrí esta|La solicitud|Faltan|Revisá)/.test(
      message,
    );
  return json(
    req,
    {
      error: safe
        ? message
        : 'No pudimos consultar el registro. Tu resultado no está confirmado. Intentá consultar de nuevo.',
    },
    safe ? 400 : 503,
  );
}
export const newSession = () => randomUUID();
