import { useState, type FormEvent } from 'react';
import type { ImpactSeal as Seal, ProductStatus, SellerBrandDTO, SellerProductDTO } from '@ecoferia/shared';
import { CreateProductInput, IMPACT_SEAL_LABELS } from '@ecoferia/shared';
import {
  CtaButton,
  Dialog,
  EmptyState,
  ErrorState,
  Icon,
  Loader,
  PaperInput,
  PaperTextarea,
} from '../../components/index.ts';
import { cn } from '../../lib/cn.ts';
import { formatARS } from '../../lib/format.ts';
import { useCategories } from '../../lib/queries.ts';
import {
  useCreateProduct,
  useDeleteProduct,
  useSellerOverview,
  useSellerProducts,
  useUpdateProduct,
} from '../../lib/queries.ts';

const STATUS_LABEL: Record<ProductStatus, string> = {
  publicado: 'Publicado',
  borrador: 'Borrador',
  agotado: 'Agotado',
};

const STATUS_BADGE: Record<ProductStatus, string> = {
  publicado: 'bg-primary-fixed text-on-primary-fixed',
  borrador: 'bg-surface-container-high text-on-surface-variant',
  agotado: 'bg-error-container text-on-error-container',
};

const ALL_SEALS = Object.keys(IMPACT_SEAL_LABELS) as Seal[];

type FormState = {
  brandId: string;
  name: string;
  description: string;
  story: string;
  price: string;
  stock: string;
  imageUrl: string;
  categoryId: string;
  status: ProductStatus;
  seals: Seal[];
};

function emptyForm(defaultBrandId: string): FormState {
  return {
    brandId: defaultBrandId,
    name: '',
    description: '',
    story: '',
    price: '',
    stock: '0',
    imageUrl: '',
    categoryId: '',
    status: 'publicado',
    seals: [],
  };
}

function toFormState(p: SellerProductDTO): FormState {
  return {
    brandId: p.brandId,
    name: p.name,
    description: p.description ?? '',
    story: p.story ?? '',
    price: p.price,
    stock: String(p.stock),
    imageUrl: p.imageUrl ?? '',
    categoryId: p.categoryId ?? '',
    status: p.status,
    seals: p.seals,
  };
}

function ProductForm({
  form,
  setForm,
  brands,
  showBrandSelector,
  onSubmit,
  onCancel,
  pending,
  error,
}: {
  form: FormState;
  setForm: (f: FormState) => void;
  brands: SellerBrandDTO[];
  showBrandSelector: boolean;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  pending: boolean;
  error: string | null;
}) {
  const { data: categories } = useCategories();
  const toggleSeal = (seal: Seal) =>
    setForm({
      ...form,
      seals: form.seals.includes(seal)
        ? form.seals.filter((s) => s !== seal)
        : [...form.seals, seal],
    });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {showBrandSelector && (
        <div>
          <label className="mb-1 block text-label-caps text-on-surface-variant">Marca</label>
          <select
            value={form.brandId}
            onChange={(e) => setForm({ ...form, brandId: e.target.value })}
            required
            className="w-full border-0 border-b border-brand-accent bg-surface-variant/30 px-3 py-2 text-body-md text-on-surface focus:border-primary focus:outline-none"
          >
            <option value="" disabled>
              Elegí una marca
            </option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <PaperInput
        label="Nombre"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />

      <div className="grid grid-cols-2 gap-3">
        <PaperInput
          label="Precio (ARS)"
          type="number"
          min="0.01"
          step="0.01"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          required
        />
        <PaperInput
          label="Stock"
          type="number"
          min="0"
          step="1"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
          required
        />
      </div>

      <PaperInput
        label="URL de imagen"
        value={form.imageUrl}
        onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
        placeholder="/products/mi-producto.webp"
      />

      <PaperTextarea
        label="Descripción"
        rows={3}
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />

      <PaperTextarea
        label="Historia del productor"
        rows={3}
        value={form.story}
        onChange={(e) => setForm({ ...form, story: e.target.value })}
      />

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-label-caps text-on-surface-variant">Categoría</label>
          <select
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            className="w-full border-0 border-b border-brand-accent bg-surface-variant/30 px-3 py-2 text-body-md text-on-surface focus:border-primary focus:outline-none"
          >
            <option value="">Sin categoría</option>
            {categories?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-label-caps text-on-surface-variant">Estado</label>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as ProductStatus })}
            className="w-full border-0 border-b border-brand-accent bg-surface-variant/30 px-3 py-2 text-body-md text-on-surface focus:border-primary focus:outline-none"
          >
            {(Object.keys(STATUS_LABEL) as ProductStatus[]).map((s) => (
              <option key={s} value={s}>
                {STATUS_LABEL[s]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-label-caps text-on-surface-variant">
          Sellos de impacto
        </label>
        <div className="flex flex-wrap gap-2">
          {ALL_SEALS.map((seal) => (
            <button
              key={seal}
              type="button"
              onClick={() => toggleSeal(seal)}
              className={cn(
                'rounded-full border px-3 py-1.5 text-label-caps transition-colors',
                form.seals.includes(seal)
                  ? 'border-primary bg-primary text-on-primary'
                  : 'border-outline-variant bg-surface text-on-surface-variant',
              )}
            >
              {IMPACT_SEAL_LABELS[seal]}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p className="flex items-center gap-2 text-body-sm text-error">
          <Icon name="error" className="text-base" /> {error}
        </p>
      )}

      <div className="flex gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-lg border border-outline-variant py-2.5 text-title-lg text-on-surface-variant"
        >
          Cancelar
        </button>
        <CtaButton type="submit" variant="primary" className="flex-1" disabled={pending}>
          {pending ? 'Guardando…' : 'Guardar'}
        </CtaButton>
      </div>
    </form>
  );
}

export function SellerProductsPage() {
  const { data: products, isLoading, isError } = useSellerProducts();
  const { data: overview } = useSellerOverview();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const brands = overview?.brands ?? [];
  const [editing, setEditing] = useState<SellerProductDTO | 'new' | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm(''));
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SellerProductDTO | null>(null);

  const openCreate = () => {
    setForm(emptyForm(brands[0]?.id ?? ''));
    setFormError(null);
    setEditing('new');
  };
  const openEdit = (p: SellerProductDTO) => {
    setForm(toFormState(p));
    setFormError(null);
    setEditing(p);
  };
  const close = () => setEditing(null);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    const raw = {
      brandId: form.brandId,
      name: form.name,
      description: form.description,
      story: form.story,
      price: form.price,
      stock: form.stock,
      imageUrl: form.imageUrl,
      categoryId: form.categoryId || null,
      status: form.status,
      seals: form.seals,
    };

    if (editing === 'new') {
      const parsed = CreateProductInput.safeParse(raw);
      if (!parsed.success) {
        setFormError(parsed.error.issues[0]?.message ?? 'Revisá los datos.');
        return;
      }
      createProduct.mutate(parsed.data, {
        onSuccess: close,
        onError: () => setFormError('No pudimos crear el producto. Reintentá.'),
      });
    } else if (editing) {
      const { brandId: _brandId, ...updateRaw } = raw;
      const parsed = CreateProductInput.omit({ brandId: true }).safeParse(updateRaw);
      if (!parsed.success) {
        setFormError(parsed.error.issues[0]?.message ?? 'Revisá los datos.');
        return;
      }
      updateProduct.mutate(
        { id: editing.id, ...parsed.data },
        { onSuccess: close, onError: () => setFormError('No pudimos guardar los cambios. Reintentá.') },
      );
    }
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteProduct.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) });
  };

  const pending = createProduct.isPending || updateProduct.isPending;

  return (
    <div>
      <header className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-display-lg-mobile text-primary">Mis productos</h1>
          <p className="text-body-md text-on-surface-variant">
            Creá, editá y gestioná el stock de tu catálogo.
          </p>
        </div>
        <CtaButton
          variant="primary"
          onClick={openCreate}
          disabled={brands.length === 0}
          className="flex-shrink-0"
        >
          <Icon name="add" className="text-lg" /> Nuevo
        </CtaButton>
      </header>

      {brands.length === 0 && overview && (
        <p className="mb-4 rounded-lg bg-tertiary-fixed/50 p-3 text-body-sm text-on-tertiary-fixed">
          Todavía no gestionás ninguna marca, así que no podés cargar productos.
        </p>
      )}

      {isLoading ? (
        <Loader label="Cargando tus productos…" />
      ) : isError ? (
        <ErrorState />
      ) : !products || products.length === 0 ? (
        <EmptyState
          icon="inventory_2"
          title="Todavía no cargaste productos"
          hint="Usá el botón «Nuevo» para agregar tu primer producto."
        />
      ) : (
        <div className="space-y-3">
          {products.map((p) => (
            <article
              key={p.id}
              className="flex items-center gap-4 rounded-xl bg-surface-container-lowest p-3 paper-border"
            >
              <div className="grid h-16 w-16 flex-shrink-0 place-items-center overflow-hidden rounded-lg bg-surface-container-low text-outline-variant">
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt={p.name} className="h-full w-full object-cover" />
                ) : (
                  <Icon name="image" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate text-title-lg text-on-surface">{p.name}</h3>
                  <span
                    className={cn('rounded-full px-2 py-0.5 text-label-caps', STATUS_BADGE[p.status])}
                  >
                    {STATUS_LABEL[p.status]}
                  </span>
                </div>
                <p className="text-body-sm text-on-surface-variant">
                  {p.brandName} · {formatARS(p.price)} · stock {p.stock}
                </p>
              </div>
              <div className="flex flex-shrink-0 gap-1">
                <button
                  type="button"
                  onClick={() => openEdit(p)}
                  aria-label={`Editar ${p.name}`}
                  className="grid h-10 w-10 place-items-center rounded-full text-primary hover:bg-surface-container"
                >
                  <Icon name="edit" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(p)}
                  aria-label={`Eliminar ${p.name}`}
                  className="grid h-10 w-10 place-items-center rounded-full text-error hover:bg-error-container/40"
                >
                  <Icon name="delete" />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {editing && (
        <Dialog title={editing === 'new' ? 'Nuevo producto' : 'Editar producto'} onClose={close}>
          <ProductForm
            form={form}
            setForm={setForm}
            brands={brands}
            showBrandSelector={editing === 'new'}
            onSubmit={onSubmit}
            onCancel={close}
            pending={pending}
            error={formError}
          />
        </Dialog>
      )}

      {deleteTarget && (
        <Dialog title="Eliminar producto" onClose={() => setDeleteTarget(null)}>
          <p className="mb-5 text-body-md text-on-surface">
            ¿Seguro que querés eliminar <strong>{deleteTarget.name}</strong>? Esta acción no se
            puede deshacer.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setDeleteTarget(null)}
              className="flex-1 rounded-lg border border-outline-variant py-2.5 text-title-lg text-on-surface-variant"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={confirmDelete}
              disabled={deleteProduct.isPending}
              className="flex-1 rounded-lg bg-error py-2.5 text-title-lg text-on-error disabled:opacity-50"
            >
              {deleteProduct.isPending ? 'Eliminando…' : 'Eliminar'}
            </button>
          </div>
        </Dialog>
      )}
    </div>
  );
}
