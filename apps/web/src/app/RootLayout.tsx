import { Outlet } from 'react-router-dom';
import { BottomNavBar, NoiseOverlay, TopAppBar } from '../components/index.ts';
import { selectCartCount, useCart } from '../stores/cart.ts';

/** Shell de la app: textura, top bar con carrito, contenido y nav inferior mobile. */
export function RootLayout() {
  const cartCount = useCart(selectCartCount);

  return (
    <>
      <NoiseOverlay />
      <TopAppBar cartCount={cartCount} />
      <main className="pb-24 md:pb-12">
        <Outlet />
      </main>
      <BottomNavBar />
    </>
  );
}
