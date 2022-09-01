import { Route, Routes } from 'react-router-dom';
import NotFound from '@/src/pages/404';
import Start from '@/src/pages/start';
import Dashboard from '@/src/pages/dashboard';
import Indexes from '@/src/pages/index';
import { Documents } from '@/src/pages/index/documents';

export const AppRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/">
          <Route index element={<Dashboard />} />
          <Route path="index" element={<Indexes />}>
            <Route index element={<Documents />} />
          </Route>
        </Route>
        <Route path="start" element={<Start />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};
