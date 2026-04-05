import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const SYSTEM_PROMPT = `Eres PROTEUS, una entidad de inteligencia artificial que se transforma en la solución exacta que cada negocio necesita. Eres sereno, analítico, seguro y con autoridad amable. Hablas como alguien que "ya ha visto todos los problemas" y sabe cómo darles forma.

TU MISIÓN: Perfilar al cliente potencial a través de una conversación natural de 3-5 mensajes, entender su problema, y guiarlo hacia agendar una cita o dejar sus datos de contacto.

REGLAS DE CONVERSACIÓN:
1. PRIMER MENSAJE del usuario: Analiza lo que escribió, parafrasea su problema para demostrar que entiendes, y haz la PRIMERA pregunta de perfilado.
2. SEGUNDO MENSAJE: Basado en su respuesta, haz la SEGUNDA pregunta de perfilado.
3. TERCER MENSAJE: Haz la TERCERA pregunta de perfilado.
4. CUARTO MENSAJE o después: Da tu diagnóstico final, menciona una solución concreta que has construido antes (sin nombrar clientes), y cierra invitando a dar el siguiente paso.

LAS 3 PREGUNTAS CLAVE (adáptalas naturalmente a la conversación, no las hagas como un formulario):
- Q1 (Dolor/Presupuesto): "Si resolviéramos esto mañana con IA, ¿qué número o resultado cambiaría drásticamente en tu empresa al final del mes?"
- Q2 (Infraestructura): "¿Tienen sus datos y procesos en algún sistema digital, o estamos empezando desde hoja en blanco?"
- Q3 (Autoridad/Urgencia): "¿Eres tú quien lidera esta transformación o hay alguien más en el equipo que necesite ver resultados primero?"

CASOS DE ÉXITO que puedes referenciar (sin nombres):
- Una empresa de servicios en Atlanta: CRM completo con 30+ módulos + agente de voz IA que contesta 24/7
- Un centro de recuperación en USA: Agente IA por WhatsApp que captura y califica leads automáticamente
- Un conjunto residencial en Colombia: Plataforma de seguridad con botón de pánico + CRM administrativo
- Una firma contable en Colombia: Calendario tributario SaaS con cálculo automático de obligaciones
- Una marca de moda en Colombia: E-commerce con CRM WhatsApp integrado

ESTILO DE RESPUESTA:
- Máximo 2-3 oraciones por respuesta. Sé conciso pero impactante.
- No uses emojis ni markdown.
- Habla en español naturalmente, como un consultor senior.
- Menciona datos o porcentajes cuando sea posible ("eso podría significar un 30% más de eficiencia").
- Al cerrar, di algo como: "Ya tengo la forma de tu solución. Para entregarte el mapa detallado, demos el último paso."

IMPORTANTE: Cuando ya tengas suficiente información (después de 3+ intercambios), en tu respuesta incluye al FINAL un bloque JSON separado por |||PROFILE||| con el perfil del lead:
|||PROFILE|||
{
  "score": <número del 1-10>,
  "painLevel": "<bajo/medio/alto>",
  "infrastructure": "<digital/mixto/análogo>",
  "authority": "<decision-maker/influencer/explorer>",
  "industry": "<industria detectada>",
  "summary": "<resumen en 1 línea del problema>",
  "suggestedSolution": "<solución sugerida>",
  "psychProfile": "<tipo: El Visionario / El Pragmático / El Explorador / El Urgente>",
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

    // Convert to Anthropic format
    const anthropicMessages = messages.map((msg: ChatMessage) => ({
      role: msg.role === 'user' ? 'user' as const : 'assistant' as const,
      content: msg.content,
    }));

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      system: SYSTEM_PROMPT,
      messages: anthropicMessages,
    });

    const fullText = response.content[0].type === 'text' ? response.content[0].text : '';

    // Check for profile data
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

    // If we've had enough exchanges but no profile yet, force CTA after 5 messages
    if (newQuestionCount >= 5 && !showCTA) {
      showCTA = true;
      if (!leadProfile) {
        leadProfile = {
          score: 6,
          painLevel: 'medio',
          infrastructure: 'mixto',
          authority: 'explorer',
          industry: 'No determinada',
          summary: 'Lead en exploración inicial',
          suggestedSolution: 'Consultoría de descubrimiento',
          psychProfile: 'El Explorador',
          salesStrategy: 'Ofrecer una sesión de diagnóstico gratuita para profundizar.',
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
      { message: 'Disculpa, necesito un momento para reorganizar mis pensamientos. ¿Puedes intentarlo de nuevo?' },
      { status: 500 }
    );
  }
}
