/** Formatea un monto en pesos argentinos (sin decimales). */
export function formatARS(value: number | string): string {
  const n = typeof value === 'string' ? Number(value) : value;
  if (Number.isNaN(n)) return '—';
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(n);
}

/** Fecha larga en español (ej. "19 de julio de 2026"). */
export function formatDateLong(iso: string): string {
  return new Intl.DateTimeFormat('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Argentina/Buenos_Aires',
  }).format(new Date(iso));
}

/** Fecha corta con hora (ej. "19 jul, 17:00 hs"). */
export function formatDateTimeShort(iso: string): string {
  const d = new Date(iso);
  const date = new Intl.DateTimeFormat('es-AR', {
    day: 'numeric',
    month: 'short',
    timeZone: 'America/Argentina/Buenos_Aires',
  }).format(d);
  const time = new Intl.DateTimeFormat('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Argentina/Buenos_Aires',
  }).format(d);
  return `${date}, ${time} hs`;
}
