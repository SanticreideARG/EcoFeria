import { createBrowserRouter } from 'react-router-dom';
import { HomePage } from '../features/home/HomePage.tsx';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
]);
