import { z } from 'zod';
import { BrandStatus, ImpactSeal } from '../enums.js';
import { ProductSummaryDTO } from './product.js';

export const BrandSummaryDTO = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  tagline: z.string().nullable(),
  logoUrl: z.string().nullable(),
  coverUrl: z.string().nullable(),
  categoryId: z.string().uuid().nullable(),
  status: BrandStatus,
});
export type BrandSummaryDTO = z.infer<typeof BrandSummaryDTO>;

/** Ítem del directorio: marca + categoría, sellos agregados y conteo de productos. */
export const BrandListItemDTO = BrandSummaryDTO.extend({
  categoryName: z.string().nullable(),
  seals: z.array(ImpactSeal),
  productCount: z.number().int(),
});
export type BrandListItemDTO = z.infer<typeof BrandListItemDTO>;

export const BrandDetailDTO = BrandSummaryDTO.extend({
  description: z.string().nullable(),
});
export type BrandDetailDTO = z.infer<typeof BrandDetailDTO>;

/** Post del diario de marca (miniblog). */
export const BrandPostDTO = z.object({
  id: z.string().uuid(),
  title: z.string(),
  body: z.string(),
  imageUrl: z.string().nullable(),
  publishedAt: z.string(),
});
export type BrandPostDTO = z.infer<typeof BrandPostDTO>;

/** Mini-landing de marca: detalle + categoría + productos + diario. */
export const BrandProfileDTO = BrandDetailDTO.extend({
  categoryName: z.string().nullable(),
  products: z.array(ProductSummaryDTO),
  posts: z.array(BrandPostDTO),
});
export type BrandProfileDTO = z.infer<typeof BrandProfileDTO>;

/** Formulario de contacto de la mini-landing de marca. */
export const BrandContactInput = z.object({
  name: z.string().min(1, 'Ingresá tu nombre'),
  email: z.string().email('Email inválido'),
  message: z.string().min(1, 'Escribí un mensaje'),
});
export type BrandContactInput = z.infer<typeof BrandContactInput>;

/** Post del diario en el panel de vendedor (identifica de qué marca es, útil si gestiona N). */
export const SellerBrandPostDTO = BrandPostDTO.extend({
  brandId: z.string().uuid(),
  brandName: z.string(),
});
export type SellerBrandPostDTO = z.infer<typeof SellerBrandPostDTO>;

const brandPostFields = {
  title: z.string().trim().min(1, 'Ingresá un título').max(150),
  body: z.string().trim().min(1, 'Escribí el contenido').max(3000),
  imageUrl: z.string().trim().max(500).optional().or(z.literal('')),
};

/** Alta de post: requiere la marca a la que pertenece. */
export const CreateBrandPostInput = z.object({ brandId: z.string().uuid(), ...brandPostFields });
export type CreateBrandPostInput = z.infer<typeof CreateBrandPostInput>;

/** Edición de post: la marca no se reasigna. */
export const UpdateBrandPostInput = z.object(brandPostFields);
export type UpdateBrandPostInput = z.infer<typeof UpdateBrandPostInput>;
