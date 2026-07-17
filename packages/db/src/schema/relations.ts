import { relations } from 'drizzle-orm';
import { accounts, sessions } from './auth.ts';
import {
  blogPosts,
  brandContacts,
  brandPosts,
  brands,
  categories,
  favorites,
  messages,
  orderItems,
  orders,
  products,
  productImpactSeals,
  sellerProfiles,
  users,
} from './tables.ts';

export const usersRelations = relations(users, ({ one, many }) => ({
  sellerProfile: one(sellerProfiles),
  managedBrands: many(brands),
  favorites: many(favorites),
  sessions: many(sessions),
  accounts: many(accounts),
  blogPosts: many(blogPosts),
  orders: many(orders),
  messages: many(messages),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, { fields: [orders.userId], references: [users.id] }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
  brand: one(brands, { fields: [orderItems.brandId], references: [brands.id] }),
  product: one(products, { fields: [orderItems.productId], references: [products.id] }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  brand: one(brands, { fields: [messages.brandId], references: [brands.id] }),
  sender: one(users, { fields: [messages.senderUserId], references: [users.id] }),
}));

export const blogPostsRelations = relations(blogPosts, ({ one }) => ({
  author: one(users, { fields: [blogPosts.authorUserId], references: [users.id] }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sellerProfilesRelations = relations(sellerProfiles, ({ one, many }) => ({
  user: one(users, { fields: [sellerProfiles.userId], references: [users.id] }),
  brands: many(brands),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  brands: many(brands),
  products: many(products),
}));

export const brandsRelations = relations(brands, ({ one, many }) => ({
  category: one(categories, { fields: [brands.categoryId], references: [categories.id] }),
  seller: one(sellerProfiles, {
    fields: [brands.managedBySellerId],
    references: [sellerProfiles.id],
  }),
  admin: one(users, { fields: [brands.managedByAdminId], references: [users.id] }),
  products: many(products),
  posts: many(brandPosts),
  contacts: many(brandContacts),
  favoritedBy: many(favorites),
  orderItems: many(orderItems),
  messages: many(messages),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  brand: one(brands, { fields: [products.brandId], references: [brands.id] }),
  category: one(categories, { fields: [products.categoryId], references: [categories.id] }),
  seals: many(productImpactSeals),
}));

export const productImpactSealsRelations = relations(productImpactSeals, ({ one }) => ({
  product: one(products, {
    fields: [productImpactSeals.productId],
    references: [products.id],
  }),
}));

export const brandPostsRelations = relations(brandPosts, ({ one }) => ({
  brand: one(brands, { fields: [brandPosts.brandId], references: [brands.id] }),
}));

export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(users, { fields: [favorites.userId], references: [users.id] }),
  brand: one(brands, { fields: [favorites.brandId], references: [brands.id] }),
}));
