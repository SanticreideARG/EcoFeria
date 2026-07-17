import type { ImpactSeal } from '@ecoferia/shared';

type BrandWithProducts = {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  logoUrl: string | null;
  coverUrl: string | null;
  categoryId: string | null;
  status: 'activa' | 'pausada';
  category: { name: string } | null;
  products: { seals: { seal: ImpactSeal }[] }[];
};

/** Mapea una marca (con productos+sellos anidados) al shape de BrandListItemDTO. Usado por el
 * directorio público y por el listado de favoritos del cliente. */
export function toBrandListItem(b: BrandWithProducts) {
  return {
    id: b.id,
    name: b.name,
    slug: b.slug,
    tagline: b.tagline,
    logoUrl: b.logoUrl,
    coverUrl: b.coverUrl,
    categoryId: b.categoryId,
    status: b.status,
    categoryName: b.category?.name ?? null,
    productCount: b.products.length,
    seals: [...new Set(b.products.flatMap((p) => p.seals.map((s) => s.seal)))] as ImpactSeal[],
  };
}
