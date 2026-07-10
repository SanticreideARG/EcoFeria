import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { CtaButton, GoogleIcon, Icon, NoiseOverlay, PaperInput } from '../../components/index.ts';
import { cn } from '../../lib/cn.ts';

type Mode = 'login' | 'register';
type Role = 'cliente' | 'vendedor';

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
      className="flex w-full items-center justify-center gap-2 rounded-lg border border-brand-accent bg-surface-container-low py-4 text-title-lg text-on-surface transition-colors hover:bg-surface-variant active:translate-y-px"
    >
      <GoogleIcon /> Continuar con Google
    </button>
  );
}

function RoleSelector({ role, onChange }: { role: Role; onChange: (r: Role) => void }) {
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
  const [role, setRole] = useState<Role>('cliente');
  const [notice, setNotice] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    // El wiring real (Better Auth + Google) llega en M5.
    setNotice(true);
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
              onClick={() => setMode('login')}
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
              onClick={() => setMode('register')}
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

            {mode === 'register' && <RoleSelector role={role} onChange={setRole} />}

            <CtaButton
              type="submit"
              variant={mode === 'login' ? 'tertiary' : 'primary'}
              className="w-full shadow-sm active:translate-y-px"
            >
              {mode === 'login' ? 'Ingresar' : 'Crear cuenta'}
            </CtaButton>

            <Divider />

            <GoogleButton />
          </form>
        </div>
      </main>

      {notice && (
        <div className="relative z-10 mx-auto mb-8 w-full max-w-[500px] px-5">
          <p className="flex items-center gap-2 rounded-lg bg-tertiary-fixed/50 p-3 text-body-sm text-on-tertiary-fixed">
            <Icon name="info" className="text-lg" />
            La autenticación real (email y Google) se habilita en el próximo sprint.
          </p>
        </div>
      )}
    </div>
  );
}
