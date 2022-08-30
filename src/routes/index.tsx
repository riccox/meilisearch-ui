import { Route, Routes } from 'react-router-dom';
import NotFound from '@/src/pages/404';
import Start from '@/src/pages/start';
import Dashboard from '@/src/pages/dashboard';

export const AppRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="start" element={<Start />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};
