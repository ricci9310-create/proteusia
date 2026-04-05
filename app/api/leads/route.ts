import { NextResponse } from 'next/server';
import { getLeads } from '@/lib/leads-store';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get('key');

  // Simple auth - password protection
  if (key !== 'proteus2026') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const leads = getLeads();
  return NextResponse.json({ leads, count: leads.length });
}
