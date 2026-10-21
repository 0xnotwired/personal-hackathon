import { NextRequest } from 'next/server';
import { commitInput } from '../../flows/contracts';
import { ledger } from '../../lib/server/ledger';
import { parse, session, json, fail } from '../../lib/server/http';
import { allow } from '../../lib/server/rate-limit';
export const runtime = 'nodejs';
export async function POST(req: NextRequest) {
  try {
    const data = await parse(req, commitInput);
    const owner = session(req);
    if (!owner)
      return json(
        req,
        {
          error:
            'Este navegador perdió el acceso a la práctica. Volvé al inicio para comenzar otra.',
        },
        401,
      );
    if (!allow(owner))
      throw new Error(
        'Esta práctica recibió muchas consultas seguidas. Esperá un minuto y volvé a intentar.',
      );
    return json(req, ledger().commit(owner, data.reviewId, data.key));
  } catch (e) {
    return fail(req, e);
  }
}
export async function GET(req: NextRequest) {
  try {
    const owner = session(req);
    if (!owner) return json(req, []);
    const draft = req.nextUrl.searchParams.get('draftId') || undefined;
    if (draft && !/^[0-9a-f-]{36}$/.test(draft))
      return json(req, { error: 'Identificador inválido.' }, 400);
    return json(req, ledger().list(owner, draft));
  } catch (e) {
    return fail(req, e);
  }
}
