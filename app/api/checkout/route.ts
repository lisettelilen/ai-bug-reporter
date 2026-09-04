import { lemonSqueezySetup, createCheckout } from '@lemonsqueezy/lemonsqueezy.js';
import { NextResponse } from 'next/server';

lemonSqueezySetup({
  apiKey: process.env.LEMONSQUEEZY_API_KEY || '',
  onError: (error) => console.error('LemonSqueezy Error:', error),
});

export async function POST() {
  try {
    const storeId = String(process.env.LEMONSQUEEZY_STORE_ID || '');
    const variantId = String(process.env.LEMONSQUEEZY_VARIANT_ID || '');

    if (!storeId || !variantId) {
      return NextResponse.json(
        { error: 'Faltan configurar las variables de entorno LEMONSQUEEZY_STORE_ID o LEMONSQUEEZY_VARIANT_ID' },
        { status: 500 }
      );
    }

    const checkout = await createCheckout(storeId, variantId, {
      checkoutData: {
        custom: {
          user_id: '123',
        },
      },
    });

    return NextResponse.json({ url: checkout.data?.data.attributes.url });
  } catch (error: any) {
    console.error('Error al crear checkout:', error);
    return NextResponse.json({ error: error.message || 'Error al crear el checkout' }, { status: 500 });
  }
}