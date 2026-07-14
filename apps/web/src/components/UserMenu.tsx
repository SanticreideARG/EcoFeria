import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../lib/cn.ts';
import { sessionRole, signOut, useSession } from '../lib/auth-client.ts';
import { Icon } from './Icon.tsx';

function MenuLink({ to, icon, children }: { to: string; icon: string; children: ReactNode }) {
  return (
    <Link
      to={to}
      role="menuitem"
      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-body-md text-on-surface transition-colors hover:bg-surface-container"
    >
      <Icon name={icon} className="text-lg text-primary" /> {children}
    </Link>
  );
}

/** Menú de usuario: avatar + dropdown con perfil, panel según rol y cerrar sesión.
 *  Si no hay sesión, muestra el acceso a /ingreso. */
export function UserMenu() {
  const { data: session, isPending } = useSession();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // Placeholder mientras resuelve la sesión: reserva el espacio, evita saltos.
  if (isPending) return <div className="h-11 w-11" aria-hidden />;

  if (!session) {
    return (
      <Link
        to="/ingreso"
        aria-label="Ingresar"
        className="grid h-11 w-11 place-items-center rounded-full text-primary transition-colors hover:bg-surface-container-high active:scale-95"
      >
        <Icon name="person" />
      </Link>
    );
  }

  const user = session.user as { name?: string; email?: string };
  const role = sessionRole(session);
  const displayName = user.name || user.email || 'Mi cuenta';
  const initial = (user.name?.[0] ?? user.email?.[0] ?? '?').toUpperCase();

  const onLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Menú de usuario"
        className={cn(
          'grid h-11 w-11 place-items-center rounded-full bg-primary-container font-display text-title-lg font-bold text-on-primary-container transition-transform active:scale-95',
          open && 'ring-2 ring-primary ring-offset-2 ring-offset-surface',
        )}
      >
        {initial}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-60 overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest shadow-xl"
        >
          <div className="border-b border-outline-variant px-4 py-3">
            <p className="truncate text-title-lg text-on-surface">{displayName}</p>
            {user.email && (
              <p className="truncate text-body-sm text-on-surface-variant">{user.email}</p>
            )}
          </div>
          <div className="p-1.5">
            <MenuLink to="/mi-cuenta" icon="person">
              Mi cuenta
            </MenuLink>
            {role === 'admin' && (
              <MenuLink to="/admin" icon="shield_person">
                Panel de admin
              </MenuLink>
            )}
            {role === 'vendedor' && (
              <MenuLink to="/vendedor" icon="storefront">
                Panel de vendedor
              </MenuLink>
            )}
            <div className="my-1 h-px bg-outline-variant" />
            <button
              type="button"
              role="menuitem"
              onClick={onLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-body-md text-on-surface transition-colors hover:bg-surface-container"
            >
              <Icon name="logout" className="text-lg text-secondary" /> Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
