import { createBrowserRouter } from 'react-router';
import { Layout } from './Layout';
import { AccountPage } from '../features/auth/AccountPage';
import { CategoriesPage } from '../features/categories/CategoriesPage';
import { CategoryEntriesPage } from '../features/transactions/CategoryEntriesPage';
import { HomePage } from '../features/transactions/HomePage';
import { NotFoundPage } from './NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'category/:categoryId', element: <CategoryEntriesPage /> },
      { path: 'categories', element: <CategoriesPage /> },
      { path: 'account', element: <AccountPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
