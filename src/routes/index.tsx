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
import { EmptyArea } from '../components/EmptyArea';
import { UploadDoc } from '../pages/index/upload';
import { MultiIndexSearch } from '../pages/index/multi-search';
import { useTranslation } from 'react-i18next';

export const AppRoutes = () => {
  const { t } = useTranslation();
  return (
    <Suspense fallback={<Loader size="md" />}>
      <Routes>
        <Route index element={<Dashboard />} />
        <Route path="instance">
          <Route path=":insId">
            <Route path="index" element={<IndexesLayout />}>
              <Route index element={<EmptyArea text={t('document:empty_area_tip')} />} />
              <Route path="create" element={<CreateIndex />} />
              <Route path=":indexId">
                <Route index element={<Documents />} />
                <Route path="settings" element={<Settings />} />
                <Route path="upload" element={<UploadDoc />} />
              </Route>
            </Route>
            <Route path="tasks" element={<Tasks />} />
            <Route path="keys" element={<Keys />} />
            <Route path="multi-search" element={<MultiIndexSearch />} />
          </Route>
        </Route>
        <Route path="warning" element={<Warning />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};
