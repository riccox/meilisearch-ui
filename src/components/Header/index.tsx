import { ActionIcon, HoverCard } from '@mantine/core';
import {
  IconAffiliate,
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
import { FC, useCallback, useMemo, useState } from 'react';
import { useClipboard } from '@mantine/hooks';
import { MeiliSearch, Version } from 'meilisearch';
import { useQuery } from '@tanstack/react-query';
import { useInstanceStats } from '@/src/hooks/useInstanceStats';
import _ from 'lodash';
import { openConfirmModal } from '@mantine/modals';
import { getTimeText, showTaskSubmitNotification } from '@/src/utils/text';
import { validateKeysRouteAvailable } from '@/src/utils/conn';
import { useNavigatePreCheck } from '@/src/hooks/useRoutePreCheck';
import { toast } from 'sonner';
import { useCurrentInstance } from '@/src/hooks/useCurrentInstance';
import clsx from 'clsx';

interface Props {
  className?: string;
  client: MeiliSearch;
}

export const Header: FC<Props> = ({ client, className }) => {
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

  useQuery(
    ['version', currentInstance?.host],
    async () => {
      return await client.getVersion();
    },
    { refetchInterval: 120000, onSuccess: (res) => setVersion(res) }
  );
  useQuery(
    ['health', currentInstance?.host],
    async () => {
      return (await client.health()).status === 'available';
    },
    { refetchInterval: 30000, onSuccess: (res) => setHealth(res) }
  );

  const onClickHost = useCallback(() => {
    clipboard.copy(currentInstance?.host);
    toast.success('Server Host Copied ✍');
  }, [clipboard, currentInstance?.host]);

  const onClickDump = useCallback(() => {
    openConfirmModal({
      title: 'Create a new dump',
      centered: true,
      children: <p>Are you sure you want to start a new dump for instance {currentInstance.name}?</p>,
      labels: { confirm: 'Start', cancel: 'Cancel' },
      confirmProps: { color: 'orange' },
      onConfirm: () => {
        client.createDump().then((value) => {
          showTaskSubmitNotification(value);
        });
      },
    });
  }, [client, currentInstance.name]);

  return useMemo(
    () => (
      <div
        className={clsx(
          className,
          `bg-background-light
        flex justify-between items-center
        p-5 rounded-3xl drop-shadow-xl z-20`
        )}
      >
        <button
          className="btn primary solid flex items-center gap-2"
          onClick={() => navigate(['/'], { currentInstance })}
        >
          <IconHomeBolt size={26} />
          <p>Home</p>
        </button>

        <p className={`text-2xl font-bold`}>{_.truncate(currentInstance?.name, { length: 16 })}</p>
        <p className={`text-2xl font-bold text-bw-800/50`}>#{currentInstance.id}</p>

        <span
          className={`!cursor-pointer hover:underline badge outline cornered lg success hidden 2xl:inline`}
          onClick={onClickHost}
        >
          Host: {_.truncate(currentInstance?.host, { length: 40 })}
        </span>

        <p className={`font-bold hidden xl:inline`}>Updated: {getTimeText(stats?.lastUpdate)}</p>

        <span className={`badge outline cornered lg primary hidden xl:inline`}>
          DB Size: {_.ceil((stats?.databaseSize ?? 0) / 1048576, 2)} MB
        </span>

        <span className={`badge light cornered lg ${health ? 'success' : 'warn'} hidden xl:inline`}>
          Status: {health ? 'Available' : 'Unknown'}
        </span>

        <HoverCard withinPortal shadow="lg" radius={'lg'} transitionProps={{ transition: 'fade' }}>
          <HoverCard.Target>
            <span className={`badge outline cornered lg primary hidden 2xl:inline`}>
              Meili Version: {version?.pkgVersion}
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
            <p className="subtitle">Instance</p>
            <Link
              to={`/ins/${currentInstance.id}/index`}
              className="item text-sm flex items-center gap-2 "
              tabIndex={-1}
            >
              <IconBooks size={14} />
              <p>Index</p>
            </Link>

            <div
              onClick={() => {
                navigate([`/ins/${currentInstance.id}/keys`], { currentInstance });
              }}
              className="item text-sm flex items-center gap-2 hover:underline"
              tabIndex={-1}
            >
              <IconKey size={14} />
              <p>Keys</p>
            </div>
            <Link
              to={`/ins/${currentInstance.id}/tasks`}
              className="item text-sm flex items-center gap-2"
              tabIndex={-1}
            >
              <IconListCheck size={14} />
              <p>Tasks</p>
            </Link>
            <div onClick={onClickDump} className="item text-sm flex items-center gap-2 hover:underline" tabIndex={-1}>
              <IconDeviceFloppy size={14} />
              <p>Dump</p>
            </div>
            <div className="is-divider" role="separator"></div>
            <p className="subtitle">System</p>
            <Link to={'/'} className="item text-sm flex items-center gap-2 danger" tabIndex={-1}>
              <IconArrowsLeftRight size={14} />
              <p>Change Instance</p>
            </Link>
            <div className="is-divider" role="separator"></div>
            <p className="subtitle">Support</p>
            <Link
              to={'https://docs.meilisearch.com'}
              target={'_blank'}
              className="item text-sm flex items-center gap-2"
              tabIndex={-1}
            >
              <IconBook2 size={14} />
              <p>Meilisearch Docs</p>
            </Link>
            <Link
              to={'https://github.com/riccox/meilisearch-ui/issues'}
              target={'_blank'}
              className="item text-sm flex items-center gap-2"
              tabIndex={-1}
            >
              <IconBug size={14} />
              <p>Issues</p>
            </Link>
            <Link
              to={'https://github.com/riccox/meilisearch-ui'}
              target={'_blank'}
              className="item text-sm flex items-center gap-2"
              tabIndex={-1}
            >
              <IconBrandGithub size={14} />
              <p>Open Source</p>
            </Link>
          </div>
        </div>
      </div>
    ),
    [
      className,
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
