import { NextRequest } from 'next/server';
import { reviewInput } from '../../flows/contracts';
import { ledger } from '../../lib/server/ledger';
import { parse, session, json, fail, newSession } from '../../lib/server/http';
export const runtime = 'nodejs';
export async function POST(req: NextRequest) {
  try {
    const data = await parse(req, reviewInput);
    const previous = session(req);
    const owner = previous || newSession();
    return json(req, ledger().review(owner, data), 200, previous ? undefined : owner);
  } catch (e) {
    return fail(req, e);
  }
}
