import type { DB } from './connection.ts';
import {
  blogPosts,
  brandContacts,
  brandPosts,
  brands,
  categories,
  events,
  favorites,
  impactSeal,
  messages,
  orderItems,
  orders,
  productImpactSeals,
  products,
  sellerProfiles,
  users,
} from './schema/index.ts';

type Seal = (typeof impactSeal.enumValues)[number];

type ProductDef = {
  brand: string;
  category: string;
  slug: string;
  name: string;
  price: string;
  stock: number;
  description: string;
  seals: Seal[];
};

function req(map: Record<string, string>, key: string): string {
  const value = map[key];
  if (!value) throw new Error(`seed: no se encontró la clave '${key}'`);
  return value;
}

const CATEGORIES = [
  { name: 'Alimentos', slug: 'alimentos', icon: 'nutrition' },
  { name: 'Cosmética', slug: 'cosmetica', icon: 'spa' },
  { name: 'Hogar', slug: 'hogar', icon: 'home' },
  { name: 'Diseño', slug: 'diseno', icon: 'design_services' },
  { name: 'Textil', slug: 'textil', icon: 'checkroom' },
  { name: 'Bienestar', slug: 'bienestar', icon: 'self_improvement' },
];

const PRODUCTS: ProductDef[] = [
  // EcoFungi Patagonia
  { brand: 'ecofungi', category: 'alimentos', slug: 'girgolas-frescas', name: 'Gírgolas Frescas', price: '14500', stock: 20, description: 'Gírgolas cultivadas en bloques de aserrín reciclado.', seals: ['local', 'organico'] },
  { brand: 'ecofungi', category: 'alimentos', slug: 'melena-de-leon', name: 'Melena de León Fresca', price: '16800', stock: 12, description: 'Hongo gourmet de textura marina, cultivo circular.', seals: ['local', 'organico'] },
  { brand: 'ecofungi', category: 'alimentos', slug: 'hongos-deshidratados', name: 'Hongos Deshidratados Mix', price: '12800', stock: 30, description: 'Mezcla deshidratada de girgolas y melena de león.', seals: ['zero_waste', 'local'] },
  { brand: 'ecofungi', category: 'alimentos', slug: 'kit-autocultivo-girgolas', name: 'Kit de Autocultivo Gírgolas', price: '15500', stock: 25, description: 'Cultivá tus propias gírgolas en casa, residuo cero.', seals: ['zero_waste'] },
  // Abeja Obrera SMA
  { brand: 'abeja-obrera', category: 'alimentos', slug: 'miel-cruda-500', name: 'Miel Cruda de Montaña 500g', price: '12000', stock: 40, description: 'Miel pura de la precordillera, sin agroquímicos.', seals: ['local', 'organico'] },
  { brand: 'abeja-obrera', category: 'alimentos', slug: 'propoleo-gotas', name: 'Propóleo en Gotas', price: '8500', stock: 35, description: 'Extracto de propóleo de la cuenca lacustre local.', seals: ['local'] },
  { brand: 'abeja-obrera', category: 'alimentos', slug: 'panal-cera', name: 'Panal de Cera Natural', price: '9800', stock: 15, description: 'Panal de cera de abeja natural con miel.', seals: ['local', 'organico'] },
  { brand: 'abeja-obrera', category: 'alimentos', slug: 'miel-con-propoleo', name: 'Miel con Propóleo', price: '13500', stock: 22, description: 'Miel cruda enriquecida con propóleo.', seals: ['local'] },
  // Neshama Aromaterapia
  { brand: 'neshama', category: 'cosmetica', slug: 'aceite-lavanda', name: 'Aceite Esencial de Lavanda', price: '9800', stock: 18, description: 'Esencia pura de lavanda, sin fragancias sintéticas.', seals: ['organico'] },
  { brand: 'neshama', category: 'cosmetica', slug: 'bruma-aurica', name: 'Bruma Áurica Calma', price: '7600', stock: 24, description: 'Bruma de plantas para armonizar el ambiente.', seals: ['organico', 'local'] },
  { brand: 'neshama', category: 'cosmetica', slug: 'oleo-corporal', name: 'Óleo Corporal Vibracional', price: '11200', stock: 16, description: 'Óleo botánico con activos de flora nativa.', seals: ['organico'] },
  { brand: 'neshama', category: 'cosmetica', slug: 'blend-sahumar', name: 'Blend para Sahumar', price: '6400', stock: 28, description: 'Mezcla de plantas locales para sahumado natural.', seals: ['zero_waste', 'local'] },
  // Cerámica Ruke
  { brand: 'ceramica-ruke', category: 'diseno', slug: 'taza-bosque', name: 'Taza de Cerámica Bosque', price: '8500', stock: 30, description: 'Taza modelada a mano, esmalte libre de plomo.', seals: ['local', 'fair_trade'] },
  { brand: 'ceramica-ruke', category: 'diseno', slug: 'cuenco-utilitario', name: 'Cuenco Utilitario', price: '9500', stock: 20, description: 'Cuenco de uso diario inspirado en el bosque.', seals: ['local', 'fair_trade'] },
  { brand: 'ceramica-ruke', category: 'diseno', slug: 'plato-esmaltado', name: 'Plato Playo Esmaltado', price: '7800', stock: 25, description: 'Plato playo con esmalte apto para alimentos.', seals: ['local'] },
  { brand: 'ceramica-ruke', category: 'diseno', slug: 'set-bowls', name: 'Set de Bowls (x2)', price: '16500', stock: 10, description: 'Set de dos bowls con texturas del bosque patagónico.', seals: ['local', 'fair_trade'] },
  // Keñi — Detergente Ecológico (gestión admin)
  { brand: 'keni', category: 'hogar', slug: 'detergente-solido', name: 'Detergente Sólido Rallado', price: '5200', stock: 50, description: 'Detergente sólido de aceite vegetal usado (AVU).', seals: ['zero_waste', 'local'] },
  { brand: 'keni', category: 'hogar', slug: 'jabon-biodegradable', name: 'Jabón Biodegradable', price: '3800', stock: 60, description: 'Jabón vegano, sin fragancias, apto Patagonia.', seals: ['zero_waste'] },
  { brand: 'keni', category: 'hogar', slug: 'pack-zerowaste-cocina', name: 'Pack Zero Waste Cocina', price: '9600', stock: 20, description: 'Kit de limpieza de cocina residuo cero.', seals: ['zero_waste', 'local'] },
  // Zig Zag Patagonia (gestión admin)
  { brand: 'zigzag', category: 'textil', slug: 'mochila-lona', name: 'Mochila de Lona Reciclada', price: '22000', stock: 12, description: 'Mochila de lonas publicitarias en desuso.', seals: ['zero_waste', 'fair_trade'] },
  { brand: 'zigzag', category: 'textil', slug: 'rinonera-upcycling', name: 'Riñonera Upcycling', price: '14500', stock: 18, description: 'Riñonera de retazos textiles de la industria local.', seals: ['zero_waste', 'fair_trade'] },
  { brand: 'zigzag', category: 'textil', slug: 'cartuchera-parapente', name: 'Cartuchera de Parapente', price: '8900', stock: 22, description: 'Cartuchera confeccionada con parapentes reciclados.', seals: ['zero_waste'] },
];

/**
 * Puebla la base con datos demo inspirados en el ecosistema real de la Ecoferia SMA
 * (Assets/informe_eco_feria_sma.md). Idempotente: borra y reinserta.
 */
export async function seedDatabase(db: DB): Promise<void> {
  // Borrado en orden seguro respecto de las FKs.
  await db.delete(brandContacts);
  await db.delete(favorites);
  await db.delete(orderItems);
  await db.delete(orders);
  await db.delete(messages);
  await db.delete(brandPosts);
  await db.delete(productImpactSeals);
  await db.delete(products);
  await db.delete(blogPosts);
  await db.delete(events);
  await db.delete(brands);
  await db.delete(sellerProfiles);
  await db.delete(categories);
  await db.delete(users);

  // Categorías
  const catRows = await db
    .insert(categories)
    .values(CATEGORIES)
    .returning({ id: categories.id, slug: categories.slug });
  const cat = Object.fromEntries(catRows.map((r) => [r.slug, r.id]));

  // Usuarios: 1 admin, 3 vendedores (2 aprobados + 1 pendiente), 2 clientes.
  const userRows = await db
    .insert(users)
    .values([
      { name: 'Santiago Creide', email: 'santi.creide@gmail.com', role: 'admin' },
      { name: 'Lucía Fungi', email: 'lucia@ecofungi.ar', role: 'vendedor' },
      { name: 'Mara Ruke', email: 'mara@ceramicaruke.ar', role: 'vendedor' },
      { name: 'Sol Espera', email: 'sol@pendiente.ar', role: 'vendedor' },
      { name: 'Vale Cliente', email: 'vale@cliente.ar', role: 'cliente' },
      { name: 'Nico Cliente', email: 'nico@cliente.ar', role: 'cliente' },
    ])
    .returning({ id: users.id, email: users.email });
  const user = Object.fromEntries(userRows.map((r) => [r.email, r.id]));

  // Perfiles de vendedor
  const sellerRows = await db
    .insert(sellerProfiles)
    .values([
      { userId: req(user, 'lucia@ecofungi.ar'), status: 'aprobado', bio: 'Fungi-cultura circular en la Patagonia.' },
      { userId: req(user, 'mara@ceramicaruke.ar'), status: 'aprobado', bio: 'Alfarería artesanal del bosque.' },
      { userId: req(user, 'sol@pendiente.ar'), status: 'pendiente', bio: 'Emprendimiento textil en evaluación.' },
    ])
    .returning({ id: sellerProfiles.id, userId: sellerProfiles.userId });
  const sellerByUser = Object.fromEntries(sellerRows.map((r) => [r.userId, r.id]));
  const seller = (email: string) => req(sellerByUser, req(user, email));
  const adminId = req(user, 'santi.creide@gmail.com');

  // Marcas: XOR gestor (vendedor O admin).
  const brandRows = await db
    .insert(brands)
    .values([
      { name: 'EcoFungi Patagonia', slug: 'ecofungi', tagline: 'Fungi-cultura circular', description: 'Hongos frescos y deshidratados, sustratos y kits de autocultivo en aserrín reciclado.', categoryId: req(cat, 'alimentos'), managedBySellerId: seller('lucia@ecofungi.ar') },
      { name: 'Abeja Obrera SMA', slug: 'abeja-obrera', tagline: 'Miel cruda de montaña', description: 'Apicultura local y conservación de polinizadores en la cuenca lacustre.', categoryId: req(cat, 'alimentos'), managedBySellerId: seller('lucia@ecofungi.ar') },
      { name: 'Neshama Aromaterapia', slug: 'neshama', tagline: 'Bienestar en cada esencia', description: 'Aceites esenciales puros y blends botánicos, sin fragancias sintéticas.', categoryId: req(cat, 'cosmetica'), managedBySellerId: seller('mara@ceramicaruke.ar') },
      { name: 'Cerámica Ruke', slug: 'ceramica-ruke', tagline: 'Alfarería del bosque patagónico', description: 'Vajilla utilitaria modelada a mano con esmaltes libres de plomo.', categoryId: req(cat, 'diseno'), managedBySellerId: seller('mara@ceramicaruke.ar') },
      { name: 'Keñi Detergente Ecológico', slug: 'keni', tagline: 'Economía circular pura', description: 'Detergentes y jabones sólidos a partir de aceite vegetal usado.', categoryId: req(cat, 'hogar'), managedByAdminId: adminId },
      { name: 'Zig Zag Patagonia', slug: 'zigzag', tagline: 'Upcycling de triple impacto', description: 'Prendas y accesorios de descarte textil con inserción socio-laboral.', categoryId: req(cat, 'textil'), managedByAdminId: adminId },
    ])
    .returning({ id: brands.id, slug: brands.slug });
  const brand = Object.fromEntries(brandRows.map((r) => [r.slug, r.id]));

  // Productos
  const prodRows = await db
    .insert(products)
    .values(
      PRODUCTS.map((p) => ({
        brandId: req(brand, p.brand),
        categoryId: req(cat, p.category),
        slug: p.slug,
        name: p.name,
        description: p.description,
        price: p.price,
        stock: p.stock,
      })),
    )
    .returning({ id: products.id, slug: products.slug });
  const prod = Object.fromEntries(prodRows.map((r) => [r.slug, r.id]));

  // Sellos de impacto
  const sealValues = PRODUCTS.flatMap((p) =>
    p.seals.map((seal) => ({ productId: req(prod, p.slug), seal })),
  );
  await db.insert(productImpactSeals).values(sealValues);

  // Blog general (autor admin)
  await db.insert(blogPosts).values([
    { authorUserId: adminId, title: 'Cosecha de Rosa Mosqueta', slug: 'cosecha-rosa-mosqueta', body: 'Cómo recolectar este fruto patagónico respetando los ciclos de la naturaleza.' },
    { authorUserId: adminId, title: 'Manos de Barro: conociendo a Lucía', slug: 'manos-de-barro-lucia', body: 'Una charla íntima con la ceramista detrás de las piezas más buscadas de la feria.' },
  ]);

  // Agenda cultural
  await db.insert(events).values([
    { title: 'Feria Itinerante en Bariloche', description: 'Más de 50 productores locales, música en vivo y talleres.', location: 'Centro Cívico, Bariloche', startsAt: new Date('2026-07-19T17:00:00Z'), createdBy: adminId },
    { title: 'Taller de Fermentos Vivos', description: 'Kéfir, chucrut y kimchi con insumos agroecológicos de estación.', location: 'Feria Artesanal, San Martín de los Andes', startsAt: new Date('2026-08-02T20:00:00Z'), createdBy: adminId },
  ]);

  // Diario de marca (miniblog, solo lectura en Sprint 1)
  await db.insert(brandPosts).values([
    { brandId: req(brand, 'ecofungi'), title: 'Recolección de esta mañana', body: 'Aprovechamos el rocío para cosechar las gírgolas más frescas del bloque nuevo.' },
    { brandId: req(brand, 'ecofungi'), title: 'Nuevos envases compostables', body: 'Migramos el 100% de nuestros kits a envases de cartón kraft biodegradable.' },
    { brandId: req(brand, 'ceramica-ruke'), title: 'Horneada de invierno', body: 'Salió del horno la nueva serie de tazas con esmaltes tierra.' },
  ]);

  // Favoritos de clientes
  await db.insert(favorites).values([
    { userId: req(user, 'vale@cliente.ar'), brandId: req(brand, 'ecofungi') },
    { userId: req(user, 'vale@cliente.ar'), brandId: req(brand, 'neshama') },
    { userId: req(user, 'nico@cliente.ar'), brandId: req(brand, 'ceramica-ruke') },
  ]);

  console.log(
    `🌱 Seed: ${CATEGORIES.length} categorías, ${brandRows.length} marcas, ${prodRows.length} productos, ${sealValues.length} sellos.`,
  );
}
