import { NavLink } from 'react-router-dom';
import { cn } from '../../lib/cn.ts';

const TABS = [
  { to: '/mi-cuenta', label: 'Perfil', end: true },
  { to: '/mi-cuenta/pedidos', label: 'Mis Pedidos' },
  { to: '/mi-cuenta/favoritos', label: 'Favoritos' },
];

/** Navegación por pestañas entre las secciones del panel de usuario (perfil/pedidos/favoritos). */
export function AccountTabs() {
  return (
    <div role="tablist" className="no-scrollbar mb-6 flex overflow-x-auto border-b border-outline-variant">
      {TABS.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.end}
          role="tab"
          className={({ isActive }) =>
            cn(
              'flex-1 whitespace-nowrap px-4 py-3 text-center text-title-lg transition-colors',
              isActive ? 'border-b-2 border-primary text-primary' : 'text-on-surface-variant hover:text-primary',
            )
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </div>
  );
}
