import { Outlet, createFileRoute } from '@tanstack/react-router';
import { Header } from '@/components/InsHeader';
import { LoaderPage } from '@/components/loader';

function InsLayout() {
  return (
    <div className="full-page">
      <Header />
      <Outlet />
    </div>
  );
}

export const Route = createFileRoute('/ins/$insID/_layout')({
  component: InsLayout,
  pendingComponent: LoaderPage,
});
