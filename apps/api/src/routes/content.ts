import { Hono } from 'hono';
import { db } from '@ecoferia/db';
import { BlogPostDetailDTO, BlogPostSummaryDTO, EventSummaryDTO } from '@ecoferia/shared';

export const contentRoute = new Hono()
  .get('/blog', async (c) => {
    const rows = await db.query.blogPosts.findMany({
      orderBy: (t, { desc }) => [desc(t.publishedAt)],
    });
    return c.json(
      BlogPostSummaryDTO.array().parse(
        rows.map((p) => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          coverUrl: p.coverUrl,
          publishedAt: p.publishedAt.toISOString(),
        })),
      ),
    );
  })
  .get('/blog/:slug', async (c) => {
    const slug = c.req.param('slug');
    const p = await db.query.blogPosts.findFirst({
      where: (t, { eq }) => eq(t.slug, slug),
      with: { author: { columns: { name: true } } },
    });
    if (!p) return c.json({ error: 'Post no encontrado' }, 404);
    return c.json(
      BlogPostDetailDTO.parse({
        id: p.id,
        title: p.title,
        slug: p.slug,
        coverUrl: p.coverUrl,
        publishedAt: p.publishedAt.toISOString(),
        body: p.body,
        authorName: p.author?.name ?? null,
      }),
    );
  })
  .get('/events', async (c) => {
    const rows = await db.query.events.findMany({
      where: (t, { eq }) => eq(t.status, 'publicado'),
      orderBy: (t, { asc }) => [asc(t.startsAt)],
    });
    return c.json(
      EventSummaryDTO.array().parse(
        rows.map((e) => ({
          id: e.id,
          title: e.title,
          description: e.description,
          location: e.location,
          startsAt: e.startsAt.toISOString(),
          coverUrl: e.coverUrl,
        })),
      ),
    );
  });
