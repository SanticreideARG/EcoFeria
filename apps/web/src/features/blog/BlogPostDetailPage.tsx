import { Link, useParams } from 'react-router-dom';
import { ErrorState, Icon, Loader } from '../../components/index.ts';
import { formatDateLong } from '../../lib/format.ts';
import { useBlogPost } from '../../lib/queries.ts';

export function BlogPostDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading, isError } = useBlogPost(slug);

  if (isLoading) return <Loader label="Cargando nota…" />;
  if (isError || !post) return <ErrorState message="No encontramos esta nota." />;

  return (
    <article className="mx-auto max-w-[720px] px-5 py-6">
      <Link to="/blog" className="mb-4 inline-flex items-center gap-1 text-body-sm font-bold text-primary">
        <Icon name="arrow_back" className="text-base" /> Volver al blog
      </Link>

      {post.coverUrl && (
        <div className="mb-5 aspect-video overflow-hidden rounded-xl bg-surface-container-low paper-border">
          <img src={post.coverUrl} alt={post.title} className="h-full w-full object-cover" />
        </div>
      )}

      <p className="text-label-caps uppercase text-primary/70">{formatDateLong(post.publishedAt)}</p>
      <h1 className="mb-2 font-display text-headline-md text-on-surface">{post.title}</h1>
      {post.authorName && (
        <p className="mb-5 text-body-sm text-on-surface-variant">Por {post.authorName}</p>
      )}

      <div className="whitespace-pre-line text-body-md leading-relaxed text-on-surface-variant">
        {post.body}
      </div>
    </article>
  );
}
