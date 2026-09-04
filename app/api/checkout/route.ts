import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
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

    // Detectamos el origen real automáticamente desde el navegador (localhost o Vercel)
    const origin = req.headers.get('origin') || req.headers.get('referer') || 'https://ai-bug-reporter-fawn.vercel.app';
    const baseUrl = origin.replace(/\/$/, '');

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