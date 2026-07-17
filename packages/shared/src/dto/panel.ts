import { z } from 'zod';
import { BrandStatus, SellerStatus } from '../enums.js';

/** Métricas globales del panel de administrador. */
export const AdminStatsDTO = z.object({
  brands: z.number().int(),
  products: z.number().int(),
  categories: z.number().int(),
  sellersApproved: z.number().int(),
  sellersPending: z.number().int(),
  clients: z.number().int(),
});
export type AdminStatsDTO = z.infer<typeof AdminStatsDTO>;

/** Vendedor en la vista de gestión del admin. */
export const AdminSellerDTO = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  status: SellerStatus,
  phone: z.string().nullable(),
  bio: z.string().nullable(),
  brandCount: z.number().int(),
});
export type AdminSellerDTO = z.infer<typeof AdminSellerDTO>;

/** Cambio de estado de un vendedor (aprobar / rechazar / volver a pendiente). */
export const UpdateSellerStatusInput = z.object({ status: SellerStatus });
export type UpdateSellerStatusInput = z.infer<typeof UpdateSellerStatusInput>;

/** Marca en el panel de vendedor. */
export const SellerBrandDTO = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  status: BrandStatus,
  productCount: z.number().int(),
});
export type SellerBrandDTO = z.infer<typeof SellerBrandDTO>;

/** Resumen del panel de vendedor: estado de aprobación + sus marcas. */
export const SellerOverviewDTO = z.object({
  sellerStatus: SellerStatus.nullable(),
  brands: z.array(SellerBrandDTO),
});
export type SellerOverviewDTO = z.infer<typeof SellerOverviewDTO>;

/** Marca en el directorio del panel de administrador. */
export const AdminBrandDTO = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  status: BrandStatus,
  categoryName: z.string().nullable(),
  ownerType: z.enum(['vendedor', 'admin']),
  ownerName: z.string(),
  productCount: z.number().int(),
});
export type AdminBrandDTO = z.infer<typeof AdminBrandDTO>;

/** Pausar / reactivar una marca. */
export const UpdateBrandStatusInput = z.object({ status: BrandStatus });
export type UpdateBrandStatusInput = z.infer<typeof UpdateBrandStatusInput>;
