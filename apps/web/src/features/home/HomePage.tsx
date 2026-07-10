import { useQuery } from '@tanstack/react-query';
import { apiGet } from '../../lib/api.ts';

type Health = { ok: boolean; service: string };

export function HomePage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['health'],
    queryFn: () => apiGet<Health>('/health'),
  });

  const apiStatus = isLoading
    ? { label: 'conectando…', color: '#7a5500' }
    : isError || !data?.ok
      ? { label: 'sin conexión', color: '#ba1a1a' }
      : { label: 'conectada', color: '#506049' };

  return (
    <main
      style={{
        minHeight: '100dvh',
        display: 'grid',
        placeItems: 'center',
        padding: '24px',
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: 420 }}>
        <p
          style={{
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontSize: 12,
            fontWeight: 700,
            color: '#8e4d31',
            margin: 0,
          }}
        >
          Alto Valle · Patagonia
        </p>
        <h1
          style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: 40,
            fontWeight: 700,
            color: '#506049',
            margin: '8px 0 4px',
          }}
        >
          La Ecoferia
        </h1>
        <p style={{ color: '#444841', margin: '0 0 24px' }}>Cultivando el mañana.</p>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            border: '1px solid #DCC7A1',
            borderRadius: 9999,
            padding: '6px 14px',
            background: '#f5f3ee',
            fontSize: 14,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: 9999,
              background: apiStatus.color,
            }}
          />
          API {apiStatus.label}
        </div>
      </div>
    </main>
  );
}
