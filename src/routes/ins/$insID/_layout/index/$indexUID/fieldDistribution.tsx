import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/ins/$insID/_layout/index/$indexUID/fieldDistribution')({
  component: () => <div>Hello /ins/$insID/_layout/index/$indexUID/fieldDistribution!</div>,
});
