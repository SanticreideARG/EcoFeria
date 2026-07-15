import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  AdminSellerDTO,
  AdminStatsDTO,
  BlogPostDetailDTO,
  BlogPostSummaryDTO,
  BrandContactInput,
  BrandListItemDTO,
  BrandProfileDTO,
  CategoryDTO,
  EventSummaryDTO,
  ProductDetailDTO,
  ProductListItemDTO,
  SellerOverviewDTO,
  UpdateProfileInput,
  UpdateSellerStatusInput,
  UserProfileDTO,
} from '@ecoferia/shared';
import { apiGet, apiPatch, apiPost } from './api.ts';

function toQuery(params: Record<string, string | number | undefined>): string {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== '') qs.set(k, String(v));
  }
  const s = qs.toString();
  return s ? `?${s}` : '';
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => apiGet<CategoryDTO[]>('/categories'),
  });
}

export type BrandsParams = { category?: string; q?: string };

export function useBrands(params: BrandsParams = {}) {
  return useQuery({
    queryKey: ['brands', params],
    queryFn: () => apiGet<BrandListItemDTO[]>(`/brands${toQuery(params)}`),
  });
}

export function useBrand(slug: string | undefined) {
  return useQuery({
    queryKey: ['brand', slug],
    queryFn: () => apiGet<BrandProfileDTO>(`/brands/${slug}`),
    enabled: Boolean(slug),
  });
}

export type ProductsParams = {
  category?: string;
  brand?: string;
  q?: string;
  minPrice?: number;
  maxPrice?: number;
};

export function useProducts(params: ProductsParams = {}) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => apiGet<ProductListItemDTO[]>(`/products${toQuery(params)}`),
  });
}

export function useProduct(slug: string | undefined) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => apiGet<ProductDetailDTO>(`/products/${slug}`),
    enabled: Boolean(slug),
  });
}

export function useBlog() {
  return useQuery({
    queryKey: ['blog'],
    queryFn: () => apiGet<BlogPostSummaryDTO[]>('/blog'),
  });
}

export function useBlogPost(slug: string | undefined) {
  return useQuery({
    queryKey: ['blog', slug],
    queryFn: () => apiGet<BlogPostDetailDTO>(`/blog/${slug}`),
    enabled: Boolean(slug),
  });
}

export function useEvents() {
  return useQuery({
    queryKey: ['events'],
    queryFn: () => apiGet<EventSummaryDTO[]>('/events'),
  });
}

export function useBrandContact(slug: string) {
  return useMutation({
    mutationFn: (input: BrandContactInput) =>
      apiPost<{ ok: true }>(`/brands/${slug}/contact`, input),
  });
}

/** Perfil del usuario autenticado. `enabled` evita el fetch (y el 401) si no hay sesión. */
export function useProfile(enabled: boolean) {
  return useQuery({
    queryKey: ['me'],
    queryFn: () => apiGet<UserProfileDTO>('/me'),
    enabled,
    retry: false,
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateProfileInput) => apiPatch<UserProfileDTO>('/me', input),
    onSuccess: (data) => qc.setQueryData(['me'], data),
  });
}

// --- Paneles ---

export function useAdminStats(enabled = true) {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: () => apiGet<AdminStatsDTO>('/admin/stats'),
    enabled,
  });
}

export function useAdminSellers(enabled = true) {
  return useQuery({
    queryKey: ['admin', 'sellers'],
    queryFn: () => apiGet<AdminSellerDTO[]>('/admin/sellers'),
    enabled,
  });
}

export function useUpdateSellerStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...input }: { id: string } & UpdateSellerStatusInput) =>
      apiPatch<{ ok: true }>(`/admin/sellers/${id}`, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'sellers'] });
      qc.invalidateQueries({ queryKey: ['admin', 'stats'] });
    },
  });
}

export function useSellerOverview(enabled = true) {
  return useQuery({
    queryKey: ['vendedor', 'overview'],
    queryFn: () => apiGet<SellerOverviewDTO>('/vendedor/overview'),
    enabled,
  });
}
