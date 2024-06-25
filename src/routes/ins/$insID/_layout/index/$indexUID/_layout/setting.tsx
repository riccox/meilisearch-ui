import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/ins/$insID/_layout/index/$indexUID/_layout/setting')({
  component: () => <div>Hello /ins/$insID/_layout/index/$indexUID/setting!</div>,
});
