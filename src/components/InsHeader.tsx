import { IconBook2, IconBrandGithub, IconBug } from '@tabler/icons-react';
import { DashBreadcrumb } from './Breadcrumb';
import { Logo } from './Logo';
import { LangSelector } from './lang';
import { useTranslation } from 'react-i18next';
import { Link } from '@arco-design/web-react';

export const Header = () => {
  const { t } = useTranslation('header');

  return (
    <header className="px-4 py-2 bg-white border-b border-neutral-600/20 overflow-hidden flex items-center gap-4 flex-shrink-0 flex-grow-0 basis-auto">
      <Logo className="size-8" />
      <DashBreadcrumb />
      <div className="ml-auto flex items-center gap-3">
        <Link
          href={'https://docs.meilisearch.com'}
          target={'_blank'}
          className={'!inline-flex items-center !no-underline'}
          icon={<IconBook2 size={'1.5em'} />}
        >
          {t('meilisearch_docs')}
        </Link>
        <Link
          href={'https://github.com/riccox/meilisearch-ui/issues'}
          target={'_blank'}
          className={'!inline-flex items-center !no-underline'}
          icon={<IconBug size={'1.5em'} />}
        >
          {t('issues')}
        </Link>
        <Link
          href={'https://github.com/riccox/meilisearch-ui'}
          target={'_blank'}
          className={'!inline-flex items-center !no-underline'}
          icon={<IconBrandGithub size={'1.5em'} />}
        >
          {t('open_source')}
        </Link>
        <LangSelector className="text-small font-semibold" />
      </div>
    </header>
  );
};
