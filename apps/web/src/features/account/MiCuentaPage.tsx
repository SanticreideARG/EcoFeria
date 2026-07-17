import { useEffect, useState, type FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { UpdateProfileInput } from '@ecoferia/shared';
import {
  CtaButton,
  ErrorState,
  Icon,
  Loader,
  PaperInput,
  PaperTextarea,
} from '../../components/index.ts';
import { signOut, useSession } from '../../lib/auth-client.ts';
import { useProfile, useUpdateProfile } from '../../lib/queries.ts';
import { AccountTabs } from './AccountTabs.tsx';

const ROLE_LABEL: Record<string, string> = {
  admin: 'Administrador',
  vendedor: 'Vendedor',
  cliente: 'Cliente',
};

export function MiCuentaPage() {
  const { data: session, isPending: sessionPending } = useSession();
  const { data: profile, isLoading, isError } = useProfile(Boolean(session));
  const update = useUpdateProfile();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  // Hidrata el formulario cuando llega el perfil.
  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setPhone(profile.phone ?? '');
      setAddress(profile.address ?? '');
    }
  }, [profile]);

  if (!sessionPending && !session) return <Navigate to="/ingreso" replace />;
  if (sessionPending || isLoading) return <Loader label="Cargando tu cuenta…" />;
  if (isError || !profile) return <ErrorState message="No pudimos cargar tu cuenta." />;

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSaved(false);
    const parsed = UpdateProfileInput.safeParse({ name, phone, address });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Revisá los datos.');
      return;
    }
    update.mutate(parsed.data, {
      onSuccess: () => setSaved(true),
      onError: () => setError('No pudimos guardar los cambios. Reintentá.'),
    });
  };

  return (
    <div className="mx-auto max-w-[640px] px-5 py-6">
      <header className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-display-lg-mobile text-primary">Mi cuenta</h1>
          <p className="text-body-md text-on-surface-variant">
            {profile.email} ·{' '}
            <span className="text-secondary">{ROLE_LABEL[profile.role] ?? profile.role}</span>
          </p>
        </div>
        <button
          type="button"
          onClick={async () => {
            await signOut();
            navigate('/');
          }}
          className="flex flex-shrink-0 items-center gap-1.5 rounded-full border border-outline-variant px-4 py-2 text-body-sm text-on-surface transition-colors hover:bg-surface-container active:scale-95"
        >
          <Icon name="logout" className="text-base" /> Salir
        </button>
      </header>

      <AccountTabs />

      <form onSubmit={onSubmit} className="space-y-5 rounded-xl bg-surface-container-lowest p-6 paper-border">
        <PaperInput
          label="Nombre completo"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tu nombre y apellido"
          required
        />
        <PaperInput
          label="Teléfono"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Opcional"
          type="tel"
        />
        <PaperTextarea
          label="Dirección"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Calle, número, localidad, provincia"
          rows={3}
        />

        {error && (
          <p className="flex items-center gap-2 text-body-sm text-error">
            <Icon name="error" className="text-base" /> {error}
          </p>
        )}
        {saved && !error && (
          <p className="flex items-center gap-2 text-body-sm text-primary">
            <Icon name="mark_email_read" className="text-base" /> Cambios guardados.
          </p>
        )}

        <CtaButton
          type="submit"
          variant="primary"
          className="w-full"
          disabled={update.isPending}
        >
          {update.isPending ? 'Guardando…' : 'Guardar cambios'}
        </CtaButton>
      </form>
    </div>
  );
}
