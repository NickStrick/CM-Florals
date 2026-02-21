import { NextRequest, NextResponse } from 'next/server';

type TokenRequest = {
  amountCents: number;
  currency?: string;
  transactionType?: string; // e.g. "ccsale"
};

function formatAmount(cents: number) {
  return (Math.max(0, Math.round(cents)) / 100).toFixed(2);
}

export async function POST(req: NextRequest) {
  let body: TokenRequest | null = null;
  try {
    body = (await req.json()) as TokenRequest;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  if (!body || !Number.isFinite(body.amountCents) || body.amountCents <= 0) {
    return NextResponse.json({ error: 'amountCents must be a positive number.' }, { status: 400 });
  }

  const merchantId = process.env.CONVERGE_MERCHANT_ID;
  const userId = process.env.CONVERGE_USER_ID;
  const pin = process.env.CONVERGE_PIN;
  const baseUrl = process.env.CONVERGE_API_BASE_URL ?? 'https://api.convergepay.com';
  const transactionType = body.transactionType ?? 'ccsale';

  if (!merchantId || !userId || !pin) {
    return NextResponse.json(
      { error: 'Server is missing CONVERGE_MERCHANT_ID, CONVERGE_USER_ID, or CONVERGE_PIN.' },
      { status: 500 }
    );
  }

  const params = new URLSearchParams();
  params.set('ssl_merchant_id', merchantId);
  params.set('ssl_user_id', userId);
  params.set('ssl_pin', pin);
  params.set('ssl_transaction_type', transactionType);
  params.set('ssl_amount', formatAmount(body.amountCents));

  const res = await fetch(`${baseUrl.replace(/\/$/, '')}/hosted-payments/transaction_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });

  const text = await res.text().catch(() => '');
  if (!res.ok) {
    return NextResponse.json(
      { error: 'Failed to create Converge transaction token.', status: res.status, details: text.slice(0, 500) },
      { status: 502 }
    );
  }

  const token = text.trim();
  if (!token) {
    return NextResponse.json({ error: 'Converge token endpoint returned empty response.' }, { status: 502 });
  }

  return NextResponse.json({ ok: true, token });
}
