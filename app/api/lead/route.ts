import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, action, profile } = body;

    if (!name || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const leadData = {
      timestamp: new Date().toISOString(),
      contact: { name, email, phone: phone || null },
      action, // 'call' | 'schedule' | 'email'
      profile: {
        score: profile?.score || 0,
        painLevel: profile?.painLevel || 'unknown',
        infrastructure: profile?.infrastructure || 'unknown',
        authority: profile?.authority || 'unknown',
        industry: profile?.industry || 'unknown',
        summary: profile?.summary || '',
        suggestedSolution: profile?.suggestedSolution || '',
        psychProfile: profile?.psychProfile || '',
        salesStrategy: profile?.salesStrategy || '',
      },
    };

    // Log to Vercel logs (visible in dashboard)
    console.log('=== NUEVO LEAD PROTEUS ===');
    console.log(JSON.stringify(leadData, null, 2));
    console.log('========================');

    // Send notification email to Daniel
    try {
      await sendNotificationEmail(leadData);
    } catch (emailError) {
      console.error('Email notification failed:', emailError);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

async function sendNotificationEmail(leadData: Record<string, unknown>) {
  const contact = leadData.contact as { name: string; email: string; phone: string | null };
  const profile = leadData.profile as {
    score: number;
    painLevel: string;
    industry: string;
    summary: string;
    suggestedSolution: string;
    psychProfile: string;
    salesStrategy: string;
    authority: string;
    infrastructure: string;
  };

  const scoreEmoji = profile.score >= 8 ? '🔥' : profile.score >= 6 ? '⚡' : '💡';

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a1a; color: #e0e0e5; padding: 32px; border-radius: 16px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="font-size: 18px; color: #4f8fff; margin: 0;">⚡ NUEVA FORMA DETECTADA EN PROTEUS</h1>
      </div>

      <div style="background: rgba(79,143,255,0.1); border: 1px solid rgba(79,143,255,0.2); border-radius: 12px; padding: 20px; margin-bottom: 16px;">
        <h2 style="margin: 0 0 12px; font-size: 14px; color: #4f8fff;">CONTACTO</h2>
        <p style="margin: 4px 0; font-size: 14px;"><strong>${contact.name}</strong></p>
        <p style="margin: 4px 0; font-size: 13px; color: #888;">${contact.email}</p>
        ${contact.phone ? `<p style="margin: 4px 0; font-size: 13px; color: #888;">${contact.phone}</p>` : ''}
        <p style="margin: 8px 0 0; font-size: 12px; color: #666;">Acción: ${leadData.action}</p>
      </div>

      <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 20px; margin-bottom: 16px;">
        <h2 style="margin: 0 0 12px; font-size: 14px; color: #22d3ee;">DIAGNÓSTICO PROTEUS</h2>
        <p style="margin: 4px 0; font-size: 24px; font-weight: bold;">${scoreEmoji} Score: ${profile.score}/10</p>
        <p style="margin: 8px 0; font-size: 13px; color: #aaa;"><strong>Industria:</strong> ${profile.industry}</p>
        <p style="margin: 4px 0; font-size: 13px; color: #aaa;"><strong>Problema:</strong> ${profile.summary}</p>
        <p style="margin: 4px 0; font-size: 13px; color: #aaa;"><strong>Dolor:</strong> ${profile.painLevel} | <strong>Infra:</strong> ${profile.infrastructure} | <strong>Autoridad:</strong> ${profile.authority}</p>
        <p style="margin: 4px 0; font-size: 13px; color: #aaa;"><strong>Perfil:</strong> ${profile.psychProfile}</p>
      </div>

      <div style="background: rgba(139,92,246,0.1); border: 1px solid rgba(139,92,246,0.2); border-radius: 12px; padding: 20px;">
        <h2 style="margin: 0 0 12px; font-size: 14px; color: #8b5cf6;">ESTRATEGIA DE VENTA</h2>
        <p style="margin: 4px 0; font-size: 13px; color: #aaa;"><strong>Solución sugerida:</strong> ${profile.suggestedSolution}</p>
        <p style="margin: 4px 0; font-size: 13px; color: #aaa;"><strong>Approach:</strong> ${profile.salesStrategy}</p>
      </div>

      <p style="text-align: center; margin-top: 24px; font-size: 11px; color: #444; font-family: monospace;">— PROTEUS IA | proteusia.com</p>
    </div>
  `;

  // Send via fetch to an email API endpoint if configured
  // For now, the detailed HTML is logged to Vercel console
  console.log('Lead notification HTML prepared for:', contact.email);
  console.log('Score:', profile.score, '| Industry:', profile.industry);

  // TODO: Connect to Gmail SMTP or email service when ready
  void html; // Prepared for future email integration
}
