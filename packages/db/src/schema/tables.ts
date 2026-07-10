import { sql } from 'drizzle-orm';
import {
  check,
  index,
  integer,
  jsonb,
  numeric,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';
import {
  brandStatus,
  eventStatus,
  impactSeal,
  orderStatus,
  productStatus,
  sellerStatus,
  userRole,
} from './enums.ts';

const createdAt = () => timestamp('created_at', { withTimezone: true }).defaultNow().notNull();

// --- Usuarios y roles ---

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  role: userRole('role').notNull().default('cliente'),
  avatarUrl: text('avatar_url'),
  createdAt: createdAt(),
});

export const sellerProfiles = pgTable('seller_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: 'cascade' }),
  status: sellerStatus('status').notNull().default('pendiente'),
  bio: text('bio'),
  phone: text('phone'),
});

// --- Catálogo ---

export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  icon: text('icon'),
});

export const brands = pgTable(
  'brands',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(),
    tagline: text('tagline'),
    description: text('description'),
    logoUrl: text('logo_url'),
    coverUrl: text('cover_url'),
    categoryId: uuid('category_id').references(() => categories.id, { onDelete: 'set null' }),
    // Regla XOR: una marca la gestiona un vendedor O un admin, nunca ambos.
    managedBySellerId: uuid('managed_by_seller_id').references(() => sellerProfiles.id, {
      onDelete: 'set null',
    }),
    managedByAdminId: uuid('managed_by_admin_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    status: brandStatus('status').notNull().default('activa'),
    createdAt: createdAt(),
  },
  (t) => [
    check(
      'brand_manager_xor',
      sql`(${t.managedBySellerId} IS NOT NULL AND ${t.managedByAdminId} IS NULL) OR (${t.managedBySellerId} IS NULL AND ${t.managedByAdminId} IS NOT NULL)`,
    ),
    index('brands_category_idx').on(t.categoryId),
  ],
);

export const products = pgTable(
  'products',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    brandId: uuid('brand_id')
      .notNull()
      .references(() => brands.id, { onDelete: 'cascade' }),
    categoryId: uuid('category_id').references(() => categories.id, { onDelete: 'set null' }),
    name: text('name').notNull(),
    slug: text('slug').notNull(),
    description: text('description'),
    story: text('story'),
    price: numeric('price', { precision: 10, scale: 2 }).notNull(),
    stock: integer('stock').notNull().default(0),
    imageUrl: text('image_url'),
    status: productStatus('status').notNull().default('publicado'),
    createdAt: createdAt(),
  },
  (t) => [
    uniqueIndex('products_brand_slug_idx').on(t.brandId, t.slug),
    index('products_brand_idx').on(t.brandId),
    index('products_category_idx').on(t.categoryId),
    index('products_status_idx').on(t.status),
  ],
);

export const productImpactSeals = pgTable(
  'product_impact_seals',
  {
    productId: uuid('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    seal: impactSeal('seal').notNull(),
  },
  (t) => [primaryKey({ columns: [t.productId, t.seal] })],
);

// --- Comercio ---

export const orders = pgTable(
  'orders',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    status: orderStatus('status').notNull().default('pendiente'),
    shippingAddress: jsonb('shipping_address'),
    subtotal: numeric('subtotal', { precision: 10, scale: 2 }).notNull(),
    shippingCost: numeric('shipping_cost', { precision: 10, scale: 2 }).notNull().default('0'),
    total: numeric('total', { precision: 10, scale: 2 }).notNull(),
    createdAt: createdAt(),
  },
  (t) => [index('orders_user_created_idx').on(t.userId, t.createdAt)],
);

export const orderItems = pgTable(
  'order_items',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    orderId: uuid('order_id')
      .notNull()
      .references(() => orders.id, { onDelete: 'cascade' }),
    // Desnormalizado para agrupar por marca en el checkout.
    brandId: uuid('brand_id')
      .notNull()
      .references(() => brands.id, { onDelete: 'cascade' }),
    productId: uuid('product_id').references(() => products.id, { onDelete: 'set null' }),
    quantity: integer('quantity').notNull(),
    unitPrice: numeric('unit_price', { precision: 10, scale: 2 }).notNull(),
  },
  (t) => [index('order_items_order_idx').on(t.orderId)],
);

export const favorites = pgTable(
  'favorites',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    brandId: uuid('brand_id')
      .notNull()
      .references(() => brands.id, { onDelete: 'cascade' }),
    createdAt: createdAt(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.brandId] }), index('favorites_user_idx').on(t.userId)],
);

// --- Comunicación y contenido ---

export const messages = pgTable(
  'messages',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    threadId: uuid('thread_id').notNull(),
    brandId: uuid('brand_id')
      .notNull()
      .references(() => brands.id, { onDelete: 'cascade' }),
    senderUserId: uuid('sender_user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    body: text('body').notNull(),
    readAt: timestamp('read_at', { withTimezone: true }),
    createdAt: createdAt(),
  },
  (t) => [index('messages_thread_idx').on(t.threadId, t.createdAt)],
);

export const brandPosts = pgTable('brand_posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  brandId: uuid('brand_id')
    .notNull()
    .references(() => brands.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  body: text('body').notNull(),
  imageUrl: text('image_url'),
  publishedAt: timestamp('published_at', { withTimezone: true }).defaultNow().notNull(),
});

export const blogPosts = pgTable('blog_posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  authorUserId: uuid('author_user_id').references(() => users.id, { onDelete: 'set null' }),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  body: text('body').notNull(),
  coverUrl: text('cover_url'),
  publishedAt: timestamp('published_at', { withTimezone: true }).defaultNow().notNull(),
});

export const events = pgTable('events', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description'),
  location: text('location'),
  startsAt: timestamp('starts_at', { withTimezone: true }).notNull(),
  endsAt: timestamp('ends_at', { withTimezone: true }),
  coverUrl: text('cover_url'),
  createdBy: uuid('created_by').references(() => users.id, { onDelete: 'set null' }),
  status: eventStatus('status').notNull().default('publicado'),
});

export const brandContacts = pgTable('brand_contacts', {
  id: uuid('id').primaryKey().defaultRandom(),
  brandId: uuid('brand_id')
    .notNull()
    .references(() => brands.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  email: text('email').notNull(),
  message: text('message').notNull(),
  createdAt: createdAt(),
});
