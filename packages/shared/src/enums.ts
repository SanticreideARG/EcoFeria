import { z } from 'zod';

/** Roles de usuario (segmentación estricta de permisos). */
export const UserRole = z.enum(['admin', 'vendedor', 'cliente']);
export type UserRole = z.infer<typeof UserRole>;

/** Sellos de impacto que se muestran como chips en productos. */
export const ImpactSeal = z.enum(['organico', 'local', 'fair_trade', 'zero_waste']);
export type ImpactSeal = z.infer<typeof ImpactSeal>;

/** Etiquetas legibles (ES) para los sellos de impacto. */
export const IMPACT_SEAL_LABELS: Record<ImpactSeal, string> = {
  organico: 'Orgánico',
  local: 'Local',
  fair_trade: 'Fair Trade',
  zero_waste: 'Zero Waste',
};

export const BrandStatus = z.enum(['activa', 'pausada']);
export type BrandStatus = z.infer<typeof BrandStatus>;

export const ProductStatus = z.enum(['publicado', 'borrador', 'agotado']);
export type ProductStatus = z.infer<typeof ProductStatus>;

export const OrderStatus = z.enum([
  'pendiente',
  'confirmado',
  'enviado',
  'entregado',
  'cancelado',
]);
export type OrderStatus = z.infer<typeof OrderStatus>;

export const SellerStatus = z.enum(['pendiente', 'aprobado', 'rechazado']);
export type SellerStatus = z.infer<typeof SellerStatus>;
