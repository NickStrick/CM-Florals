import { NextRequest, NextResponse } from 'next/server';
import { createOrder } from '@/lib/ordersDb';
import type { OrderItem } from '@/types/orders';

type CreateOrderBody = {
  businessId?: string;
  siteId?: string;
  customerEmail?: string;
  customerName?: string;
  items?: OrderItem[];
  total?: number;
  currency?: string;
  status?: string;
  notes?: string;
  [key: string]: unknown;
};

export async function POST(req: NextRequest) {
  let body: CreateOrderBody | null = null;
  try {
    body = (await req.json()) as CreateOrderBody;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const envSiteId = process.env.NEXT_PUBLIC_SITE_ID || '';
  const requestedId = (body?.businessId || body?.siteId || '').trim();
  const businessId = envSiteId || requestedId;
  if (!businessId.trim()) {
    return NextResponse.json({ error: 'businessId is required.' }, { status: 400 });
  }
  if (envSiteId && requestedId && requestedId !== envSiteId) {
    return NextResponse.json({ error: 'Invalid businessId for this site.' }, { status: 403 });
  }

  const customerEmail = body?.customerEmail?.trim() || '';
  if (!customerEmail) {
    return NextResponse.json({ error: 'customerEmail is required.' }, { status: 400 });
  }

  const items = Array.isArray(body?.items) ? body?.items : null;
  if (!items) {
    return NextResponse.json({ error: 'items must be an array.' }, { status: 400 });
  }

  const total = typeof body?.total === 'number' ? body.total : NaN;
  if (!Number.isFinite(total)) {
    return NextResponse.json({ error: 'total must be a number.' }, { status: 400 });
  }

  const currency = body?.currency?.trim() || '';
  if (!currency) {
    return NextResponse.json({ error: 'currency is required.' }, { status: 400 });
  }

  const { customerName, status, notes, ...rest } = body || {};

  try {
    const order = await createOrder({
      businessId,
      customerEmail,
      customerName,
      items,
      total,
      currency,
      status,
      notes,
      ...rest,
    });

    console.log('[orders] created', {
      businessId: order.businessId,
      orderId: order.orderId,
      createdAt: order.createdAt,
      createdAtOrderId: order.createdAtOrderId,
      status: order.status,
      total: order.total,
      currency: order.currency,
      itemsCount: order.items?.length ?? 0,
    });

    return NextResponse.json(
      {
        ok: true,
        order: {
          businessId: order.businessId,
          orderId: order.orderId,
          createdAt: order.createdAt,
          createdAtOrderId: order.createdAtOrderId,
          expiresAt: order.expiresAt,
          status: order.status,
          customerEmail: order.customerEmail,
          customerName: order.customerName,
          total: order.total,
          currency: order.currency,
          items: order.items,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('[orders] create failed', err);
    return NextResponse.json({ error: 'Failed to create order.' }, { status: 500 });
  }
}
