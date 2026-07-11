import { sql } from 'drizzle-orm';
import type { DB } from './connection.ts';
import {
  blogPosts,
  brandContacts,
  brandPosts,
  brands,
  categories,
  events,
  favorites,
  messages,
  orderItems,
  orders,
  productImpactSeals,
  products,
  sellerProfiles,
  users,
} from './schema/index.ts';
import type { impactSeal } from './schema/index.ts';

type Seal = (typeof impactSeal.enumValues)[number];

type Manager = { kind: 'seller'; sellerEmail: string; sellerName: string } | { kind: 'admin' };

type BrandDef = {
  slug: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  manager: Manager;
};

type ProductDef = {
  brand: string;
  slug: string;
  name: string;
  price: string;
  stock: number;
  description: string;
  imageUrl?: string;
  seals: Seal[];
};

function req(map: Record<string, string>, key: string): string {
  const value = map[key];
  if (!value) throw new Error(`seed: no se encontró la clave '${key}'`);
  return value;
}

const ADMIN_EMAIL = 'santi.creide@gmail.com';

const CATEGORIES = [
  { name: 'Alimentos', slug: 'alimentos', icon: 'nutrition' },
  { name: 'Cosmética', slug: 'cosmetica', icon: 'spa' },
  { name: 'Hogar', slug: 'hogar', icon: 'home' },
  { name: 'Diseño', slug: 'diseno', icon: 'design_services' },
  { name: 'Textil', slug: 'textil', icon: 'checkroom' },
  { name: 'Bienestar', slug: 'bienestar', icon: 'self_improvement' },
];

// 20 marcas inspiradas en el ecosistema real de la Ecoferia SMA
// (Assets/informe_eco_feria_sma.md). Lucía gestiona 2 marcas (demo de
// "un vendedor puede tener N marcas"); ONGs/espacios colectivos los gestiona admin.
const seller = (sellerEmail: string, sellerName: string): Manager => ({
  kind: 'seller',
  sellerEmail,
  sellerName,
});
const admin: Manager = { kind: 'admin' };

const BRANDS: BrandDef[] = [
  {
    slug: 'abeja-obrera',
    name: 'Abeja Obrera SMA',
    category: 'alimentos',
    tagline: 'Miel cruda de montaña',
    description:
      'Apicultura local y conservación de polinizadores en la cuenca lacustre. Producción estacional libre de agroquímicos con trazabilidad de origen.',
    manager: seller('lucia@ecofungi.ar', 'Lucía Fungi'),
  },
  {
    slug: 'miel-chancani',
    name: 'Miel Chancani',
    category: 'alimentos',
    tagline: 'Miel de bosque nativo',
    description:
      'Miel orgánica certificada del monte nativo de Chancani, distribuida en la Patagonia por nodos y cooperativas de consumo consciente.',
    manager: seller('carlos@mielchancani.ar', 'Carlos Monte'),
  },
  {
    slug: 'ecofungi',
    name: 'EcoFungi Patagonia',
    category: 'alimentos',
    tagline: 'Fungi-cultura circular',
    description:
      'Hongos comestibles frescos y deshidratados, sustratos orgánicos y kits de autocultivo en bloques de aserrín reciclado. Residuo cero.',
    manager: seller('lucia@ecofungi.ar', 'Lucía Fungi'),
  },
  {
    slug: 'sano-fresco-vivo',
    name: 'Sano.Fresco.Vivo',
    category: 'alimentos',
    tagline: 'Alimentos fermentados vivos',
    description:
      'Nutrición consciente: fermentos vivos, brotes ecológicos y talleres de cocina basada en plantas. Foco en la salud de la microbiota.',
    manager: seller('sofia@sanofrescovivo.ar', 'Sofía Vega'),
  },
  {
    slug: 'energia-vital',
    name: 'Energía Vital',
    category: 'cosmetica',
    tagline: 'Biocosmética botánica',
    description:
      'Rescate de la herboristería tradicional: cremas y ungüentos con flora nativa patagónica. Cruelty-free, empaques de vidrio retornables.',
    manager: seller('elena@energiavital.ar', 'Elena Ríos'),
  },
  {
    slug: 'mburucuya',
    name: 'Mburucuyá Terapias Herbales',
    category: 'bienestar',
    tagline: 'Fitomedicina y cannabis',
    description:
      'Aceites de espectro completo, cremas analgésicas botánicas y acompañamiento para inscripciones en REPROCANN. Cultivo orgánico controlado.',
    manager: seller('diego@mburucuya.ar', 'Diego Herbal'),
  },
  {
    slug: 'medicina-tierra-ciclica',
    name: 'Medicina de la Tierra Cíclica',
    category: 'bienestar',
    tagline: 'Salud integrativa y cíclica',
    description:
      'Tinturas madre, fitomedicina para la salud hormonal e infusiones personalizadas. Recolección ética de plantas medicinales locales.',
    manager: seller('ciclo@medicinatierra.ar', 'Ciclo Luna'),
  },
  {
    slug: 'neshama',
    name: 'Neshama Aromaterapia',
    category: 'cosmetica',
    tagline: 'Bienestar en cada esencia',
    description:
      'Aceites esenciales puros, brumas áuricas y blends de plantas para sahumado. Solo esencias naturales, sin fragancias sintéticas.',
    manager: seller('noa@neshama.ar', 'Noa Aroma'),
  },
  {
    slug: 'keni',
    name: 'Keñi Detergente Ecológico',
    category: 'hogar',
    tagline: 'Economía circular pura',
    description:
      'Detergentes y jabones sólidos a partir de aceite vegetal usado. Residuo cero, apto vegano, empaques compostables.',
    manager: seller('keni@detergentekeni.ar', 'Keni Ecológico'),
  },
  {
    slug: 'la-casa-habitat',
    name: 'La Casa Hábitat',
    category: 'hogar',
    tagline: 'Hábitat sustentable',
    description:
      'Mobiliario ecológico y diseño interior con madera recuperada. Materiales de kilómetro cero y reducción de la huella de carbono.',
    manager: seller('hugo@lacasahabitat.ar', 'Hugo Roble'),
  },
  {
    slug: 'con-amor-bijou',
    name: 'Con Amor Bijou',
    category: 'diseno',
    tagline: 'Joyería de autor',
    description:
      'Bijouterie fina con cristales naturales, piedras semipreciosas y metales modelados a mano. Slow-fashion, alta durabilidad.',
    manager: seller('amara@conamorbijou.ar', 'Amara Cruz'),
  },
  {
    slug: 'limona-limona',
    name: 'Limona Limona Diseño',
    category: 'textil',
    tagline: 'Textil utilitario de autor',
    description:
      'Bolsos materos, cartucheras y objetos textiles con estampas propias. Confección local con criterios de residuo mínimo.',
    manager: seller('lima@limonalimona.ar', 'Lima Sol'),
  },
  {
    slug: 'purpura-crochet',
    name: 'Púrpura Crochet Lab',
    category: 'textil',
    tagline: 'Tejido manual patrimonial',
    description:
      'Prendas y amigurumis tejidos íntegramente al crochet con fibras naturales regionales y comercio justo. Talleres formativos.',
    manager: seller('pura@purpuracrochet.ar', 'Pura Tejido'),
  },
  {
    slug: 'ceramica-ruke',
    name: 'Cerámica Ruke',
    category: 'diseno',
    tagline: 'Alfarería del bosque patagónico',
    description:
      'Vajilla utilitaria modelada a mano con esmaltes libres de plomo, inspirada en las texturas del bosque. 100% apta para alimentos.',
    manager: seller('mara@ceramicaruke.ar', 'Mara Ruke'),
  },
  {
    slug: 'club-cosechadores',
    name: 'Club de Cosechadores SMA',
    category: 'alimentos',
    tagline: 'Manos a la Fruta',
    description:
      'Rescate de fruta urbana excedentaria transformada en dulces artesanales. Las ganancias financian equipamiento para brigadistas de incendios.',
    manager: admin,
  },
  {
    slug: '33-orientales',
    name: '33 Orientales Patagonia',
    category: 'diseno',
    tagline: 'Economía social y comunitaria',
    description:
      'Red de la sociedad civil: talleres de oficios, ferias de canje y proyectos de soberanía económica con soporte a la economía popular.',
    manager: admin,
  },
  {
    slug: 'zigzag',
    name: 'Zig Zag Patagonia',
    category: 'textil',
    tagline: 'Upcycling de triple impacto',
    description:
      'Prendas y accesorios de descarte textil (lonas, parapentes en desuso) con inserción socio-laboral de costureras locales.',
    manager: seller('zoe@zigzagpatagonia.ar', 'Zoe Lona'),
  },
  {
    slug: 'aquelarre',
    name: 'Aquelarre Tienda Colectiva',
    category: 'diseno',
    tagline: 'Espacio multimarca cooperativo',
    description:
      'Tienda colectiva que aloja de forma asociativa a diseñadores independientes locales, democratizando los canales de venta.',
    manager: admin,
  },
  {
    slug: 'neptuniana',
    name: 'Neptuniana Patagonia',
    category: 'diseno',
    tagline: 'Arte autogestivo y contracultura',
    description:
      'Indumentaria con estampas alternativas, láminas y stickers con fuerte identidad visual urbana y patagónica. Producción a pequeña escala.',
    manager: seller('neptu@neptuniana.ar', 'Neptu Arte'),
  },
  {
    slug: 'free-rock',
    name: 'Free Rock Lifestyle',
    category: 'textil',
    tagline: 'Montañismo consciente',
    description:
      'Indumentaria y equipamiento outdoor de alta resistencia pensados para durar. Fomento de la conexión respetuosa con la montaña.',
    manager: seller('rocco@freerock.ar', 'Rocco Montaña'),
  },
];

const PRODUCTS: ProductDef[] = [
  // Abeja Obrera SMA
  {
    brand: 'abeja-obrera',
    slug: 'miel-cruda-500',
    name: 'Miel Cruda de Montaña 500g',
    price: '12000',
    stock: 40,
    description: 'Miel pura de la precordillera, sin agroquímicos.',
    imageUrl: '/products/miel-cruda-montana-500g.webp',
    seals: ['local', 'organico'],
  },
  {
    brand: 'abeja-obrera',
    slug: 'propoleo-gotas',
    name: 'Propóleo en Gotas',
    price: '8500',
    stock: 35,
    description: 'Extracto de propóleo de la cuenca lacustre local.',
    imageUrl: '/products/propoleo-gotas.webp',
    seals: ['local'],
  },
  {
    brand: 'abeja-obrera',
    slug: 'panal-cera',
    name: 'Panal de Cera Natural',
    price: '9800',
    stock: 15,
    description: 'Panal de cera de abeja natural con miel.',
    imageUrl: '/products/panal-cera-natural.webp',
    seals: ['local', 'organico'],
  },
  {
    brand: 'abeja-obrera',
    slug: 'polen-abeja',
    name: 'Polen de Abeja',
    price: '7200',
    stock: 28,
    description: 'Polen fresco recolectado en primavera.',
    imageUrl: '/products/polen-abeja.webp',
    seals: ['local', 'organico'],
  },
  // Miel Chancani
  {
    brand: 'miel-chancani',
    slug: 'miel-monte-nativo',
    name: 'Miel Orgánica de Monte Nativo',
    price: '11500',
    stock: 30,
    description: 'Miel del bosque nativo, libre de monocultivos.',
    seals: ['organico', 'fair_trade'],
  },
  {
    brand: 'miel-chancani',
    slug: 'miel-quebracho',
    name: 'Miel de Quebracho',
    price: '12500',
    stock: 20,
    description: 'Miel ambarina intensa de floración de quebracho.',
    seals: ['organico', 'fair_trade'],
  },
  {
    brand: 'miel-chancani',
    slug: 'miel-algarrobo',
    name: 'Miel de Algarrobo',
    price: '12500',
    stock: 20,
    description: 'Miel suave de algarrobo del monte cordobés.',
    seals: ['organico', 'fair_trade'],
  },
  // EcoFungi Patagonia
  {
    brand: 'ecofungi',
    slug: 'girgolas-frescas',
    name: 'Gírgolas Frescas',
    price: '14500',
    stock: 20,
    description: 'Gírgolas cultivadas en bloques de aserrín reciclado.',
    imageUrl: '/products/girgolas-frescas.webp',
    seals: ['local', 'organico'],
  },
  {
    brand: 'ecofungi',
    slug: 'melena-de-leon',
    name: 'Melena de León Fresca',
    price: '16800',
    stock: 12,
    description: 'Hongo gourmet de textura marina, cultivo circular.',
    imageUrl: '/products/melena-leon-fresca.webp',
    seals: ['local', 'organico'],
  },
  {
    brand: 'ecofungi',
    slug: 'hongos-deshidratados',
    name: 'Hongos Deshidratados Mix',
    price: '12800',
    stock: 30,
    description: 'Mezcla deshidratada de gírgolas y melena de león.',
    seals: ['zero_waste', 'local'],
  },
  {
    brand: 'ecofungi',
    slug: 'kit-autocultivo-girgolas',
    name: 'Kit de Autocultivo Gírgolas',
    price: '15500',
    stock: 25,
    description: 'Cultivá tus propias gírgolas en casa, residuo cero.',
    seals: ['zero_waste'],
  },
  // Sano.Fresco.Vivo
  {
    brand: 'sano-fresco-vivo',
    slug: 'kefir-agua',
    name: 'Kéfir de Agua Vivo',
    price: '6500',
    stock: 25,
    description: 'Bebida probiótica viva para la microbiota.',
    imageUrl: '/products/kefir-agua-vivo.webp',
    seals: ['local', 'organico'],
  },
  {
    brand: 'sano-fresco-vivo',
    slug: 'chucrut-violeta',
    name: 'Chucrut Violeta',
    price: '5800',
    stock: 30,
    description: 'Repollo colorado fermentado, agroecológico.',
    imageUrl: '/products/chucrut-violeta.webp',
    seals: ['local', 'organico'],
  },
  {
    brand: 'sano-fresco-vivo',
    slug: 'kimchi-patagonico',
    name: 'Kimchi Patagónico',
    price: '6900',
    stock: 22,
    description: 'Kimchi de estación con insumos locales.',
    imageUrl: '/products/kimchi-patagonico.webp',
    seals: ['local', 'organico'],
  },
  {
    brand: 'sano-fresco-vivo',
    slug: 'brotes-mix',
    name: 'Brotes Ecológicos Mix',
    price: '4200',
    stock: 40,
    description: 'Brotes frescos de estación, cultivo propio.',
    seals: ['local', 'organico'],
  },
  // Energía Vital
  {
    brand: 'energia-vital',
    slug: 'crema-facial-botanica',
    name: 'Crema Facial Botánica',
    price: '10500',
    stock: 18,
    description: 'Crema facial con activos de flora nativa.',
    imageUrl: '/products/crema-facial-botanica.webp',
    seals: ['organico', 'zero_waste'],
  },
  {
    brand: 'energia-vital',
    slug: 'unguento-calendula',
    name: 'Ungüento de Caléndula',
    price: '7800',
    stock: 26,
    description: 'Ungüento medicinal reparador de caléndula.',
    imageUrl: '/products/unguento-calendula.webp',
    seals: ['organico'],
  },
  {
    brand: 'energia-vital',
    slug: 'elixir-mosqueta',
    name: 'Elixir de Rosa Mosqueta',
    price: '12800',
    stock: 14,
    description: 'Elixir facial de rosa mosqueta patagónica.',
    seals: ['organico', 'zero_waste'],
  },
  {
    brand: 'energia-vital',
    slug: 'jabon-lavanda',
    name: 'Jabón de Lavanda Botánico',
    price: '4500',
    stock: 40,
    description: 'Jabón artesanal de base vegetal pura.',
    imageUrl: '/products/jabon-lavanda-botanico.webp',
    seals: ['organico', 'zero_waste'],
  },
  // Mburucuyá
  {
    brand: 'mburucuya',
    slug: 'aceite-full-spectrum',
    name: 'Aceite Full Spectrum 10%',
    price: '24000',
    stock: 15,
    description: 'Aceite de cannabis de espectro completo estandarizado.',
    seals: ['organico'],
  },
  {
    brand: 'mburucuya',
    slug: 'crema-analgesica',
    name: 'Crema Analgésica Botánica',
    price: '13500',
    stock: 20,
    description: 'Crema analgésica con cannabinoides y botánicos.',
    seals: ['organico'],
  },
  {
    brand: 'mburucuya',
    slug: 'aceite-canamo',
    name: 'Aceite de Cáñamo Puro',
    price: '18000',
    stock: 16,
    description: 'Aceite de cáñamo prensado en frío.',
    seals: ['organico'],
  },
  // Medicina de la Tierra Cíclica
  {
    brand: 'medicina-tierra-ciclica',
    slug: 'tintura-milenrama',
    name: 'Tintura Madre de Milenrama',
    price: '8600',
    stock: 24,
    description: 'Tintura madre para la salud hormonal.',
    seals: ['organico', 'local'],
  },
  {
    brand: 'medicina-tierra-ciclica',
    slug: 'infusion-hormonal',
    name: 'Infusión Hormonal Herbal',
    price: '6200',
    stock: 30,
    description: 'Blend de infusión personalizada de ciclo.',
    seals: ['organico', 'local'],
  },
  {
    brand: 'medicina-tierra-ciclica',
    slug: 'aceite-calendula-ciclico',
    name: 'Aceite de Caléndula Cíclico',
    price: '9400',
    stock: 18,
    description: 'Aceite macerado de recolección consciente.',
    seals: ['organico', 'local'],
  },
  // Neshama Aromaterapia
  {
    brand: 'neshama',
    slug: 'aceite-lavanda',
    name: 'Aceite Esencial de Lavanda',
    price: '9800',
    stock: 18,
    description: 'Esencia pura de lavanda, sin fragancias sintéticas.',
    seals: ['organico'],
  },
  {
    brand: 'neshama',
    slug: 'bruma-aurica',
    name: 'Bruma Áurica Calma',
    price: '7600',
    stock: 24,
    description: 'Bruma de plantas para armonizar el ambiente.',
    seals: ['organico', 'local'],
  },
  {
    brand: 'neshama',
    slug: 'oleo-corporal',
    name: 'Óleo Corporal Vibracional',
    price: '11200',
    stock: 16,
    description: 'Óleo botánico con activos de flora nativa.',
    seals: ['organico'],
  },
  {
    brand: 'neshama',
    slug: 'blend-sahumar',
    name: 'Blend para Sahumar',
    price: '6400',
    stock: 28,
    description: 'Mezcla de plantas locales para sahumado natural.',
    seals: ['zero_waste', 'local'],
  },
  // Keñi
  {
    brand: 'keni',
    slug: 'detergente-solido',
    name: 'Detergente Sólido Rallado',
    price: '5200',
    stock: 50,
    description: 'Detergente sólido de aceite vegetal usado (AVU).',
    seals: ['zero_waste', 'local'],
  },
  {
    brand: 'keni',
    slug: 'jabon-biodegradable',
    name: 'Jabón Biodegradable',
    price: '3800',
    stock: 60,
    description: 'Jabón vegano, sin fragancias, apto Patagonia.',
    seals: ['zero_waste'],
  },
  {
    brand: 'keni',
    slug: 'pack-zerowaste-cocina',
    name: 'Pack Zero Waste Cocina',
    price: '9600',
    stock: 20,
    description: 'Kit de limpieza de cocina residuo cero.',
    seals: ['zero_waste', 'local'],
  },
  // La Casa Hábitat
  {
    brand: 'la-casa-habitat',
    slug: 'banqueta-madera',
    name: 'Banqueta de Madera Recuperada',
    price: '28000',
    stock: 8,
    description: 'Banqueta de madera recuperada de kilómetro cero.',
    seals: ['local', 'zero_waste'],
  },
  {
    brand: 'la-casa-habitat',
    slug: 'estante-bio',
    name: 'Estante Bioconstruido',
    price: '22000',
    stock: 10,
    description: 'Estante de diseño con materiales locales.',
    seals: ['local', 'zero_waste'],
  },
  {
    brand: 'la-casa-habitat',
    slug: 'lampara-km0',
    name: 'Lámpara de Kilómetro Cero',
    price: '16500',
    stock: 12,
    description: 'Lámpara de madera recuperada y bajo consumo.',
    seals: ['local', 'zero_waste'],
  },
  // Con Amor Bijou
  {
    brand: 'con-amor-bijou',
    slug: 'collar-cuarzo',
    name: 'Collar de Cristal de Cuarzo',
    price: '9500',
    stock: 20,
    description: 'Collar con cristal de cuarzo natural.',
    imageUrl: '/products/collar-cristal-cuarzo.webp',
    seals: ['local', 'fair_trade'],
  },
  {
    brand: 'con-amor-bijou',
    slug: 'aros-plata',
    name: 'Aros de Plata Martillada',
    price: '12500',
    stock: 15,
    description: 'Aros de plata modelados a mano.',
    seals: ['local', 'fair_trade'],
  },
  {
    brand: 'con-amor-bijou',
    slug: 'anillo-piedra',
    name: 'Anillo de Piedra Semipreciosa',
    price: '8800',
    stock: 18,
    description: 'Anillo ajustable con piedra semipreciosa.',
    seals: ['local', 'fair_trade'],
  },
  // Limona Limona
  {
    brand: 'limona-limona',
    slug: 'bolso-matero',
    name: 'Bolso Matero de Autor',
    price: '13500',
    stock: 16,
    description: 'Bolso matero con estampa propia.',
    imageUrl: '/products/bolso-matero-autor.webp',
    seals: ['zero_waste', 'local'],
  },
  {
    brand: 'limona-limona',
    slug: 'cartuchera-estampada',
    name: 'Cartuchera Estampada',
    price: '6800',
    stock: 30,
    description: 'Cartuchera de tela con patrón de autor.',
    seals: ['zero_waste', 'local'],
  },
  {
    brand: 'limona-limona',
    slug: 'funda-notebook',
    name: 'Funda de Notebook',
    price: '9200',
    stock: 20,
    description: 'Funda acolchada de retazos reutilizados.',
    seals: ['zero_waste', 'local'],
  },
  // Púrpura Crochet Lab
  {
    brand: 'purpura-crochet',
    slug: 'saco-crochet',
    name: 'Saco Tejido a Crochet',
    price: '24000',
    stock: 8,
    description: 'Saco exclusivo tejido con lanas regionales.',
    seals: ['fair_trade', 'local'],
  },
  {
    brand: 'purpura-crochet',
    slug: 'amigurumi-zorro',
    name: 'Amigurumi Zorro Patagónico',
    price: '7500',
    stock: 25,
    description: 'Amigurumi tejido a mano con algodón.',
    seals: ['fair_trade', 'local'],
  },
  {
    brand: 'purpura-crochet',
    slug: 'gorro-lana',
    name: 'Gorro de Lana Regional',
    price: '8900',
    stock: 22,
    description: 'Gorro de lana de oveja de comercio justo.',
    seals: ['fair_trade', 'local'],
  },
  // Cerámica Ruke
  {
    brand: 'ceramica-ruke',
    slug: 'taza-bosque',
    name: 'Taza de Cerámica Bosque',
    price: '8500',
    stock: 30,
    description: 'Taza modelada a mano, esmalte libre de plomo.',
    imageUrl: '/products/taza-ceramica-bosque.webp',
    seals: ['local', 'fair_trade'],
  },
  {
    brand: 'ceramica-ruke',
    slug: 'cuenco-utilitario',
    name: 'Cuenco Utilitario',
    price: '9500',
    stock: 20,
    description: 'Cuenco de uso diario inspirado en el bosque.',
    seals: ['local', 'fair_trade'],
  },
  {
    brand: 'ceramica-ruke',
    slug: 'plato-esmaltado',
    name: 'Plato Playo Esmaltado',
    price: '7800',
    stock: 25,
    description: 'Plato playo con esmalte apto para alimentos.',
    seals: ['local'],
  },
  {
    brand: 'ceramica-ruke',
    slug: 'set-bowls',
    name: 'Set de Bowls (x2)',
    price: '16500',
    stock: 10,
    description: 'Set de dos bowls con texturas del bosque.',
    seals: ['local', 'fair_trade'],
  },
  // Club de Cosechadores (admin)
  {
    brand: 'club-cosechadores',
    slug: 'dulce-ciruela',
    name: 'Dulce de Ciruela Urbana',
    price: '5500',
    stock: 30,
    description: 'Dulce de fruta urbana rescatada. Fin solidario.',
    seals: ['zero_waste', 'local', 'fair_trade'],
  },
  {
    brand: 'club-cosechadores',
    slug: 'mermelada-damasco',
    name: 'Mermelada de Damasco Rescatado',
    price: '5800',
    stock: 28,
    description: 'Mermelada de damascos que se iban a perder.',
    seals: ['zero_waste', 'local', 'fair_trade'],
  },
  {
    brand: 'club-cosechadores',
    slug: 'conserva-pera',
    name: 'Conserva de Pera',
    price: '6200',
    stock: 22,
    description: 'Conserva artesanal de pera excedentaria.',
    seals: ['zero_waste', 'local'],
  },
  // 33 Orientales (admin)
  {
    brand: '33-orientales',
    slug: 'cuaderno-taller',
    name: 'Cuaderno de Taller Comunitario',
    price: '4800',
    stock: 40,
    description: 'Cuaderno artesanal de los talleres de oficios.',
    seals: ['fair_trade', 'local'],
  },
  {
    brand: '33-orientales',
    slug: 'bolsa-canje',
    name: 'Bolsa de Feria de Canje',
    price: '3500',
    stock: 50,
    description: 'Bolsa reutilizable de la economía social.',
    seals: ['fair_trade', 'local', 'zero_waste'],
  },
  {
    brand: '33-orientales',
    slug: 'kit-escolar',
    name: 'Kit Escolar Solidario',
    price: '7200',
    stock: 30,
    description: 'Kit de útiles para apoyo escolar comunitario.',
    seals: ['fair_trade', 'local'],
  },
  // Zig Zag Patagonia
  {
    brand: 'zigzag',
    slug: 'mochila-lona',
    name: 'Mochila de Lona Reciclada',
    price: '22000',
    stock: 12,
    description: 'Mochila de lonas publicitarias en desuso.',
    imageUrl: '/products/mochila-lona-reciclada.webp',
    seals: ['zero_waste', 'fair_trade'],
  },
  {
    brand: 'zigzag',
    slug: 'rinonera-upcycling',
    name: 'Riñonera Upcycling',
    price: '14500',
    stock: 18,
    description: 'Riñonera de retazos textiles de la industria local.',
    seals: ['zero_waste', 'fair_trade'],
  },
  {
    brand: 'zigzag',
    slug: 'cartuchera-parapente',
    name: 'Cartuchera de Parapente',
    price: '8900',
    stock: 22,
    description: 'Cartuchera confeccionada con parapentes reciclados.',
    seals: ['zero_waste'],
  },
  {
    brand: 'zigzag',
    slug: 'campera-lona',
    name: 'Campera de Lona Reutilizada',
    price: '32000',
    stock: 6,
    description: 'Campera de abrigo de lonas desviadas del vertedero.',
    seals: ['zero_waste', 'fair_trade'],
  },
  // Aquelarre (admin)
  {
    brand: 'aquelarre',
    slug: 'caja-regalo-curada',
    name: 'Caja Regalo Curada',
    price: '15000',
    stock: 15,
    description: 'Selección de productos de diseñadores locales.',
    seals: ['local', 'fair_trade'],
  },
  {
    brand: 'aquelarre',
    slug: 'set-autores',
    name: 'Set de Autores Locales',
    price: '18000',
    stock: 10,
    description: 'Set colaborativo de la tienda colectiva.',
    seals: ['local', 'fair_trade'],
  },
  {
    brand: 'aquelarre',
    slug: 'lamina-colectiva',
    name: 'Lámina Colectiva Ilustrada',
    price: '5500',
    stock: 30,
    description: 'Lámina ilustrada por artistas del espacio.',
    seals: ['local'],
  },
  // Neptuniana Patagonia
  {
    brand: 'neptuniana',
    slug: 'remera-estampa',
    name: 'Remera Estampa Patagónica',
    price: '11500',
    stock: 20,
    description: 'Remera con estampa de diseño alternativo.',
    seals: ['local'],
  },
  {
    brand: 'neptuniana',
    slug: 'lamina-artistica',
    name: 'Lámina Artística Alternativa',
    price: '4800',
    stock: 35,
    description: 'Lámina de arte con identidad urbana patagónica.',
    seals: ['local'],
  },
  {
    brand: 'neptuniana',
    slug: 'pack-stickers',
    name: 'Pack de Stickers Autogestivos',
    price: '2800',
    stock: 60,
    description: 'Pack de stickers de producción independiente.',
    seals: ['local'],
  },
  // Free Rock Lifestyle
  {
    brand: 'free-rock',
    slug: 'gorra-outdoor',
    name: 'Gorra Outdoor Resistente',
    price: '9800',
    stock: 25,
    description: 'Gorra de alta durabilidad para la montaña.',
    seals: ['local', 'zero_waste'],
  },
  {
    brand: 'free-rock',
    slug: 'taza-viaje',
    name: 'Taza de Viaje Térmica',
    price: '12500',
    stock: 20,
    description: 'Taza térmica para reducir descartables.',
    seals: ['local', 'zero_waste'],
  },
  {
    brand: 'free-rock',
    slug: 'buzo-montana',
    name: 'Buzo de Montaña Durable',
    price: '26000',
    stock: 12,
    description: 'Buzo de abrigo pensado para durar años.',
    seals: ['local', 'zero_waste'],
  },
];

const CLIENTS = [
  { name: 'Vale Cliente', email: 'vale@cliente.ar' },
  { name: 'Nico Cliente', email: 'nico@cliente.ar' },
];

/**
 * Puebla la base con datos demo inspirados en el ecosistema real de la Ecoferia SMA
 * (Assets/informe_eco_feria_sma.md).
 *
 * Idempotente y **seguro para producción**: reinsertar el catálogo (marcas,
 * productos, contenido) pero **hace upsert de `users`** — NO los borra — y no
 * toca las tablas de Better Auth (`accounts`/`sessions`/`verifications`). Así,
 * si el admin ya se registró con contraseña, su cuenta y su login se preservan.
 */
export async function seedDatabase(db: DB): Promise<void> {
  const catByBrand = new Map(BRANDS.map((b) => [b.slug, b.category]));

  // Borrado del catálogo (NO users ni tablas de auth) en orden seguro de FKs.
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

  // Categorías
  const catRows = await db
    .insert(categories)
    .values(CATEGORIES)
    .returning({ id: categories.id, slug: categories.slug });
  const cat = Object.fromEntries(catRows.map((r) => [r.slug, r.id]));

  // Vendedores únicos derivados de las marcas (Lucía gestiona 2 => aparece una vez).
  const sellersByEmail = new Map<string, string>();
  for (const b of BRANDS) {
    if (b.manager.kind === 'seller' && !sellersByEmail.has(b.manager.sellerEmail)) {
      sellersByEmail.set(b.manager.sellerEmail, b.manager.sellerName);
    }
  }

  // Usuarios: upsert por email (preserva cuentas de auth existentes).
  const userValues = [
    { name: 'Santiago Creide', email: ADMIN_EMAIL, role: 'admin' as const },
    ...[...sellersByEmail].map(([email, name]) => ({ name, email, role: 'vendedor' as const })),
    { name: 'Sol Espera', email: 'sol@pendiente.ar', role: 'vendedor' as const },
    ...CLIENTS.map((c) => ({ ...c, role: 'cliente' as const })),
  ];
  const userRows = await db
    .insert(users)
    .values(userValues)
    .onConflictDoUpdate({
      target: users.email,
      set: { name: sql`excluded.name`, role: sql`excluded.role` },
    })
    .returning({ id: users.id, email: users.email });
  const user = Object.fromEntries(userRows.map((r) => [r.email, r.id]));
  const adminId = req(user, ADMIN_EMAIL);

  // Perfiles de vendedor: todos aprobados + 1 pendiente (demo del flujo de aprobación).
  const sellerProfileValues = [
    ...[...sellersByEmail].map(([email]) => ({
      userId: req(user, email),
      status: 'aprobado' as const,
      bio: 'Productor/a de la Ecoferia patagónica.',
    })),
    {
      userId: req(user, 'sol@pendiente.ar'),
      status: 'pendiente' as const,
      bio: 'Emprendimiento en evaluación.',
    },
  ];
  const sellerRows = await db
    .insert(sellerProfiles)
    .values(sellerProfileValues)
    .returning({ id: sellerProfiles.id, userId: sellerProfiles.userId });
  const sellerByUser = Object.fromEntries(sellerRows.map((r) => [r.userId, r.id]));
  const sellerIdFor = (email: string) => req(sellerByUser, req(user, email));

  // Marcas: XOR gestor (vendedor O admin).
  const brandValues = BRANDS.map((b) => ({
    name: b.name,
    slug: b.slug,
    tagline: b.tagline,
    description: b.description,
    categoryId: req(cat, b.category),
    ...(b.manager.kind === 'seller'
      ? { managedBySellerId: sellerIdFor(b.manager.sellerEmail) }
      : { managedByAdminId: adminId }),
  }));
  const brandRows = await db
    .insert(brands)
    .values(brandValues)
    .returning({ id: brands.id, slug: brands.slug });
  const brand = Object.fromEntries(brandRows.map((r) => [r.slug, r.id]));

  // Productos
  const prodRows = await db
    .insert(products)
    .values(
      PRODUCTS.map((p) => ({
        brandId: req(brand, p.brand),
        categoryId: req(cat, catByBrand.get(p.brand) ?? 'diseno'),
        slug: p.slug,
        name: p.name,
        description: p.description,
        imageUrl: p.imageUrl,
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
    {
      authorUserId: adminId,
      title: 'Cosecha de Rosa Mosqueta',
      slug: 'cosecha-rosa-mosqueta',
      body: 'Cómo recolectar este fruto patagónico respetando los ciclos de la naturaleza.',
    },
    {
      authorUserId: adminId,
      title: 'Manos de Barro: conociendo a Lucía',
      slug: 'manos-de-barro-lucia',
      body: 'Una charla íntima con la ceramista detrás de las piezas más buscadas de la feria.',
    },
    {
      authorUserId: adminId,
      title: 'Kéfir: el fermento vivo de tu microbiota',
      slug: 'kefir-microbiota',
      body: 'Qué es el kéfir, por qué hace bien y cómo incorporarlo a tu alimentación diaria.',
    },
    {
      authorUserId: adminId,
      title: 'Upcycling textil: de la lona al bolso',
      slug: 'upcycling-textil',
      body: 'El recorrido de una lona publicitaria hasta convertirse en un accesorio de diseño.',
    },
    {
      authorUserId: adminId,
      title: 'Cannabis medicinal y REPROCANN: guía básica',
      slug: 'cannabis-reprocann',
      body: 'Primeros pasos para acceder de forma legal al cannabis terapéutico.',
    },
  ]);

  // Agenda cultural
  await db.insert(events).values([
    {
      title: 'Feria Itinerante en Bariloche',
      description: 'Más de 50 productores locales, música en vivo y talleres.',
      location: 'Centro Cívico, Bariloche',
      startsAt: new Date('2026-07-19T17:00:00Z'),
      createdBy: adminId,
    },
    {
      title: 'Taller de Fermentos Vivos',
      description: 'Kéfir, chucrut y kimchi con insumos agroecológicos de estación.',
      location: 'Feria Artesanal, San Martín de los Andes',
      startsAt: new Date('2026-08-02T20:00:00Z'),
      createdBy: adminId,
    },
    {
      title: 'Ronda de Trueque en el Aquelarre',
      description: 'Intercambio de objetos y saberes entre vecinos y diseñadores.',
      location: 'Aquelarre Tienda Colectiva, SMA',
      startsAt: new Date('2026-08-16T18:00:00Z'),
      createdBy: adminId,
    },
    {
      title: 'Taller de Crochet Terapéutico',
      description: 'Introducción al tejido manual como práctica sustentable y de bienestar.',
      location: 'Púrpura Crochet Lab, SMA',
      startsAt: new Date('2026-08-30T16:00:00Z'),
      createdBy: adminId,
    },
  ]);

  // Diario de marca (miniblog, solo lectura en Sprint 1)
  await db.insert(brandPosts).values([
    {
      brandId: req(brand, 'ecofungi'),
      title: 'Recolección de esta mañana',
      body: 'Aprovechamos el rocío para cosechar las gírgolas más frescas del bloque nuevo.',
    },
    {
      brandId: req(brand, 'ecofungi'),
      title: 'Nuevos envases compostables',
      body: 'Migramos el 100% de nuestros kits a envases de cartón kraft biodegradable.',
    },
    {
      brandId: req(brand, 'ceramica-ruke'),
      title: 'Horneada de invierno',
      body: 'Salió del horno la nueva serie de tazas con esmaltes tierra.',
    },
    {
      brandId: req(brand, 'neshama'),
      title: 'Nueva cosecha de lavanda',
      body: 'Empezamos a destilar la lavanda de esta temporada. El taller huele increíble.',
    },
    {
      brandId: req(brand, 'zigzag'),
      title: 'Rescatamos 200kg de lona este mes',
      body: 'Gracias a la alianza con cartelería local desviamos 200kg de lona del vertedero.',
    },
    {
      brandId: req(brand, 'club-cosechadores'),
      title: 'Jornada Manos a la Fruta',
      body: 'Cosechamos ciruelas de veredas del barrio para transformarlas en dulces solidarios.',
    },
  ]);

  // Favoritos de clientes
  await db.insert(favorites).values([
    { userId: req(user, 'vale@cliente.ar'), brandId: req(brand, 'ecofungi') },
    { userId: req(user, 'vale@cliente.ar'), brandId: req(brand, 'neshama') },
    { userId: req(user, 'vale@cliente.ar'), brandId: req(brand, 'ceramica-ruke') },
    { userId: req(user, 'nico@cliente.ar'), brandId: req(brand, 'zigzag') },
    { userId: req(user, 'nico@cliente.ar'), brandId: req(brand, 'abeja-obrera') },
  ]);

  console.log(
    `🌱 Seed: ${CATEGORIES.length} categorías, ${brandRows.length} marcas, ${prodRows.length} productos, ${sealValues.length} sellos, ${userRows.length} usuarios (upsert).`,
  );
}
