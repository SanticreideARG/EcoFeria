import { z } from 'zod';

/** Mensaje individual dentro de un hilo. `fromCustomer` distingue el lado
 * cliente del lado marca (rol del remitente), no la identidad exacta. */
export const MessageDTO = z.object({
  id: z.string().uuid(),
  body: z.string(),
  fromCustomer: z.boolean(),
  createdAt: z.string(),
  readAt: z.string().nullable(),
});
export type MessageDTO = z.infer<typeof MessageDTO>;

/** Hilo de conversación cliente↔marca, con todos sus mensajes (volumen bajo). */
export const MessageThreadDTO = z.object({
  threadId: z.string().uuid(),
  brandId: z.string().uuid(),
  brandName: z.string(),
  customerName: z.string(),
  customerEmail: z.string(),
  hasUnread: z.boolean(),
  messages: z.array(MessageDTO),
});
export type MessageThreadDTO = z.infer<typeof MessageThreadDTO>;

export const SendMessageInput = z.object({
  body: z.string().trim().min(1, 'Escribí un mensaje').max(2000),
});
export type SendMessageInput = z.infer<typeof SendMessageInput>;
