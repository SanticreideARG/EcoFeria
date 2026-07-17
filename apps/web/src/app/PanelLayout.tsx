import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { cn } from '../lib/cn.ts';
import { Icon } from '../components/index.ts';
import { signOut, useSession } from '../lib/auth-client.ts';

type Variant = 'admin' | 'vendedor';
type NavItem = { to: string; label: string; icon: string; end?: boolean };

const NAV: Record<Variant, NavItem[]> = {
  admin: [
    { to: '/admin', label: 'Panel', icon: 'dashboard', end: true },
    { to: '/admin/vendedores', label: 'Vendedores', icon: 'group' },
    { to: '/admin/marcas', label: 'Marcas', icon: 'storefront' },
    { to: '/admin/pedidos', label: 'Pedidos', icon: 'local_shipping' },
  ],
  vendedor: [
    { to: '/vendedor', label: 'Inicio', icon: 'dashboard', end: true },
    { to: '/vendedor/productos', label: 'Productos', icon: 'inventory_2' },
    { to: '/vendedor/pedidos', label: 'Pedidos', icon: 'local_shipping' },
    { to: '/vendedor/blog', label: 'Diario', icon: 'article' },
    { to: '/vendedor/mensajes', label: 'Mensajes', icon: 'chat_bubble' },
  ],
};

const STYLE: Record<
  Variant,
  { title: string; accent: string; activeDesktop: string; activeMobile: string }
> = {
  admin: {
    title: 'Panel de Administrador',
    accent: 'text-secondary',
    activeDesktop: 'border-l-4 border-secondary bg-secondary-fixed/30 text-secondary',
    activeMobile: 'bg-secondary text-on-secondary',
  },
  vendedor: {
    title: 'Panel de Vendedor',
    accent: 'text-primary',
    activeDesktop: 'border-l-4 border-primary bg-primary-fixed/40 text-primary',
    activeMobile: 'bg-primary text-on-primary',
  },
};

export function PanelLayout({ variant }: { variant: Variant }) {
  const { data: session } = useSession();
  const navigate = useNavigate();
  const items = NAV[variant];
  const s = STYLE[variant];
  const user = session?.user as { name?: string; email?: string } | undefined;

  const logout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-dvh bg-background">
      {/* Sidebar desktop */}
      <nav className="fixed left-0 top-0 z-40 hidden h-full w-64 flex-col border-r border-outline-variant bg-surface-container py-8 lg:flex">
        <div className="mb-8 px-6">
          <NavLink to="/" className="font-display text-headline-md text-primary">
            La Ecoferia
          </NavLink>
          <p className={cn('mt-1 text-label-caps uppercase', s.accent)}>{s.title}</p>
        </div>
        <ul className="flex flex-grow flex-col gap-1">
          {items.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 border-l-4 border-transparent px-6 py-3 text-title-lg transition-colors',
                    isActive
                      ? s.activeDesktop
                      : 'text-on-surface-variant hover:bg-surface-container-high',
                  )
                }
              >
                <Icon name={item.icon} /> {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="mt-auto flex flex-col gap-1 px-3">
          <NavLink
            to="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-body-md text-on-surface-variant hover:bg-surface-container-high"
          >
            <Icon name="arrow_back" className="text-lg" /> Volver al sitio
          </NavLink>
          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-body-md text-on-surface-variant hover:bg-surface-container-high"
          >
            <Icon name="logout" className="text-lg" /> Cerrar sesión
          </button>
        </div>
      </nav>

      {/* Header + nav mobile */}
      <header className="sticky top-0 z-30 border-b border-outline-variant bg-surface/92 backdrop-blur-md lg:hidden">
        <div className="flex items-center justify-between px-5 py-3">
          <div>
            <NavLink to="/" className="font-display text-title-lg text-primary">
              La Ecoferia
            </NavLink>
            <p className={cn('text-label-caps uppercase', s.accent)}>{s.title}</p>
          </div>
          <button
            type="button"
            onClick={logout}
            aria-label="Cerrar sesión"
            className="grid h-10 w-10 place-items-center rounded-full text-on-surface-variant hover:bg-surface-container-high"
          >
            <Icon name="logout" />
          </button>
        </div>
        <nav className="no-scrollbar flex gap-2 overflow-x-auto px-5 pb-3">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-label-caps transition-colors',
                  isActive
                    ? s.activeMobile
                    : 'border border-outline-variant bg-surface-container text-on-surface-variant',
                )
              }
            >
              <Icon name={item.icon} className="text-base" /> {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-[1280px] px-5 py-6 lg:ml-64 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
