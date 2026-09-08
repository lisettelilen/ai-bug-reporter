import { NextRequest, NextResponse } from 'next/server';

const networkErrors: {
  url: string;
  statusCode: number;
  method: string;
  timestamp: string;
  tabId?: number;
  type?: string;
  scanId?: string;
}[] = [];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      url,
      statusCode,
      method,
      timestamp,
      tabId,
      type,
      scanId,
    } = body;

    if (
      !url ||
      typeof statusCode !== 'number' ||
      !method ||
      !timestamp ||
      !scanId
    ) {
      return NextResponse.json(
        { error: 'Datos inválidos' },
        { status: 400 }
      );
    }

    networkErrors.push({
      url,
      statusCode,
      method,
      timestamp,
      tabId,
      type,
      scanId,
    });

    console.log('📡 NETWORK ERROR RECIBIDO:', {
      url,
      statusCode,
      method,
      scanId,
    });

    return NextResponse.json({
      success: true,
    });

  } catch (error) {
    console.error(
      'Error en /api/network-events:',
      error
    );

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const scanId = url.searchParams.get('scanId');

  const filteredErrors = scanId
    ? networkErrors.filter(
        (error) => error.scanId === scanId
      )
    : networkErrors;

  return NextResponse.json({
    errorHistory: filteredErrors,
  });
}