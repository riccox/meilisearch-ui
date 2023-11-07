import { ActionIcon, HoverCard } from '@mantine/core';
import {
  IconArrowsLeftRight,
  IconBook2,
  IconBooks,
  IconBrandGithub,
  IconBug,
  IconDeviceFloppy,
  IconHomeBolt,
  IconKey,
  IconListCheck,
  IconSettings,
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useClipboard } from '@mantine/hooks';
import { MeiliSearch, Version } from 'meilisearch';
import { useQuery } from '@tanstack/react-query';
import { useInstanceStats } from '@/src/hooks/useInstanceStats';
import _ from 'lodash';
import { modals } from '@mantine/modals';
import { getTimeText, showTaskSubmitNotification } from '@/src/utils/text';
import { validateKeysRouteAvailable } from '@/src/utils/conn';
import { useNavigatePreCheck } from '@/src/hooks/useRoutePreCheck';
import { toast } from 'sonner';
import { useCurrentInstance } from '@/src/hooks/useCurrentInstance';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { LangSelector } from '../lang';

interface Props {
  className?: string;
  client: MeiliSearch;
}

export const Header: FC<Props> = ({ client, className }) => {
  const { t } = useTranslation('header');
  const currentInstance = useCurrentInstance();
  const navigate = useNavigatePreCheck(([to], opt) => {
    if (typeof to === 'string' && /\/keys$/.test(to)) {
      // check before keys page (no masterKey will cause error)
      return validateKeysRouteAvailable(opt?.currentInstance?.apiKey);
    }
    return null;
  });
  const clipboard = useClipboard({ timeout: 500 });

  const stats = useInstanceStats(client);
  const [version, setVersion] = useState<Version>();
  const [health, setHealth] = useState<boolean>(true);

  const queryVersion = useQuery({
    queryKey: ['version', currentInstance?.host],
    queryFn: async () => {
      return await client.getVersion();
    },
    refetchInterval: 120000,
  });

  const queryHealth = useQuery({
    queryKey: ['health', currentInstance?.host],
    queryFn: async () => {
      return (await client.health()).status === 'available';
    },
    refetchInterval: 30000,
  });

  useEffect(() => {
    if (queryVersion.isSuccess) {
      setVersion(queryVersion.data);
    }
    if (queryHealth.isSuccess) {
      setHealth(queryHealth.data);
    }
  }, [queryHealth.data, queryHealth.isSuccess, queryVersion.data, queryVersion.isSuccess]);

  const onClickHost = useCallback(() => {
    clipboard.copy(currentInstance?.host);
    toast.success('Server Host Copied ✍');
  }, [clipboard, currentInstance?.host]);

  const onClickDump = useCallback(() => {
    const modalId = 'createDumpModal';
    modals.open({
      modalId,
      title: t('instance:dump.dialog.title'),
      centered: true,
      children: (
        <div className="flex flex-col gap-6">
          <p>{t('instance:dump.dialog.tip', { name: currentInstance.name })}</p>
          <div className="flex gap-3">
            <button
              className="btn sm solid warn flex-1"
              onClick={() => {
                client.createDump().then((value) => {
                  showTaskSubmitNotification(value);
                });
                modals.close(modalId);
              }}
            >
              {t('confirm')}
            </button>
            <button
              className="btn sm solid bw flex-1"
              onClick={() => {
                modals.close(modalId);
              }}
            >
              {t('cancel')}
            </button>
          </div>
        </div>
      ),
    });
  }, [client, currentInstance.name, t]);

  return useMemo(
    () => (
      <div
        className={clsx(
          className,
          `bg-background-light  flex justify-between items-center p-2 rounded-md drop-shadow-xl z-20`
        )}
      >
        <button
          className="btn primary solid flex items-center gap-2 rounded-md"
          onClick={() => navigate(['/'], { currentInstance })}
        >
          <IconHomeBolt size={26} />
          <p>{t('home')}</p>
        </button>

        <p className={`text-2xl font-bold`}>{_.truncate(currentInstance?.name, { length: 16 })}</p>
        <p className={`text-2xl font-bold text-bw-800/50`}>#{currentInstance.id}</p>

        <span
          className={`!cursor-pointer hover:underline badge outline cornered lg success hidden 2xl:inline`}
          onClick={onClickHost}
        >
          {_.truncate(currentInstance?.host, { length: 40 })}
        </span>

        <p className={`font-bold hidden xl:inline`}>
          {t('updated_at')}: {getTimeText(stats?.lastUpdate)}
        </p>

        <span className={`badge outline cornered lg primary hidden xl:inline`}>
          {t('db_size', { size: _.ceil((stats?.databaseSize ?? 0) / 1048576, 2) })}
        </span>

        <span className={`badge light cornered lg ${health ? 'success' : 'warn'} hidden xl:inline`}>
          {t('status.label')}: {health ? t('status.available') : t('unknown')}
        </span>

        <LangSelector className="font-medium" />

        <HoverCard withinPortal shadow="lg" radius={'lg'} transitionProps={{ transition: 'fade' }}>
          <HoverCard.Target>
            <span className={`badge outline cornered lg primary hidden 2xl:inline`}>
              {t('meili_version')}: {version?.pkgVersion}
            </span>
          </HoverCard.Target>
          <HoverCard.Dropdown>
            Commit Date: {version?.commitDate} <br />
            Commit Sha: {version?.commitSha}
          </HoverCard.Dropdown>
        </HoverCard>

        <div className="dropdown bw">
          <ActionIcon color="primary" size="lg" radius="xl" variant="outline" tabIndex={0}>
            <IconSettings size={26} />
          </ActionIcon>
          <div className="menu bottom-left">
            <p className="subtitle">{t('instance')}</p>
            <Link
              to={`/instance/${currentInstance.id}/index`}
              className="item text-sm flex items-center gap-2 "
              tabIndex={-1}
            >
              <IconBooks size={14} />
              <p>{t('indexes')}</p>
            </Link>

            <div
              onClick={() => {
                navigate([`/instance/${currentInstance.id}/keys`], { currentInstance });
              }}
              className="item text-sm flex items-center gap-2 hover:underline"
              tabIndex={-1}
            >
              <IconKey size={14} />
              <p>{t('keys')}</p>
            </div>
            <Link
              to={`/instance/${currentInstance.id}/tasks`}
              className="item text-sm flex items-center gap-2"
              tabIndex={-1}
            >
              <IconListCheck size={14} />
              <p>{t('tasks')}</p>
            </Link>
            <div onClick={onClickDump} className="item text-sm flex items-center gap-2 hover:underline" tabIndex={-1}>
              <IconDeviceFloppy size={14} />
              <p>Dump</p>
            </div>
            <div className="is-divider" role="separator"></div>
            <p className="subtitle">{t('system')}</p>
            <Link to={'/'} className="item text-sm flex items-center gap-2 danger" tabIndex={-1}>
              <IconArrowsLeftRight size={14} />
              <p>{t('change_instance')}</p>
            </Link>
            <div className="is-divider" role="separator"></div>
            <p className="subtitle">{t('support')}</p>
            <Link
              to={'https://docs.meilisearch.com'}
              target={'_blank'}
              className="item text-sm flex items-center gap-2"
              tabIndex={-1}
            >
              <IconBook2 size={14} />
              <p>{t('meilisearch_docs')}</p>
            </Link>
            <Link
              to={'https://github.com/riccox/meilisearch-ui/issues'}
              target={'_blank'}
              className="item text-sm flex items-center gap-2"
              tabIndex={-1}
            >
              <IconBug size={14} />
              <p>{t('issues')}</p>
            </Link>
            <Link
              to={'https://github.com/riccox/meilisearch-ui'}
              target={'_blank'}
              className="item text-sm flex items-center gap-2"
              tabIndex={-1}
            >
              <IconBrandGithub size={14} />
              <p>{t('open_source')}</p>
            </Link>
          </div>
        </div>
      </div>
    ),
    [
      className,
      t,
      currentInstance,
      health,
      navigate,
      onClickDump,
      onClickHost,
      stats?.databaseSize,
      stats?.lastUpdate,
      version?.commitDate,
      version?.commitSha,
      version?.pkgVersion,
    ]
  );
};
