import { Route, Routes } from 'react-router-dom';
import NotFound from '@/src/pages/404';
import Dashboard from '@/src/pages/dashboard';
import Indexes from '@/src/pages/index';
import { Documents } from '@/src/pages/index/documents';
import { Suspense } from 'react';
import { Loader } from '@/src/components/Loader';
import { CreateIndex } from '@/src/pages/index/create';
import Tasks from '@/src/pages/task';

export const AppRoutes = () => {
  return (
    <Suspense
      fallback={
        <div className={`flex full-page justify-center items-center`}>
          <Loader size={120} />
        </div>
      }
    >
      <Routes>
        <Route path="/">
          <Route index element={<Dashboard />} />
          <Route path="index" element={<Indexes />}>
            <Route index element={<Documents />} />
            <Route path="create" element={<CreateIndex />} />
          </Route>
        </Route>
        <Route path="tasks" element={<Tasks />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};
