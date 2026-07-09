import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const {
      customerName,
      phoneNumber,
      reservationDate,
      reservationTime,
      guestsCount,
      loungePreference,
    } = await request.json();

    // Verify if environmental variables are present and not placeholders
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const isPlaceholder =
      !supabaseUrl ||
      supabaseUrl === 'https://your-project-id.supabase.co' ||
      !supabaseAnonKey ||
      supabaseAnonKey === 'your-anon-key-placeholder';

    if (isPlaceholder) {
      console.warn('Supabase URL/Key is not configured. Mocking database insertion.');
      // Simulating network delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      return NextResponse.json({
        success: true,
        message: 'Mock reservation created successfully.',
        data: {
          customer_name: customerName,
          phone_number: phoneNumber,
          reservation_date: reservationDate,
          reservation_time: reservationTime,
          guests_count: guestsCount,
          lounge_preference: loungePreference,
          status: 'pending',
        },
      });
    }

    const cookieStore = await cookies();
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    });

    const { data, error } = await supabase
      .from('reservations')
      .insert([
        {
          customer_name: customerName,
          phone_number: phoneNumber,
          reservation_date: reservationDate,
          reservation_time: reservationTime,
          guests_count: guestsCount,
          lounge_preference: loungePreference,
          status: 'pending',
        },
      ])
      .select();

    if (error) {
      console.error('Supabase error inserting reservation:', error.message);
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error('Reservations API Error:', errMsg);
    return NextResponse.json({ success: false, error: errMsg }, { status: 500 });
  }
}
