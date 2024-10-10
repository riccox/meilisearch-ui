import { createFileRoute } from '@tanstack/react-router';
import { IndexConfigEditor } from '@/components/indexConfigEditor';
import { Loader } from '@/components/loader';
import { DangerZone } from '@/components/Settings/dangerZone';

const Page = () => {
  return (
    <div className="grid grid-cols-6 h-full overflow-scroll">
      <main className="p-4 laptop:col-start-2 laptop:-col-end-2 col-start-1 -col-end-1 flex flex-col gap-4">
        <div className="flex flex-col gap-4 px-1">
          <IndexConfigEditor />
          <DangerZone afterMutation={() => window.location.reload()} />
        </div>
      </main>
    </div>
  );
};

export const Route = createFileRoute('/ins/$insID/_layout/index/$indexUID/_layout/setting')({
  component: Page,
  pendingComponent: Loader,
});
