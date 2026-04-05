import { NextResponse } from 'next/server';

// Premade voice "Daniel" - calm, authoritative male
const VOICE_ID = 'onwK4e9ZLuTAKqWW03F9';

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'Missing text' }, { status: 400 });
    }

    if (!process.env.ELEVENLABS_API_KEY) {
      console.error('ELEVENLABS_API_KEY not configured');
      return NextResponse.json({ error: 'TTS not configured' }, { status: 500 });
    }

    console.log('TTS request for text:', text.substring(0, 50) + '...');

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_22050_32`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': process.env.ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs error:', response.status, errorText);
      return NextResponse.json({ error: 'TTS failed', detail: errorText }, { status: response.status });
    }

    const audioBuffer = await response.arrayBuffer();
    console.log('TTS audio generated, size:', audioBuffer.byteLength);

    return new Response(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString(),
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('TTS error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
