import { Hono } from 'hono';
import { db } from '@ecoferia/db';
import { BlogPostSummaryDTO, EventSummaryDTO } from '@ecoferia/shared';

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
