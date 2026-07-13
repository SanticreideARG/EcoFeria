import { readFile, writeFile } from 'node:fs/promises';
import subsetFont from 'subset-font';

/**
 * Subsetea material-symbols-outlined.woff2 a solo los íconos que usa la app.
 * Material Symbols mapea nombres de ícono a glifos vía ligaduras OpenType
 * (GSUB) sobre el texto literal (ej. el string "search" -> glifo de lupa), no
 * por codepoint. Por eso se subsetea por TEXTO (subset-font/hb-subset shapea
 * el texto y conserva exactamente las reglas GSUB + glifos que produce esa
 * shape), no por rango de codepoints.
 *
 * Lista de íconos: mantenida a mano — si se agrega un <Icon name="..."/> nuevo
 * en el front, hay que sumarlo acá y volver a correr `pnpm subset-icons`.
 *
 * Nota sobre el tamaño resultante (~250KB, no unos pocos KB como cabría esperar
 * para ~36 glifos): Material Symbols implementa las ligaduras vía reglas GSUB
 * de clases compartidas entre muchos íconos a la vez (no una regla 1:1 por
 * ícono). El closure de hb-subset, al pedir aunque sea un puñado de íconos
 * distintos, tiene que retener esa infraestructura compartida completa —
 * verificado: 1 ícono solo pesa ~4.6KB/17 glifos, pero ya con ~18 íconos la
 * meseta compartida se dispara a ~4500 glifos y no crece mucho más de ahí en
 * adelante. Fijar wght/GRAD/opsz (variationAxes) es lo que de verdad aporta
 * la reducción real (3.4MB -> ~250KB); el resto es costo estructural del
 * propio font. Para bajar más haría falta migrar <Icon> a codepoints PUA en
 * vez de nombres de texto (Material Symbols publica ese mapeo), que evita
 * el GSUB por completo — no encarado acá por alcance.
 */
const ICONS = [
  'menu', 'close', 'shopping_bag', 'person', 'storefront', 'cloud_off', 'image',
  'add_shopping_cart', 'explore_off', 'search', 'arrow_forward', 'eco',
  'article', 'calendar_month', 'arrow_back', 'favorite', 'chat_bubble',
  'mark_email_read', 'location_on', 'category', 'photo_camera',
  'shopping_cart', 'event_note', 'search_off', 'remove', 'add',
  'shield_person', 'error', 'event', 'delete', 'inbox',
  // Controles del hero carousel (HomePage) y menú móvil (TopAppBar)
  'play_arrow', 'pause',
  // Íconos de categoría (sembrados en la DB, Assets/04-MODELO-DATOS.md)
  'nutrition', 'spa', 'home', 'design_services', 'checkroom', 'self_improvement',
];

const SRC = new URL('../node_modules/material-symbols/material-symbols-outlined.woff2', import.meta.url);
const OUT = new URL('../src/assets/material-symbols-subset.woff2', import.meta.url);

const text = ICONS.join(' ');
const original = await readFile(SRC);
const subset = await subsetFont(original, text, {
  targetFormat: 'woff2',
  // El grueso del peso de una fuente variable vive en los datos de interpolación
  // (gvar) por eje, no en la cantidad de glifos. La app solo alterna FILL (0/1
  // vía el prop `filled` de <Icon>); wght/GRAD/opsz nunca cambian, así que se
  // fijan a su valor por defecto para eliminar esa interpolación por completo.
  variationAxes: {
    wght: 400,
    GRAD: 0,
    opsz: 24,
  },
});

await writeFile(OUT, subset);

console.log(
  `Subset: ${ICONS.length} íconos · ${(original.length / 1024 / 1024).toFixed(2)}MB -> ${(subset.length / 1024).toFixed(1)}KB`,
);
