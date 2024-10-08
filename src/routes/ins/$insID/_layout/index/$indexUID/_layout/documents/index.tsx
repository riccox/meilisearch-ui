import { LoaderPage } from '@/components/loader';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/ins/$insID/_layout/index/$indexUID/_layout/documents/')({
  component: () => <div>Hello /ins/$insID/_layout/index/$indexUID/documents!</div>,
  pendingComponent: LoaderPage,
});
