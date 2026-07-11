import { z } from 'zod';

/** Post del blog general de La Ecoferia (teaser en la home). */
export const BlogPostSummaryDTO = z.object({
  id: z.string().uuid(),
  title: z.string(),
  slug: z.string(),
  coverUrl: z.string().nullable(),
  publishedAt: z.string(),
});
export type BlogPostSummaryDTO = z.infer<typeof BlogPostSummaryDTO>;

/** Post del blog general, detalle completo. */
export const BlogPostDetailDTO = BlogPostSummaryDTO.extend({
  body: z.string(),
  authorName: z.string().nullable(),
});
export type BlogPostDetailDTO = z.infer<typeof BlogPostDetailDTO>;

/** Evento de la agenda cultural (teaser en la home). */
export const EventSummaryDTO = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string().nullable(),
  location: z.string().nullable(),
  startsAt: z.string(),
  coverUrl: z.string().nullable(),
});
export type EventSummaryDTO = z.infer<typeof EventSummaryDTO>;
