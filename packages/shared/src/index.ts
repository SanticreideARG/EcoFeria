/**
 * Esquemas Zod compartidos (DTOs) entre `apps/web` y `apps/api`.
 * El front infiere tipos con `z.infer`; la API valida entrada/salida con estos mismos esquemas.
 */
export * from './enums.js';
export * from './dto/category.js';
export * from './dto/product.js';
export * from './dto/brand.js';
export * from './dto/content.js';
export * from './dto/user.js';
export * from './dto/panel.js';
export * from './dto/order.js';
