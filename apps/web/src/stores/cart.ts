import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  imageUrl: string | null;
  brandId: string;
  brandName: string;
  brandSlug: string;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  add: (item: Omit<CartItem, 'quantity'>, qty?: number) => void;
  remove: (productId: string) => void;
  setQuantity: (productId: string, qty: number) => void;
  clear: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      add: (item, qty = 1) =>
        set((s) => {
          const existing = s.items.find((i) => i.productId === item.productId);
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.productId === item.productId ? { ...i, quantity: i.quantity + qty } : i,
              ),
            };
          }
          return { items: [...s.items, { ...item, quantity: qty }] };
        }),
      remove: (productId) =>
        set((s) => ({ items: s.items.filter((i) => i.productId !== productId) })),
      setQuantity: (productId, qty) =>
        set((s) => ({
          items:
            qty <= 0
              ? s.items.filter((i) => i.productId !== productId)
              : s.items.map((i) => (i.productId === productId ? { ...i, quantity: qty } : i)),
        })),
      clear: () => set({ items: [] }),
    }),
    { name: 'ecoferia-cart' },
  ),
);

/** Cantidad total de ítems (para el badge del carrito). */
export const selectCartCount = (s: CartState) => s.items.reduce((n, i) => n + i.quantity, 0);

/** Subtotal del carrito. */
export const selectCartTotal = (s: CartState) =>
  s.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

export type CartBrandGroup = {
  brandId: string;
  brandName: string;
  brandSlug: string;
  items: CartItem[];
  subtotal: number;
};

/** Agrupa los ítems del carrito por marca (RF-01: multimarca). */
export function groupByBrand(items: CartItem[]): CartBrandGroup[] {
  const map = new Map<string, CartBrandGroup>();
  for (const it of items) {
    const group = map.get(it.brandId) ?? {
      brandId: it.brandId,
      brandName: it.brandName,
      brandSlug: it.brandSlug,
      items: [],
      subtotal: 0,
    };
    group.items.push(it);
    group.subtotal += it.price * it.quantity;
    map.set(it.brandId, group);
  }
  return [...map.values()];
}
