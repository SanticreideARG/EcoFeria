import { pgEnum } from 'drizzle-orm/pg-core';

export const userRole = pgEnum('user_role', ['admin', 'vendedor', 'cliente']);
export const sellerStatus = pgEnum('seller_status', ['pendiente', 'aprobado', 'rechazado']);
export const brandStatus = pgEnum('brand_status', ['activa', 'pausada']);
export const productStatus = pgEnum('product_status', ['publicado', 'borrador', 'agotado']);
export const orderStatus = pgEnum('order_status', [
  'pendiente',
  'confirmado',
  'enviado',
  'entregado',
  'cancelado',
]);
export const impactSeal = pgEnum('impact_seal', ['organico', 'local', 'fair_trade', 'zero_waste']);
export const eventStatus = pgEnum('event_status', ['publicado', 'borrador']);
