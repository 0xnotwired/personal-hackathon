import { NextRequest } from 'next/server';
import { ledger } from '../../../../lib/server/ledger';
import { parse, session, json, fail } from '../../../../lib/server/http';
import { allow } from '../../../../lib/server/rate-limit';
import { z } from 'zod';
export const runtime = 'nodejs';
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await parse(req, z.object({}).strict());
    const owner = session(req);
    if (!owner) return json(req, { error: 'No encontramos esta práctica en este navegador.' }, 404);
    if (!allow(owner))
      throw new Error(
        'Esta práctica recibió muchas consultas seguidas. Esperá un minuto y volvé a intentar.',
      );
    return json(req, ledger().cancel(owner, (await params).id));
  } catch (e) {
    return fail(req, e);
  }
}
