import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST() {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;

    if (!secretKey) {
      return NextResponse.json(
        { error: 'Falta configurar STRIPE_SECRET_KEY en Vercel.' },
        { status: 500 }
      );
    }

    const stripe = new Stripe(secretKey, {
      apiVersion: '2023-10-16' as any,
    });

    // Aseguramos una URL 100% válida con HTTPS
    let baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ai-bug-reporter-fawn.vercel.app';
    baseUrl = baseUrl.trim();
    
    if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
      baseUrl = `https://${baseUrl}`;
    }
    
    // Eliminamos barras al final para evitar //
    baseUrl = baseUrl.replace(/\/+$/, '');

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'AI Bug Reporter - Plan Pro',
              description: 'Acceso ilimitado a generación de reportes e integración Jira/Trello',
            },
            unit_amount: 1500, // $15.00 USD
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${baseUrl}/?success=true`,
      cancel_url: `${baseUrl}/?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Error en Checkout:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}