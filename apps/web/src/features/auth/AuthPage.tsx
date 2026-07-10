import { useState, type FormEvent } from 'react';
import { CtaButton, Icon, PaperInput, Tabs } from '../../components/index.ts';

export function AuthPage() {
  const [mode, setMode] = useState('login');
  const [notice, setNotice] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    // El wiring real (Better Auth + Google) llega en M5.
    setNotice(true);
  };

  return (
    <div className="mx-auto max-w-[440px] px-5 py-8">
      <div className="mb-6 text-center">
        <h1 className="font-display text-display-lg-mobile text-primary">La Ecoferia</h1>
        <p className="text-body-md text-on-surface-variant">
          {mode === 'login' ? 'Bienvenido de vuelta' : 'Sumate a la comunidad'}
        </p>
      </div>

      <Tabs
        value={mode}
        onChange={(m) => {
          setMode(m);
          setNotice(false);
        }}
        tabs={[
          { id: 'login', label: 'Ingresar' },
          { id: 'register', label: 'Crear cuenta' },
        ]}
        className="mb-6"
      />

      <form onSubmit={onSubmit} className="space-y-4">
        {mode === 'register' && <PaperInput label="Nombre" name="name" required />}
        <PaperInput label="Correo electrónico" name="email" type="email" required />
        <PaperInput label="Contraseña" name="password" type="password" required />

        <CtaButton type="submit" variant="primary" className="w-full">
          {mode === 'login' ? 'Ingresar' : 'Crear cuenta'}
        </CtaButton>
      </form>

      <div className="my-5 flex items-center gap-3 text-body-sm text-on-surface-variant">
        <span className="h-px flex-1 bg-outline-variant" /> o <span className="h-px flex-1 bg-outline-variant" />
      </div>

      <button
        type="button"
        onClick={() => setNotice(true)}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-outline-variant bg-surface-container-lowest py-2.5 text-title-lg text-on-surface transition-colors hover:bg-surface-container active:scale-95"
      >
        <Icon name="account_circle" className="text-lg text-secondary" /> Continuar con Google
      </button>

      {notice && (
        <p className="mt-5 rounded-lg bg-tertiary-fixed/50 p-3 text-center text-body-sm text-on-tertiary-fixed">
          La autenticación real (email y Google) se habilita en el próximo sprint.
        </p>
      )}
    </div>
  );
}
