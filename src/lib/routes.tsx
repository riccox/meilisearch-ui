import NotFound from '@/components/404';
import Dashboard from '@/routes';
import IndexesLayout from '@/pages/index/layout';
import { Documents } from '@/pages/index/documents';
import { Suspense } from 'react';
import { Loader } from '@/components/Loader';
import { CreateIndex } from '@/pages/index/create';
import Tasks from '@/pages/task';
import Keys from '@/pages/key';
import Settings from '@/pages/index/setting';
import Warning from '@/pages/warning';
import { EmptyArea } from '../components/EmptyArea';
import { UploadDoc } from '../pages/index/upload';
import { MultiIndexSearch } from '../pages/index/multi-search';
import { useTranslation } from 'react-i18next';
import { Lazy } from '../components/lazy';

export const AppRoutes = () => {
  const { t } = useTranslation();
  return (
    <Suspense
      fallback={
        <div className={`flex full-page justify-center items-center`}>
          <Loader size={'xl'} />
        </div>
      }
    >
      <Routes>
        <Route index element={<Dashboard />} />
        <Route path="ins">
          <Route path=":insID">
            <Route path="index" element={<IndexesLayout />}>
              <Route index element={<EmptyArea text={t('document:empty_area_tip')} />} />
              <Route path="create" element={<CreateIndex />} />
              <Route path=":indexId">
                <Route
                  index
                  element={
                    <Lazy className={`h-full`}>
                      <Documents />
                    </Lazy>
                  }
                />
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
