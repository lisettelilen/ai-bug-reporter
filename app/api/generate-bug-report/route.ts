import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export async function POST(req: Request) {
  try {
    const { log } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { report: 'Error: No se encontró OPENAI_API_KEY en el archivo .env.local.' },
        { status: 400 }
      );
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Sos un QA Lead experto. Transforma los logs o descripciones del usuario en un reporte de bug profesional para Jira en formato Markdown, incluyendo: Título, Pasos para reproducir, Resultado Esperado, Resultado Obtenido y Severidad.',
        },
        {
          role: 'user',
          content: log,
        },
      ],
    });

    const report = response.choices[0]?.message?.content || 'No se pudo generar el reporte.';

    return NextResponse.json({ report });
  } catch (error: any) {
    console.error('Error en generate-bug-report:', error);
    return NextResponse.json(
      { report: `Error en la API: ${error.message || 'Error interno del servidor.'}` },
      { status: 500 }
    );
  }
}