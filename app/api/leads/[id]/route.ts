import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const VALID_STATUSES = ['LEAD', 'CONTACTED', 'PROPOSAL_SENT', 'NEGOTIATION', 'WON', 'LOST'] as const;
type ValidStatus = (typeof VALID_STATUSES)[number];

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get('key');

  if (key !== 'proteus2026') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { status } = body as { status?: string };

    if (!status || !VALID_STATUSES.includes(status as ValidStatus)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const updated = await prisma.prospect.update({
      where: { id: params.id },
      data: { status: status as ValidStatus },
    });

    return NextResponse.json({ success: true, id: updated.id, status: updated.status });
  } catch (error) {
    console.error('Lead update error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
