import { z } from 'zod';

export const CategoryDTO = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  icon: z.string().nullable(),
});
export type CategoryDTO = z.infer<typeof CategoryDTO>;
