import { z } from 'zod';
import { ImpactSeal, ProductStatus } from '../enums.js';

export const ProductSummaryDTO = z.object({
  id: z.string().uuid(),
  brandId: z.string().uuid(),
  categoryId: z.string().uuid().nullable(),
  name: z.string(),
  slug: z.string(),
  price: z.string(), // numeric(10,2) serializado como string para no perder precisión
  imageUrl: z.string().nullable(),
  status: ProductStatus,
  seals: z.array(ImpactSeal),
});
export type ProductSummaryDTO = z.infer<typeof ProductSummaryDTO>;

export const ProductDetailDTO = ProductSummaryDTO.extend({
  description: z.string().nullable(),
  story: z.string().nullable(),
  stock: z.number().int(),
  brand: z.object({ name: z.string(), slug: z.string() }),
});
export type ProductDetailDTO = z.infer<typeof ProductDetailDTO>;
