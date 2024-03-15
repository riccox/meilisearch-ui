import { useMatchRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { Breadcrumbs, BreadcrumbItem } from '@nextui-org/react';

export const DashBreadcrumb = () => {
  const matchRoute = useMatchRoute();
  const { t } = useTranslation();

  const insRoute = matchRoute({ to: '/ins/$insID', fuzzy: true }) as unknown as { insID: string };
  const indexRoute = matchRoute({ to: '/ins/$insID/index/$indexUID', fuzzy: true }) as unknown as { indexUID: string };

  return (
    <Breadcrumbs color="primary" variant="light">
      <BreadcrumbItem href="/">🏠</BreadcrumbItem>
      {insRoute && (
        <BreadcrumbItem href={`/ins/${insRoute.insID}`}>{`${t('common:instance')} #${insRoute.insID}`}</BreadcrumbItem>
      )}
      {indexRoute && (
        <BreadcrumbItem
          href={`/ins/${insRoute.insID}/index/${indexRoute.indexUID}`}
        >{`${t('common:indexes')}: ${indexRoute.indexUID}`}</BreadcrumbItem>
      )}
    </Breadcrumbs>
  );
};
