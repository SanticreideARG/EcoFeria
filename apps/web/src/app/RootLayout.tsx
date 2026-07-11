import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { BottomNavBar, NoiseOverlay, TopAppBar } from '../components/index.ts';
import { selectCartCount, useCart } from '../stores/cart.ts';

/** Shell de la app: textura, top bar con carrito, contenido y nav inferior mobile. */
export function RootLayout() {
  const cartCount = useCart(selectCartCount);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <>
      <NoiseOverlay />
      <TopAppBar cartCount={cartCount} />
      <a
        href="#contenido-principal"
        className="fixed left-4 top-2 z-[70] -translate-y-20 rounded-lg bg-primary px-4 py-2 font-bold text-on-primary transition-transform focus:translate-y-0"
      >
        Saltar al contenido
      </a>
      <main id="contenido-principal" className="pb-24 md:pb-12">
        <Outlet />
      </main>
      <BottomNavBar />
    </>
  );
}
