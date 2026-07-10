import { z } from 'zod';
import { BrandStatus } from '../enums.js';

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

export const BrandDetailDTO = BrandSummaryDTO.extend({
  description: z.string().nullable(),
});
export type BrandDetailDTO = z.infer<typeof BrandDetailDTO>;

/** Formulario de contacto de la mini-landing de marca. */
export const BrandContactInput = z.object({
  name: z.string().min(1, 'Ingresá tu nombre'),
  email: z.string().email('Email inválido'),
  message: z.string().min(1, 'Escribí un mensaje'),
});
export type BrandContactInput = z.infer<typeof BrandContactInput>;
