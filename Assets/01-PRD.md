# La Ecoferia — Documento de Requisitos del Producto (PRD)

**Versión:** 1.0 · **Fecha:** Julio 2026 · **Estado:** Base para Sprint 1

---

## 1. Visión del Proyecto

**La Ecoferia** es un marketplace multimarca especializado en productos sustentables de la Patagonia (Alto Valle de Neuquén y Río Negro). Su propósito es conectar a productores artesanales locales con consumidores conscientes, fomentando la economía regional y el consumo responsable.

El proyecto toma como referencia real la Ecoferia de San Martín de los Andes: una red de ferias y eventos presenciales de proyectos, artistas y emprendimientos sustentables (arte, producción responsable, encuentro comunitario), con talleres, charlas, música en vivo y stands. La plataforma digital extiende ese espíritu comunitario al canal online.

## 2. Identidad de Marca

| Atributo | Definición |
|---|---|
| **Nombre** | La Ecoferia |
| **Eslogan** | "Cultivando el Mañana" / "Raíces de nuestra tierra" |
| **Estética** | Orgánica, artesanal y cálida. Inspirada en los mercados de montaña |
| **Paleta** | Verdes tierra (Bosque `#506049`, Sage), Terracota suave `#8e4d31`, Blanco hueso `#fbf9f4`, Madera clara / papel kraft `#DCC7A1` |
| **Tipografía** | *Playfair Display* (serif humana, títulos) + *Inter* (sans-serif, cuerpo) |
| **Tono de comunicación** | Cálido, comunitario, en 1ª persona plural; bilingüe ES/EN en redes; emojis naturales (🌎💚🦋🫂); mensaje de "conciencia que se convierte en acción" |
| **Hashtags** | #Ecoferia #Comunidad #ConsumoConsciente #EconomíaCircular #Reciclaje #Sustainability #CircularEconomy #Composting #Recycling |

## 3. Público Objetivo

- **Consumidores:** personas interesadas en sustentabilidad, productos de origen local, alimentación orgánica y oficios tradicionales.
- **Vendedores:** pequeños productores, artesanos, cooperativas y emprendimientos de triple impacto de la región patagónica.

### 3.1 Rubros y curaduría de marcas (referencias reales)

| Rubro | Cuentas / proyectos de referencia |
|---|---|
| Cosmética natural | mareaverdecosmetica, neshamaaromaterapia |
| Upcycling / reciclaje | ts75upcycling, reciclajeans, denuevo.arg |
| Viveros / plantas / fungi | viverocasanativa, ecofungi.patagonia |
| Miel / apicultura | abejaobrera.sma, mielchancani |
| Arte / artesanías | artbybandida, ceramicaruke, purpura.crochetlab |
| Moda / joyería | _conamorbijou, neptuniana.patagonia |
| Bienestar / terapias | medicinadelatierraciclica, energiavital |
| ONGs / política ambiental | 33orientalespatagonia.ong, lapoliticambiental |
| Espacios culturales | aquelarre_smandes, lacasahabitat |

## 4. Modelo de Negocio y Roles

Tres roles con permisos claramente segmentados:

1. **Cliente:** navega, compra, sigue marcas favoritas, tiene buzón de mensajes.
2. **Vendedor:** administra una o varias marcas, gestiona inventario, pedidos, mini-blog de marca y comunicación con clientes.
3. **Admin:** supervisión global de métricas, aprobación de nuevos vendedores, moderación de contenido y gestión de la agenda cultural.

**Regla clave de propiedad:** una marca es administrada por un admin **XOR** un vendedor — nunca ambos. Un vendedor puede tener varias marcas.

## 5. Estructura del Sitio (Mapa del Sitio)

### 5.1 Experiencia del Cliente (Mobile-First, PWA)

- **Home:** landing con categorías (Alimentos, Cosmética, Hogar, Diseño), novedades del blog y agenda de eventos.
- **Directorio de Marcas:** listado filtrable de productores con sus sellos de impacto.
- **Perfil de Marca (mini-landing):** tabs Productos / Sobre Nosotros / Contacto, con diario de marca (miniblog) y puntos de entrega.
- **Eshop:** catálogo con filtros por categoría, rango de precio y marca.
- **Detalle de Producto:** información detallada, historia del productor, botón de compra.
- **Carrito y Checkout:** proceso en 3 pasos (Envío → Pago → Confirmación), con productos agrupados por marca.
- **Panel de Usuario:** historial de pedidos, marcas favoritas, mensajes y perfil.
- **Ingreso / Registro:** email + contraseña y Google OAuth (Better Auth).

### 5.2 Ecosistema de Gestión

- **Panel de Vendedor:** dashboard de inventario, pedidos recibidos, mini-blog de marca y mensajería con clientes.
- **Panel de Administrador (Desktop):** métricas globales, aprobación de vendedores, moderación, directorio de marcas, pedidos globales y agenda cultural.

## 6. Requisitos Funcionales Clave

| ID | Requisito | Descripción |
|---|---|---|
| RF-01 | Multimarca | Agrupar productos por vendedor/marca en carrito y checkout |
| RF-02 | Sellos de Impacto | Etiquetas visuales: Orgánico, Local, Fair Trade, Zero Waste |
| RF-03 | Comunidad | Blog y Agenda Cultural integrados a la landing |
| RF-04 | Roles y permisos | admin / vendedor / cliente con segmentación estricta |
| RF-05 | Propiedad de marca | Admin XOR vendedor por marca; vendedor puede tener N marcas |
| RF-06 | Favoritos y mensajes | Clientes con marcas favoritas y buzón de mensajes |
| RF-07 | Mini-landing de marca | Contacto, miniblog y catálogo por marca |
| RF-08 | Localización | Interfaz 100% en español, terminología regional patagónica |
| RF-09 | PWA | Instalable, mobile-first, offline-friendly en catálogo |

## 7. Pilares de Diseño

1. **Mobile-First:** prioridad absoluta en móvil, manteniendo elegancia en desktop.
2. **Autenticidad:** fotografía real de productos y texturas (papel kraft, ruido orgánico) que eviten la estética "corporativa fría".
3. **Transparencia:** visibilidad total del origen y el impacto de cada producto.
4. **Comunidad:** el blog, la agenda y los perfiles de marca fortalecen el vínculo productor-consumidor.

## 8. Fuera de Alcance (Sprint 1)

- Pasarela de pago real (se maqueta el flujo; integración en sprint posterior).
- Notificaciones push.
- Mensajería en tiempo real (se implementa buzón asincrónico).
- App nativa (se cubre con PWA).

---

*Este documento sirve como base técnica y visual para el desarrollo de La Ecoferia, alineado con el sistema de diseño "Patagonian Artisanal Organic".*
