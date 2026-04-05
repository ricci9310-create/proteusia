import { NextResponse } from 'next/server';
import { addLead } from '@/lib/leads-store';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, action, profile } = body;

    if (!name || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const lead = {
      id: `PR-${Date.now()}`,
      timestamp: new Date().toISOString(),
      name,
      email,
      phone: phone || null,
      action,
      score: profile?.score || 0,
      painLevel: profile?.painLevel || 'unknown',
      infrastructure: profile?.infrastructure || 'unknown',
      authority: profile?.authority || 'unknown',
      industry: profile?.industry || 'unknown',
      summary: profile?.summary || '',
      suggestedSolution: profile?.suggestedSolution || '',
      psychProfile: profile?.psychProfile || '',
      salesStrategy: profile?.salesStrategy || '',
    };

    // Store in memory
    addLead(lead);

    // Also log to Vercel console as permanent backup
    console.log('=== NUEVO LEAD PROTEUS ===');
    console.log(JSON.stringify(lead, null, 2));
    console.log('========================');

    return NextResponse.json({ success: true, id: lead.id });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
