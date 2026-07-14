const BASE = import.meta.env.VITE_API_URL ?? '/api';

// `include` para que se envíe la cookie de sesión de Better Auth (mismo criterio
// que auth-client). En same-origin es redundante pero inocuo; en cross-origin es
// necesario y el CORS de la API ya habilita credentials.
const withCreds: RequestInit = { credentials: 'include' };

/** GET tipado contra la API. Lanza si la respuesta no es 2xx. */
export async function apiGet<T>(pathname: string): Promise<T> {
  const res = await fetch(`${BASE}${pathname}`, withCreds);
  if (!res.ok) throw new Error(`API ${res.status} en ${pathname}`);
  return (await res.json()) as T;
}

/** POST tipado contra la API. */
export async function apiPost<T>(pathname: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${pathname}`, {
    ...withCreds,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`API ${res.status} en ${pathname}`);
  return (await res.json()) as T;
}

/** PATCH tipado contra la API. */
export async function apiPatch<T>(pathname: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${pathname}`, {
    ...withCreds,
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`API ${res.status} en ${pathname}`);
  return (await res.json()) as T;
}
