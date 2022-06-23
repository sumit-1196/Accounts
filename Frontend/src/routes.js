import { Navigate, useRoutes } from 'react-router-dom';
import DashboardLayout from '../src/components/dashboard';
import LogoOnlyLayout from '../src/components/dashboard/LogoOnlyLayout';
import Vendor from './pages/Vendor';
import Customer from './pages/Customer';
import EntryBook from './pages/Entry';
import NotFound from './pages/Page404';
import DashboardApp from './pages/DashboardApp';

export default function Router() {
  return useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { path: 'app', element: <DashboardApp /> },
        { path: 'vendor', element: <Vendor /> },
        { path: 'customer', element: <Customer /> },
        { path: 'entry-book', element: <EntryBook /> }
      ],
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: '/', element: <Navigate to="/dashboard/app" /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
