import { z } from 'zod';
import { OrderStatus } from '../enums.js';

/** Ítem de un pedido (una línea de un producto de una marca). */
export const OrderItemDTO = z.object({
  id: z.string().uuid(),
  productId: z.string().uuid().nullable(),
  productName: z.string(),
  brandId: z.string().uuid(),
  brandName: z.string(),
  quantity: z.number().int(),
  unitPrice: z.coerce.string(),
});
export type OrderItemDTO = z.infer<typeof OrderItemDTO>;

const shippingAddress = z
  .object({ street: z.string(), city: z.string(), province: z.string() })
  .nullable();

/** Pedido con sus ítems. En el panel de vendedor, `items` viene filtrado a su(s) marca(s). */
export const OrderDTO = z.object({
  id: z.string().uuid(),
  status: OrderStatus,
  subtotal: z.coerce.string(),
  shippingCost: z.coerce.string(),
  total: z.coerce.string(),
  shippingAddress,
  createdAt: z.string(),
  customerName: z.string(),
  customerEmail: z.string(),
  items: z.array(OrderItemDTO),
});
export type OrderDTO = z.infer<typeof OrderDTO>;

/** Cambio de estado de un pedido (solo admin: el status es único por pedido, cruza marcas). */
export const UpdateOrderStatusInput = z.object({ status: OrderStatus });
export type UpdateOrderStatusInput = z.infer<typeof UpdateOrderStatusInput>;
