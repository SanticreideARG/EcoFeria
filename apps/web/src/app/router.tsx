import { createBrowserRouter } from 'react-router-dom';
import { HomePage } from '../features/home/HomePage.tsx';
import { UiPlayground } from '../features/dev/UiPlayground.tsx';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/dev/ui',
    element: <UiPlayground />,
  },
]);
