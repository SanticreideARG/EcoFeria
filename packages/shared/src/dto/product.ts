import { z } from 'zod';
import { ImpactSeal, ProductStatus } from '../enums.js';

export const ProductSummaryDTO = z.object({
  id: z.string().uuid(),
  brandId: z.string().uuid(),
  categoryId: z.string().uuid().nullable(),
  name: z.string(),
  slug: z.string(),
  // numeric(10,2): Neon lo devuelve como string, PGlite como number => normalizamos a string.
  price: z.coerce.string(),
  imageUrl: z.string().nullable(),
  status: ProductStatus,
  seals: z.array(ImpactSeal),
});
export type ProductSummaryDTO = z.infer<typeof ProductSummaryDTO>;

/** Ítem de listado del eshop: producto + datos de marca/categoría para las cards. */
export const ProductListItemDTO = ProductSummaryDTO.extend({
  brandName: z.string(),
  brandSlug: z.string(),
  categoryName: z.string().nullable(),
});
export type ProductListItemDTO = z.infer<typeof ProductListItemDTO>;

export const ProductDetailDTO = ProductSummaryDTO.extend({
  description: z.string().nullable(),
  story: z.string().nullable(),
  stock: z.number().int(),
  categoryName: z.string().nullable(),
  brand: z.object({ name: z.string(), slug: z.string() }),
});
export type ProductDetailDTO = z.infer<typeof ProductDetailDTO>;
