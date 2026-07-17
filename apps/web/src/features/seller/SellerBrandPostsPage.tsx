import { useState, type FormEvent } from 'react';
import type { SellerBrandPostDTO } from '@ecoferia/shared';
import { CreateBrandPostInput } from '@ecoferia/shared';
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
import { formatDateLong } from '../../lib/format.ts';
import {
  useCreateBrandPost,
  useDeleteBrandPost,
  useSellerBrandPosts,
  useSellerOverview,
  useUpdateBrandPost,
} from '../../lib/queries.ts';

type FormState = { brandId: string; title: string; body: string; imageUrl: string };

function emptyForm(defaultBrandId: string): FormState {
  return { brandId: defaultBrandId, title: '', body: '', imageUrl: '' };
}

function toFormState(p: SellerBrandPostDTO): FormState {
  return { brandId: p.brandId, title: p.title, body: p.body, imageUrl: p.imageUrl ?? '' };
}

export function SellerBrandPostsPage() {
  const { data: posts, isLoading, isError } = useSellerBrandPosts();
  const { data: overview } = useSellerOverview();
  const createPost = useCreateBrandPost();
  const updatePost = useUpdateBrandPost();
  const deletePost = useDeleteBrandPost();

  const brands = overview?.brands ?? [];
  const [editing, setEditing] = useState<SellerBrandPostDTO | 'new' | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm(''));
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SellerBrandPostDTO | null>(null);

  const openCreate = () => {
    setForm(emptyForm(brands[0]?.id ?? ''));
    setFormError(null);
    setEditing('new');
  };
  const openEdit = (p: SellerBrandPostDTO) => {
    setForm(toFormState(p));
    setFormError(null);
    setEditing(p);
  };
  const close = () => setEditing(null);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    const raw = { brandId: form.brandId, title: form.title, body: form.body, imageUrl: form.imageUrl };

    if (editing === 'new') {
      const parsed = CreateBrandPostInput.safeParse(raw);
      if (!parsed.success) {
        setFormError(parsed.error.issues[0]?.message ?? 'Revisá los datos.');
        return;
      }
      createPost.mutate(parsed.data, {
        onSuccess: close,
        onError: () => setFormError('No pudimos publicar el post. Reintentá.'),
      });
    } else if (editing) {
      const { brandId: _brandId, ...updateRaw } = raw;
      const parsed = CreateBrandPostInput.omit({ brandId: true }).safeParse(updateRaw);
      if (!parsed.success) {
        setFormError(parsed.error.issues[0]?.message ?? 'Revisá los datos.');
        return;
      }
      updatePost.mutate(
        { id: editing.id, ...parsed.data },
        { onSuccess: close, onError: () => setFormError('No pudimos guardar los cambios. Reintentá.') },
      );
    }
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deletePost.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) });
  };

  const pending = createPost.isPending || updatePost.isPending;

  return (
    <div>
      <header className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-display-lg-mobile text-primary">Diario de marca</h1>
          <p className="text-body-md text-on-surface-variant">
            Compartí novedades con tu comunidad en el perfil de tu marca.
          </p>
        </div>
        <CtaButton
          variant="primary"
          onClick={openCreate}
          disabled={brands.length === 0}
          className="flex-shrink-0"
        >
          <Icon name="add" className="text-lg" /> Nuevo post
        </CtaButton>
      </header>

      {isLoading ? (
        <Loader label="Cargando el diario…" />
      ) : isError ? (
        <ErrorState />
      ) : !posts || posts.length === 0 ? (
        <EmptyState
          icon="article"
          title="Todavía no publicaste nada"
          hint="Usá «Nuevo post» para compartir una novedad."
        />
      ) : (
        <div className="space-y-3">
          {posts.map((p) => (
            <article key={p.id} className="rounded-xl bg-surface-container-lowest p-4 paper-border">
              <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-label-caps uppercase text-secondary">{p.brandName}</span>
                  <h3 className="text-title-lg text-on-surface">{p.title}</h3>
                </div>
                <div className="flex flex-shrink-0 gap-1">
                  <button
                    type="button"
                    onClick={() => openEdit(p)}
                    aria-label={`Editar ${p.title}`}
                    className="grid h-10 w-10 place-items-center rounded-full text-primary hover:bg-surface-container"
                  >
                    <Icon name="edit" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(p)}
                    aria-label={`Eliminar ${p.title}`}
                    className="grid h-10 w-10 place-items-center rounded-full text-error hover:bg-error-container/40"
                  >
                    <Icon name="delete" />
                  </button>
                </div>
              </div>
              <p className="line-clamp-2 text-body-sm text-on-surface-variant">{p.body}</p>
              <p className="mt-2 text-label-caps text-on-surface-variant">
                {formatDateLong(p.publishedAt)}
              </p>
            </article>
          ))}
        </div>
      )}

      {editing && (
        <Dialog title={editing === 'new' ? 'Nuevo post' : 'Editar post'} onClose={close}>
          <form onSubmit={onSubmit} className="space-y-4">
            {editing === 'new' && (
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
              label="Título"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
            <PaperTextarea
              label="Contenido"
              rows={5}
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              required
            />
            <PaperInput
              label="URL de imagen"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              placeholder="Opcional"
            />

            {formError && (
              <p className="flex items-center gap-2 text-body-sm text-error">
                <Icon name="error" className="text-base" /> {formError}
              </p>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={close}
                className="flex-1 rounded-lg border border-outline-variant py-2.5 text-title-lg text-on-surface-variant"
              >
                Cancelar
              </button>
              <CtaButton type="submit" variant="primary" className="flex-1" disabled={pending}>
                {pending ? 'Guardando…' : 'Publicar'}
              </CtaButton>
            </div>
          </form>
        </Dialog>
      )}

      {deleteTarget && (
        <Dialog title="Eliminar post" onClose={() => setDeleteTarget(null)}>
          <p className="mb-5 text-body-md text-on-surface">
            ¿Seguro que querés eliminar <strong>{deleteTarget.title}</strong>?
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
              disabled={deletePost.isPending}
              className="flex-1 rounded-lg bg-error py-2.5 text-title-lg text-on-error disabled:opacity-50"
            >
              {deletePost.isPending ? 'Eliminando…' : 'Eliminar'}
            </button>
          </div>
        </Dialog>
      )}
    </div>
  );
}
