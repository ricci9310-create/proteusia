import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { addLead } from '@/lib/leads-store';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, action, profile } = body;

    if (!name || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const proteusProfile = {
      painLevel: profile?.painLevel || 'unknown',
      infrastructure: profile?.infrastructure || 'unknown',
      authority: profile?.authority || 'unknown',
      industry: profile?.industry || 'unknown',
      psychProfile: profile?.psychProfile || '',
      salesStrategy: profile?.salesStrategy || '',
      contactAction: action,
    };

    // Save to Intel Hub database (Prospect table)
    const prospect = await prisma.prospect.create({
      data: {
        name: name,
        contactName: name,
        email: email,
        phone: phone || null,
        channel: 'Proteus',
        service: profile?.suggestedSolution || null,
        status: 'LEAD',
        score: profile?.score || null,
        proteusProfile: proteusProfile,
        notes: profile?.summary || null,
        nextAction: action === 'call'
          ? 'Llamar al lead'
          : action === 'schedule'
          ? 'Agendar sesión'
          : 'Enviar diagnóstico por correo',
      },
    });

    // Also keep in memory store for the /leads dashboard
    addLead({
      id: prospect.id,
      timestamp: prospect.createdAt.toISOString(),
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
    });

    console.log(`✅ Lead saved to Intel Hub: ${prospect.id} - ${name} (Score: ${profile?.score})`);

    return NextResponse.json({ success: true, id: prospect.id });
  } catch (error) {
    console.error('Lead save error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
