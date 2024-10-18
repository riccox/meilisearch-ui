import { DocSearchPage } from '@/components/Document/search';
import { LoaderPage } from '@/components/loader';
import { useCurrentIndex } from '@/hooks/useCurrentIndex';
import { useMeiliClient } from '@/hooks/useMeiliClient';
import { createFileRoute } from '@tanstack/react-router';
import { useMemo } from 'react';

const Page = () => {
  const client = useMeiliClient();
  const currentIndex = useCurrentIndex(client);

  return useMemo(() => <DocSearchPage currentIndex={currentIndex.index} />, [currentIndex.index]);
};
export const Route = createFileRoute('/ins/$insID/_layout/index/$indexUID/_layout/documents/')({
  component: Page,
  pendingComponent: LoaderPage,
});
