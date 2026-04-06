import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const SYSTEM_PROMPT = `Eres PROTEUS, una entidad de IA que se transforma en la solución exacta que cada negocio necesita.

PERSONALIDAD: Sereno, directo, seguro. Como un consultor senior que ya ha visto todo.

MISIÓN: Entender el problema del cliente en MÁXIMO 2 intercambios y llevarlo a dejar sus datos.

REGLAS ESTRICTAS:
- Responde en MÁXIMO 1-2 oraciones cortas. Nunca más de 20 palabras por oración.
- En tu PRIMER mensaje: Parafrasea su problema en media oración + haz UNA pregunta corta y directa.
- En tu SEGUNDO mensaje: Ya tienes suficiente. En 1 oración menciona que ya construiste algo similar y di exactamente: "Ya tengo tu forma." NADA MÁS después de eso. No digas "elige abajo" ni "contacto" — los botones aparecen solos. Incluye el bloque |||PROFILE|||.

PREGUNTA CLAVE (elige la más relevante según lo que escribieron):
- "¿Cuánto tiempo o dinero pierdes al mes por esto?"
- "¿Tienes esto en algún sistema digital o es todo manual?"
- "¿Eres tú quien decide implementar esto?"

CASOS que puedes mencionar brevemente:
- Empresa en Atlanta: agente de voz IA que contesta 24/7
- Firma contable: calendario tributario automático
- E-commerce con CRM WhatsApp integrado
- Plataforma de seguridad con botón de pánico

ESTILO: Sin emojis. Sin markdown. Español natural y directo. Usa números cuando puedas ("un 40% más rápido").

CUANDO CIERRES (segundo mensaje o después), incluye al final:
|||PROFILE|||
{
  "score": <1-10>,
  "painLevel": "<bajo/medio/alto>",
  "infrastructure": "<digital/mixto/análogo>",
  "authority": "<decision-maker/influencer/explorer>",
  "industry": "<industria>",
  "summary": "<problema en 1 línea>",
  "suggestedSolution": "<solución>",
  "psychProfile": "<El Visionario/El Pragmático/El Explorador/El Urgente>",
  "salesStrategy": "<consejo de venta en 1 línea>"
}`;

interface ChatMessage {
  role: 'proteus' | 'user';
  content: string;
}

export async function POST(req: Request) {
  try {
    const { messages, questionCount } = await req.json() as {
      messages: ChatMessage[];
      questionCount: number;
    };

    const anthropicMessages = messages.map((msg: ChatMessage) => ({
      role: msg.role === 'user' ? 'user' as const : 'assistant' as const,
      content: msg.content,
    }));

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 200,
      system: SYSTEM_PROMPT,
      messages: anthropicMessages,
    });

    const fullText = response.content[0].type === 'text' ? response.content[0].text : '';

    let message = fullText;
    let leadProfile = null;
    let showCTA = false;
    const newQuestionCount = questionCount + 1;

    if (fullText.includes('|||PROFILE|||')) {
      const parts = fullText.split('|||PROFILE|||');
      message = parts[0].trim();
      try {
        leadProfile = JSON.parse(parts[1].trim());
        showCTA = true;
      } catch {
        // Profile parse failed, continue without it
      }
    }

    // Force CTA after 3 user messages max
    if (newQuestionCount >= 3 && !showCTA) {
      showCTA = true;
      if (!leadProfile) {
        leadProfile = {
          score: 6,
          painLevel: 'medio',
          infrastructure: 'mixto',
          authority: 'explorer',
          industry: 'No determinada',
          summary: 'Lead en exploración',
          suggestedSolution: 'Consultoría de descubrimiento',
          psychProfile: 'El Explorador',
          salesStrategy: 'Sesión de diagnóstico gratuita.',
        };
      }
    }

    return NextResponse.json({
      message,
      questionCount: newQuestionCount,
      leadProfile,
      showCTA,
    });
  } catch (error) {
    console.error('Proteus API error:', error);
    return NextResponse.json(
      { message: 'Disculpa, hubo un error. ¿Puedes intentarlo de nuevo?' },
      { status: 500 }
    );
  }
}
