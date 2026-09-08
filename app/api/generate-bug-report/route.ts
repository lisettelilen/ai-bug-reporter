import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export async function POST(req: Request) {
  try {
    const { evidence } = await req.json();

    if (!evidence) {
      return NextResponse.json(
        { report: 'Error: Falta el campo evidence en la solicitud.' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { report: 'Error: No se encontró OPENAI_API_KEY en .env.local.' },
        { status: 400 }
      );
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `
Eres un asistente de QA que transforma evidencia técnica en un reporte de bug.

EVIDENCE es la única fuente de verdad.

Devuelve ÚNICAMENTE un objeto JSON válido con exactamente estos campos:
{
  "title": "",
  "description": "",
  "stepsToReproduce": "",
  "actualResult": "",
  "expectedResult": "",
  "environment": "",
  "technicalCause": ""
}

Reglas estrictas:

1. No inventes información.
2. No inventes acciones realizadas por el usuario.
3. No inventes pasos de reproducción.
4. Si EVIDENCE no demuestra pasos de reproducción, usa:
   "No disponible en la evidencia proporcionada."
5. El hecho de que exista una request GET o POST NO significa que el usuario haya realizado esa acción manualmente.
6. "actualResult" debe describir únicamente lo observado en EVIDENCE.
7. "expectedResult" debe ser:
   "No disponible en la evidencia proporcionada."
   salvo que EVIDENCE contenga explícitamente el resultado esperado.
8. No deduzcas que un código HTTP 404, 500 u otro código sea incorrecto por sí mismo.
9. "environment" debe ser:
   "No disponible en la evidencia proporcionada."
   si no existe información explícita sobre el entorno.
10. "technicalCause" debe ser:
   "No disponible en la evidencia proporcionada."
   si la causa no está explícitamente demostrada.
11. No agregues campos adicionales.
12. No incluyas Markdown.
`,
        },
        {
          role: 'user',
          content: JSON.stringify(evidence, null, 2),
        },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'bug_report',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              description: { type: 'string' },
              stepsToReproduce: { type: 'string' },
              actualResult: { type: 'string' },
              expectedResult: { type: 'string' },
              environment: { type: 'string' },
              technicalCause: { type: 'string' }
            },
            required: [
              'title',
              'description',
              'stepsToReproduce',
              'actualResult',
              'expectedResult',
              'environment',
              'technicalCause'
            ],
            additionalProperties: false
          }
        }
      }
    });

    const responseData = response.choices[0]?.message?.content;

    if (!responseData) {
      return NextResponse.json(
        { report: 'Error: No se recibió contenido de la IA.' },
        { status: 500 }
      );
    }

    const report = JSON.parse(responseData);

    return NextResponse.json({ report });

  } catch (error: any) {
    console.error('Error en generate-bug-report:', error);

    return NextResponse.json(
      {
        report: `Error en la API: ${
          error.message || 'Error interno del servidor.'
        }`,
      },
      { status: 500 }
    );
  }
}