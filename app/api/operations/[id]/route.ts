import { NextRequest } from 'next/server';
import { ledger } from '../../../lib/server/ledger';
import { session, json, fail } from '../../../lib/server/http';
export const runtime = 'nodejs';
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const owner = session(req);
    const { id } = await params;
    const operation = owner ? ledger().get(owner, id) : undefined;
    return operation
      ? json(req, operation)
      : json(req, { error: 'No encontramos esta práctica en este navegador.' }, 404);
  } catch (e) {
    return fail(req, e);
  }
}
