import { useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { CtaButton, GoogleIcon, Icon, NoiseOverlay, PaperInput } from '../../components/index.ts';
import { cn } from '../../lib/cn.ts';
import { signIn, signUp, useSession } from '../../lib/auth-client.ts';

type Mode = 'login' | 'register';
type WantsRole = 'cliente' | 'vendedor';

function Divider() {
  return (
    <div className="my-1 flex items-center gap-4">
      <div className="h-px flex-grow bg-brand-accent" />
      <span className="text-body-sm text-on-surface-variant">o</span>
      <div className="h-px flex-grow bg-brand-accent" />
    </div>
  );
}

function GoogleButton() {
  return (
    <button
      type="button"
      onClick={() => signIn.social({ provider: 'google', callbackURL: `${window.location.origin}/` })}
      className="flex w-full items-center justify-center gap-2 rounded-lg border border-brand-accent bg-surface-container-low py-4 text-title-lg text-on-surface transition-colors hover:bg-surface-variant active:translate-y-px"
    >
      <GoogleIcon /> Continuar con Google
    </button>
  );
}

function RoleSelector({ role, onChange }: { role: WantsRole; onChange: (r: WantsRole) => void }) {
  return (
    <div className="mt-2 flex flex-col gap-2">
      <span className="text-label-caps text-on-surface-variant">¿Cómo querés participar?</span>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onChange('cliente')}
          className={cn(
            'flex h-full items-center justify-center rounded-lg border border-brand-accent p-2 text-center text-body-sm transition-colors',
            role === 'cliente' && 'border-primary-container bg-primary-container text-on-primary-container',
          )}
        >
          Soy cliente
        </button>
        <button
          type="button"
          onClick={() => onChange('vendedor')}
          className={cn(
            'flex h-full flex-col items-center justify-center rounded-lg border border-brand-accent p-2 text-center text-body-sm transition-colors',
            role === 'vendedor' && 'border-primary-container bg-primary-container text-on-primary-container',
          )}
        >
          Quiero vender
          <span className="mt-1 text-center text-[10px] leading-tight text-on-surface-variant">
            Sujeto a aprobación
          </span>
        </button>
      </div>
    </div>
  );
}

export function AuthPage() {
  const [mode, setMode] = useState<Mode>('login');
  const [wantsRole, setWantsRole] = useState<WantsRole>('cliente');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const navigate = useNavigate();
  const { data: session, isPending: sessionPending } = useSession();

  // Ya autenticado: no tiene sentido mostrar el login de nuevo.
  if (!sessionPending && session) return <Navigate to="/" replace />;

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget);
    const email = String(form.get('email') ?? '');
    const password = String(form.get('password') ?? '');

    setPending(true);
    try {
      if (mode === 'login') {
        const { error: err } = await signIn.email({ email, password });
        if (err) {
          setError('Email o contraseña incorrectos.');
          return;
        }
      } else {
        // El rol siempre nace en "cliente" (Better Auth no permite setearlo desde
        // el cliente); la solicitud de vendedor se resuelve en el panel de admin
        // en Sprint 2. `name` se deriva del email: no pedimos "Nombre" en el registro.
        const { error: err } = await signUp.email({
          email,
          password,
          name: email.split('@')[0] || email,
        });
        if (err) {
          setError(err.message ?? 'No pudimos crear la cuenta.');
          return;
        }
      }
      navigate('/');
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="relative flex min-h-dvh flex-col overflow-x-hidden bg-surface text-on-surface">
      <NoiseOverlay />

      <header className="relative z-10 flex w-full items-center justify-center py-10">
        <Link to="/" className="font-display text-headline-md text-primary">
          La Ecoferia
        </Link>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-[500px] flex-grow items-center justify-center px-5 pb-10">
        <div className="relative w-full overflow-hidden rounded-xl border border-brand-accent bg-surface-container-lowest shadow-sm">
          <div className="flex border-b border-brand-accent">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError(null);
              }}
              className={cn(
                'flex-1 border-b-2 py-4 text-center text-title-lg transition-colors',
                mode === 'login'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-on-surface-variant',
              )}
            >
              Ingresar
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setError(null);
              }}
              className={cn(
                'flex-1 border-b-2 py-4 text-center text-title-lg transition-colors',
                mode === 'register'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-on-surface-variant',
              )}
            >
              Crear cuenta
            </button>
          </div>

          <form onSubmit={onSubmit} className="flex flex-col gap-6 p-6">
            <PaperInput
              label="Correo electrónico"
              name="email"
              type="email"
              placeholder="tu@correo.com"
              required
            />

            <div>
              <PaperInput
                label="Contraseña"
                name="password"
                type="password"
                placeholder={mode === 'login' ? '••••••••' : 'Mín. 8 caracteres'}
                minLength={mode === 'register' ? 8 : undefined}
                required
              />
              {mode === 'login' && (
                <a
                  href="#"
                  className="mt-1 flex justify-end text-body-sm text-on-surface-variant transition-colors hover:text-primary"
                >
                  Olvidé mi contraseña
                </a>
              )}
            </div>

            {mode === 'register' && <RoleSelector role={wantsRole} onChange={setWantsRole} />}

            {error && (
              <p className="flex items-center gap-2 text-body-sm text-error">
                <Icon name="error" className="text-base" /> {error}
              </p>
            )}

            <CtaButton
              type="submit"
              variant={mode === 'login' ? 'tertiary' : 'primary'}
              disabled={pending}
              className="w-full shadow-sm active:translate-y-px"
            >
              {pending ? 'Un momento…' : mode === 'login' ? 'Ingresar' : 'Crear cuenta'}
            </CtaButton>

            <Divider />

            <GoogleButton />
          </form>
        </div>
      </main>
    </div>
  );
}
