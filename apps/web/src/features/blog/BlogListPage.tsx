import { Link } from 'react-router-dom';
import { EmptyState, ErrorState, Icon, Loader } from '../../components/index.ts';
import { formatDateLong } from '../../lib/format.ts';
import { useBlog } from '../../lib/queries.ts';

export function BlogListPage() {
  const { data: posts, isLoading, isError } = useBlog();

  return (
    <div className="mx-auto max-w-[900px] px-5 py-6">
      <header className="mb-6">
        <h1 className="font-display text-display-lg-mobile text-primary">Blog</h1>
        <p className="text-body-md text-on-surface-variant">
          Historias, oficios y novedades de la comunidad de La Ecoferia.
        </p>
      </header>

      {isLoading ? (
        <Loader label="Cargando notas…" />
      ) : isError ? (
        <ErrorState />
      ) : posts && posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map((p) => (
            <Link
              key={p.id}
              to={`/blog/${p.slug}`}
              className="flex items-center gap-4 rounded-lg border border-outline-variant bg-surface p-4 transition-shadow hover:shadow-md"
            >
              <div className="grid h-20 w-20 flex-shrink-0 place-items-center overflow-hidden rounded-md bg-surface-container-low text-outline-variant">
                {p.coverUrl ? (
                  <img src={p.coverUrl} alt={p.title} className="h-full w-full object-cover" />
                ) : (
                  <Icon name="article" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-label-caps uppercase text-primary/70">
                  {formatDateLong(p.publishedAt)}
                </p>
                <h2 className="text-title-lg leading-tight text-on-surface">{p.title}</h2>
              </div>
              <Icon name="arrow_forward" className="flex-shrink-0 text-primary" />
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState icon="article" title="Todavía no hay notas" hint="Volvé pronto por novedades." />
      )}
    </div>
  );
}
