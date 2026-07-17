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

/** Producto en el panel de vendedor (incluye stock y campos editables sin filtrar por "publicado"). */
export const SellerProductDTO = z.object({
  id: z.string().uuid(),
  brandId: z.string().uuid(),
  brandName: z.string(),
  categoryId: z.string().uuid().nullable(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  story: z.string().nullable(),
  price: z.coerce.string(),
  stock: z.number().int(),
  imageUrl: z.string().nullable(),
  status: ProductStatus,
  seals: z.array(ImpactSeal),
});
export type SellerProductDTO = z.infer<typeof SellerProductDTO>;

const productFields = {
  name: z.string().trim().min(1, 'Ingresá un nombre').max(150),
  description: z.string().trim().max(2000).optional().or(z.literal('')),
  story: z.string().trim().max(2000).optional().or(z.literal('')),
  price: z.coerce.number().positive('El precio debe ser mayor a 0'),
  stock: z.coerce.number().int().nonnegative('El stock no puede ser negativo'),
  imageUrl: z.string().trim().max(500).optional().or(z.literal('')),
  categoryId: z.string().uuid().nullable().optional(),
  status: ProductStatus,
  seals: z.array(ImpactSeal).max(4),
};

/** Alta de producto: requiere la marca a la que pertenece (fija, no editable luego). */
export const CreateProductInput = z.object({ brandId: z.string().uuid(), ...productFields });
export type CreateProductInput = z.infer<typeof CreateProductInput>;

/** Edición de producto: la marca no se reasigna desde acá. */
export const UpdateProductInput = z.object(productFields);
export type UpdateProductInput = z.infer<typeof UpdateProductInput>;
