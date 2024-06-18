import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/ins/$insID/_layout/tasks')({
  component: () => <div>Hello /ins/$insID/_layout/tasks!</div>,
});
