import {
  CurrencyCode,
  OrderRecord,
  OrderShippingAddress,
  PaymentMethodId,
  ShippingMethodId,
} from '../types/archive';

export interface CreateOrderPayload {
  currency: CurrencyCode;
  shippingAddress: OrderShippingAddress;
  shippingMethod: ShippingMethodId;
  paymentMethod: PaymentMethodId;
  paymentMeta?: {
    cardBrand?: string;
    cardLast4?: string;
    upiId?: string;
  };
  promoCode?: string;
  dedicationNote?: string;
  items: {
    productId: string;
    selectedSize: string;
    colorway: string;
    pleatArchitecture: 'traditional' | 'pre-pleated';
    fallPico: boolean;
    blouseTailoring: boolean;
    quantity: number;
  }[];
}

async function parseJsonSafe<T>(res: Response): Promise<T | null> {
  try {
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function createOrder(
  token: string | null,
  payload: CreateOrderPayload
): Promise<OrderRecord> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Requested-With': 'PRIYONTOR',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch('/api/orders', {
    method: 'POST',
    headers,
    credentials: 'same-origin',
    body: JSON.stringify(payload),
  });
  const data = await parseJsonSafe<{ order?: OrderRecord; error?: string }>(res);
  if (!res.ok || !data?.order) {
    throw new Error(data?.error || 'Unable to confirm your order right now.');
  }
  return data.order;
}

export async function fetchPatronOrders(token: string | null): Promise<OrderRecord[]> {
  const headers: Record<string, string> = {
    'X-Requested-With': 'PRIYONTOR',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch('/api/orders', {
    method: 'GET',
    headers,
    credentials: 'same-origin',
  });
  if (!res.ok) return [];
  const data = await parseJsonSafe<{ orders?: OrderRecord[] }>(res);
  return Array.isArray(data?.orders) ? data.orders : [];
}
