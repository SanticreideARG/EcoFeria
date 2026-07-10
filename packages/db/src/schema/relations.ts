import { relations } from 'drizzle-orm';
import {
  brandContacts,
  brandPosts,
  brands,
  categories,
  favorites,
  products,
  productImpactSeals,
  sellerProfiles,
  users,
} from './tables.ts';

export const usersRelations = relations(users, ({ one, many }) => ({
  sellerProfile: one(sellerProfiles),
  managedBrands: many(brands),
  favorites: many(favorites),
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
