import { Route, Routes } from 'react-router-dom';
import NotFound from '@/src/pages/404';
import Dashboard from '@/src/pages/dashboard';
import IndexesLayout from '@/src/pages/index/layout';
import { Documents } from '@/src/pages/index/documents';
import { Suspense } from 'react';
import { Loader } from '@/src/components/Loader';
import { CreateIndex } from '@/src/pages/index/create';
import Tasks from '@/src/pages/task';
import Keys from '@/src/pages/key';
import Settings from '@/src/pages/index/setting';
import Warning from '@/src/pages/warning';

export const AppRoutes = () => {
  return (
    <Suspense
      fallback={
        <div className={`flex full-page justify-center items-center`}>
          <Loader size={'xl'} />
        </div>
      }
    >
      <Routes>
        <Route path="/">
          <Route index element={<Dashboard />} />
          <Route path="index" element={<IndexesLayout />}>
            <Route index element={<Documents />} />
            <Route path="create" element={<CreateIndex />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>
        <Route path="tasks" element={<Tasks />} />
        <Route path="keys" element={<Keys />} />
        <Route path="warning" element={<Warning />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};
