import { NextRequest, NextResponse } from 'next/server';
import Pusher from 'pusher';

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    if (!action) {
      return NextResponse.json({ error: 'Action is required' }, { status: 400 });
    }

    // Trigger the event to all connected clients
    await pusher.trigger('slides-channel', 'slide-change', { action });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Pusher error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
