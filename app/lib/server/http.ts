import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { ZodType } from 'zod';
const cookieName = 'autonomia-session';
function isSecure(req: NextRequest) {
  const forwarded = req.headers.get('x-forwarded-proto')?.split(',')[0]?.trim();
  return forwarded === 'https' || req.nextUrl.protocol === 'https:';
}
function cookieOptions(req: NextRequest) {
  return {
    httpOnly: true,
    sameSite: 'strict' as const,
    secure: isSecure(req),
    path: '/',
  };
}
export function session(req: NextRequest) {
  const id = req.cookies.get(cookieName)?.value;
  return id && /^[0-9a-f-]{36}$/.test(id) ? id : undefined;
}
export function json(req: NextRequest, data: unknown, status = 200, newSession?: string) {
  const res = NextResponse.json(data, { status, headers: { 'Cache-Control': 'no-store' } });
  if (newSession)
    res.cookies.set(cookieName, newSession, {
      ...cookieOptions(req),
      maxAge: 60 * 60 * 24 * 7,
    });
  return res;
}
export function clearSession(req: NextRequest, res: NextResponse) {
  res.cookies.set(cookieName, '', { ...cookieOptions(req), maxAge: 0 });
}
export function sameOrigin(req: NextRequest) {
  const origin = req.headers.get('origin');
  const host = req.headers.get('host');
  if (!origin || !host)
    throw new Error('Abrí esta página desde su dirección original para continuar.');
  let source: URL;
  try {
    source = new URL(origin);
  } catch {
    throw new Error('Abrí esta página desde su dirección original para continuar.');
  }
  // Compare hosts, not schemes: a TLS-terminating proxy may present https to the
  // browser while the Node process receives the request over http.
  if (!['http:', 'https:'].includes(source.protocol) || source.host !== host)
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
