import { z } from 'zod';
import { UserRole } from '../enums.js';

/** Perfil del usuario autenticado (GET /me). */
export const UserProfileDTO = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  role: UserRole,
  phone: z.string().nullable(),
  address: z.string().nullable(),
  image: z.string().nullable(),
});
export type UserProfileDTO = z.infer<typeof UserProfileDTO>;

/** Datos editables del perfil (PATCH /me). */
export const UpdateProfileInput = z.object({
  name: z.string().trim().min(1, 'Ingresá tu nombre completo').max(120),
  phone: z.string().trim().max(40).optional().or(z.literal('')),
  address: z.string().trim().max(300).optional().or(z.literal('')),
});
export type UpdateProfileInput = z.infer<typeof UpdateProfileInput>;
