import { createBrowserRouter } from 'react-router-dom';
import { RootLayout } from './RootLayout.tsx';
import { RequireRole } from './RequireRole.tsx';
import { PanelLayout } from './PanelLayout.tsx';
import { HomePage } from '../features/home/HomePage.tsx';
import { BrandsDirectoryPage } from '../features/brands/BrandsDirectoryPage.tsx';
import { BrandProfilePage } from '../features/brands/BrandProfilePage.tsx';
import { ShopPage } from '../features/catalog/ShopPage.tsx';
import { ProductDetailPage } from '../features/catalog/ProductDetailPage.tsx';
import { CartPage } from '../features/cart/CartPage.tsx';
import { AuthPage } from '../features/auth/AuthPage.tsx';
import { MiCuentaPage } from '../features/account/MiCuentaPage.tsx';
import { AdminDashboardPage } from '../features/admin/AdminDashboardPage.tsx';
import { AdminSellersPage } from '../features/admin/AdminSellersPage.tsx';
import { AdminOrdersPage } from '../features/admin/AdminOrdersPage.tsx';
import { SellerDashboardPage } from '../features/seller/SellerDashboardPage.tsx';
import { SellerProductsPage } from '../features/seller/SellerProductsPage.tsx';
import { SellerOrdersPage } from '../features/seller/SellerOrdersPage.tsx';
import { PanelComingSoon } from '../features/panel/PanelComingSoon.tsx';
import { AgendaPage } from '../features/agenda/AgendaPage.tsx';
import { BlogListPage } from '../features/blog/BlogListPage.tsx';
import { BlogPostDetailPage } from '../features/blog/BlogPostDetailPage.tsx';
import { NotFoundPage } from '../features/misc/Placeholders.tsx';
import { UiPlayground } from '../features/dev/UiPlayground.tsx';

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/marcas', element: <BrandsDirectoryPage /> },
      { path: '/marcas/:slug', element: <BrandProfilePage /> },
      { path: '/tienda', element: <ShopPage /> },
      { path: '/producto/:slug', element: <ProductDetailPage /> },
      { path: '/carrito', element: <CartPage /> },
      { path: '/mi-cuenta', element: <MiCuentaPage /> },
      { path: '/agenda', element: <AgendaPage /> },
      { path: '/blog', element: <BlogListPage /> },
      { path: '/blog/:slug', element: <BlogPostDetailPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },

  // Shell suprimido (sin TopAppBar/BottomNav): pantalla transaccional a pantalla completa.
  { path: '/ingreso', element: <AuthPage /> },

  // Panel de administrador (layout propio con sidebar).
  {
    element: <RequireRole roles={['admin']} />,
    children: [
      {
        element: <PanelLayout variant="admin" />,
        children: [
          { path: '/admin', element: <AdminDashboardPage /> },
          { path: '/admin/vendedores', element: <AdminSellersPage /> },
          { path: '/admin/marcas', element: <PanelComingSoon title="Directorio de marcas" icon="storefront" /> },
          { path: '/admin/pedidos', element: <AdminOrdersPage /> },
        ],
      },
    ],
  },

  // Panel de vendedor (admin también puede entrar).
  {
    element: <RequireRole roles={['admin', 'vendedor']} />,
    children: [
      {
        element: <PanelLayout variant="vendedor" />,
        children: [
          { path: '/vendedor', element: <SellerDashboardPage /> },
          { path: '/vendedor/productos', element: <SellerProductsPage /> },
          { path: '/vendedor/pedidos', element: <SellerOrdersPage /> },
          { path: '/vendedor/blog', element: <PanelComingSoon title="Diario de marca" icon="article" /> },
        ],
      },
    ],
  },

  { path: '/dev/ui', element: <UiPlayground /> },
]);
