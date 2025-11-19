import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  return new Response('Socket.IO server route', { status: 200 });
}
