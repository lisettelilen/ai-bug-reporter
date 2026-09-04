import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16' as any,
});

export async function POST() {
  try {
    // Usamos la URL de tu Vercel directamente para asegurar que arme el link completo de Stripe
    const domain = process.env.NEXT_PUBLIC_APP_URL || 'https://ai-bug-reporter-fawn.vercel.app';

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
      success_url: `${domain}/?success=true`,
      cancel_url: `${domain}/?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Error en Checkout:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}