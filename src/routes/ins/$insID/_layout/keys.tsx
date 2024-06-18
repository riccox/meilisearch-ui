import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/ins/$insID/_layout/keys')({
  component: () => <div>Hello /ins/$insID/_layout/keys!</div>,
});
