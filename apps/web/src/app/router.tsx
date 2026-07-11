import { createBrowserRouter } from 'react-router-dom';
import { RootLayout } from './RootLayout.tsx';
import { RequireRole } from './RequireRole.tsx';
import { HomePage } from '../features/home/HomePage.tsx';
import { BrandsDirectoryPage } from '../features/brands/BrandsDirectoryPage.tsx';
import { BrandProfilePage } from '../features/brands/BrandProfilePage.tsx';
import { ShopPage } from '../features/catalog/ShopPage.tsx';
import { ProductDetailPage } from '../features/catalog/ProductDetailPage.tsx';
import { CartPage } from '../features/cart/CartPage.tsx';
import { AuthPage } from '../features/auth/AuthPage.tsx';
import { AdminPage } from '../features/admin/AdminPage.tsx';
import { SellerPage } from '../features/seller/SellerPage.tsx';
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
      { path: '/agenda', element: <AgendaPage /> },
      { path: '/blog', element: <BlogListPage /> },
      { path: '/blog/:slug', element: <BlogPostDetailPage /> },
      {
        element: <RequireRole roles={['admin']} />,
        children: [{ path: '/admin', element: <AdminPage /> }],
      },
      {
        element: <RequireRole roles={['admin', 'vendedor']} />,
        children: [{ path: '/vendedor', element: <SellerPage /> }],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  // Shell suprimido (sin TopAppBar/BottomNav): pantalla transaccional a pantalla completa.
  { path: '/ingreso', element: <AuthPage /> },
  { path: '/dev/ui', element: <UiPlayground /> },
]);
