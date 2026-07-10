import { Hono } from 'hono';
import { db } from '@ecoferia/db';
import { CategoryDTO } from '@ecoferia/shared';

export const categoriesRoute = new Hono().get('/categories', async (c) => {
  const rows = await db.query.categories.findMany({
    orderBy: (t, { asc }) => [asc(t.name)],
  });
  return c.json(CategoryDTO.array().parse(rows));
});
