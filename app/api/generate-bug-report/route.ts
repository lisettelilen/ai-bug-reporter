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
        { report: 'Error: No se encontró OPENAI_API_KEY en las variables de entorno.' },
        { status: 500 }
      );
    }

    // Normalizar la evidencia para evitar pasar blobs o base64 masivos que rompan el contexto
    let processedEvidence = evidence;
    if (typeof evidence === 'object' && evidence !== null) {
      const sanitized = { ...evidence };
      if (sanitized.videoBlob || sanitized.recordingData) {
        sanitized.videoSummary = 'Screen recording attached: Inspecting captured DOM / Network timeline during reproduction.';
        delete sanitized.videoBlob;
        delete sanitized.recordingData;
      }
      processedEvidence = sanitized;
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `
Eres un Lead QA Automation & Software Testing Specialist. Tu trabajo es transformar logs técnicos, trazas de error de red y capturas de sesión en un reporte de bug profesional listo para Jira o Linear.

OBJETIVO:
Analiza la evidencia provista en EVIDENCE y genera un reporte técnico preciso y conciso.

DIRECTIVAS ESPECÍFICAS:
1. Precisión sobre especulación: Describe rigurosamente lo que la evidencia demuestra (códigos HTTP 4xx/5xx, excepciones JS, endpoints involucrados y rutas de navegación).
2. Títulos claros: Sigue el formato "[Módulo/Ruta] - Error observado (ej. HTTP 404 Not Found al consultar recurso X)".
3. Pasos de reproducción: Formula pasos orientados a QA basados en la traza técnica (ej. 1. Navegar a la ruta indicada. 2. Disparar el evento de red correspondiente. 3. Inspeccionar respuesta de red).
4. Evidencia visual/404: Si la evidencia indica una pantalla de error genérica (ej. 404 Not Found, Server Crash o ruta no encontrada), especifica claramente que la ruta/recurso solicitado no existe o no devolvió payload válido. No inventes reglas de negocio no comprobables.
5. Prioridad: Clasifica objetivamente según impacto ("Critical", "High", "Medium", "Low", "Backlog"). Un fallo 500 en endpoint central suele ser High/Critical; un 404 en recurso inexistente suele ser Medium o Low según el contexto.
6. Idioma: Genera el contenido en español profesional y técnico.
`,
        },
        {
          role: 'user',
          content: `EVIDENCE:\n${typeof processedEvidence === 'string' ? processedEvidence : JSON.stringify(processedEvidence, null, 2)}`,
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
              priority: {
                type: 'string',
                enum: ['Critical', 'High', 'Medium', 'Low', 'Backlog'],
              },
              preconditions: {
                type: 'array',
                items: { type: 'string' },
              },
              stepsToReproduce: { type: 'string' },
              actualResult: { type: 'string' },
              expectedResult: { type: 'string' },
              environment: { type: 'string' },
              technicalCause: { type: 'string' },
            },
            required: [
              'title',
              'description',
              'priority',
              'preconditions',
              'stepsToReproduce',
              'actualResult',
              'expectedResult',
              'environment',
              'technicalCause',
            ],
            additionalProperties: false,
          },
        },
      },
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
        report: `Error en la API: ${error.message || 'Error interno del servidor.'}`,
      },
      { status: 500 }
    );
  }
}