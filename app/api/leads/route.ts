import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get('key');

  if (key !== 'proteus2026') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Read from Intel Hub database
  const prospects = await prisma.prospect.findMany({
    where: { channel: 'Proteus' },
    orderBy: { createdAt: 'desc' },
  });

  const leads = prospects.map((p) => {
    const profile = (p.proteusProfile as Record<string, string>) || {};
    return {
      id: p.id,
      timestamp: p.createdAt.toISOString(),
      name: p.contactName || p.name,
      email: p.email || '',
      phone: p.phone || null,
      action: profile.contactAction || 'unknown',
      score: p.score || 0,
      painLevel: profile.painLevel || '',
      infrastructure: profile.infrastructure || '',
      authority: profile.authority || '',
      industry: '',
      summary: p.notes || '',
      suggestedSolution: p.service || '',
      psychProfile: profile.psychProfile || '',
      salesStrategy: profile.salesStrategy || '',
    };
  });

  return NextResponse.json({ leads, count: leads.length });
}
