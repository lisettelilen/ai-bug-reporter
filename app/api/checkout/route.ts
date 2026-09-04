import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const apiKey = process.env.STRIPE_SECRET_KEY;

export async function POST() {
  try {
    // Si no hay API Key de Stripe, devolvemos una URL simulada para no romper la UX
    if (!apiKey) {
      return NextResponse.json({ 
        url: 'https://checkout.stripe.com/pay/cs_test_simulated' 
      });
    }

    const stripe = new Stripe(apiKey, {
      apiVersion: '2023-10-16' as any,
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'AI Bug Reporter Pro',
              description: 'Generación ilimitada de reportes y exportación en 1 clic.',
            },
            unit_amount: 1500, // $15.00 USD
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Error en Stripe Checkout:', error);
    return NextResponse.json({ error: 'Error al iniciar el pago' }, { status: 500 });
  }
}