import { NextRequest } from 'next/server';
import { z } from 'zod';
import { ledger } from '../../lib/server/ledger';
import { parse, session, json, fail, clearSession } from '../../lib/server/http';
import { allow } from '../../lib/server/rate-limit';
export const runtime = 'nodejs';
export async function POST(req: NextRequest) {
  try {
    await parse(req, z.object({}).strict());
    const owner = session(req);
    if (owner) {
      if (!allow(owner))
        throw new Error(
          'Esta práctica recibió muchas consultas seguidas. Esperá un minuto y volvé a intentar.',
        );
      ledger().clear(owner);
    }
    const response = json(req, { ok: true });
    clearSession(req, response);
    return response;
  } catch (e) {
    return fail(req, e);
  }
}
