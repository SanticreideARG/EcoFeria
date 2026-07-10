import { createBrowserRouter } from 'react-router-dom';
import { RootLayout } from './RootLayout.tsx';
import { HomePage } from '../features/home/HomePage.tsx';
import { BrandsDirectoryPage } from '../features/brands/BrandsDirectoryPage.tsx';
import { BrandProfilePage } from '../features/brands/BrandProfilePage.tsx';
import { ShopPage } from '../features/catalog/ShopPage.tsx';
import { ProductDetailPage } from '../features/catalog/ProductDetailPage.tsx';
import { CartPage } from '../features/cart/CartPage.tsx';
import { AuthPage } from '../features/auth/AuthPage.tsx';
import { ComingSoon, NotFoundPage } from '../features/misc/Placeholders.tsx';
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
      { path: '/ingreso', element: <AuthPage /> },
      { path: '/agenda', element: <ComingSoon title="Agenda Cultural" icon="event" /> },
      { path: '/blog', element: <ComingSoon title="Blog" icon="article" /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  { path: '/dev/ui', element: <UiPlayground /> },
]);
