import { Navigate, Outlet } from 'react-router-dom';
import { Loader } from '../components/index.ts';
import { sessionRole, useSession, type Role } from '../lib/auth-client.ts';

/** Layout route: exige sesión y uno de los roles indicados, si no redirige. */
export function RequireRole({ roles }: { roles: Role[] }) {
  const { data: session, isPending } = useSession();

  if (isPending) return <Loader label="Verificando sesión…" />;
  if (!session) return <Navigate to="/ingreso" replace />;
  if (!roles.includes(sessionRole(session))) return <Navigate to="/" replace />;

  return <Outlet />;
}
