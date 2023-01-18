import { ActionIcon, Badge, Button, HoverCard, Menu } from '@mantine/core';
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
} from '@tabler/icons';
import { Link } from 'react-router-dom';
import { FC, useCallback, useMemo, useState } from 'react';
import { showNotification } from '@mantine/notifications';
import { useClipboard } from '@mantine/hooks';
import { useAppStore } from '@/src/store';
import { MeiliSearch, Version } from 'meilisearch';
import { useQuery } from 'react-query';
import { useInstanceStats } from '@/src/hooks/useInstanceStats';
import _ from 'lodash';
import { openConfirmModal } from '@mantine/modals';
import { getTimeText, showTaskSubmitNotification } from '@/src/utils/text';
import { validateKeysRouteAvailable } from '@/src/utils/conn';
import { useNavigatePreCheck } from '@/src/hooks/useRoutePreCheck';

interface Props {
  client: MeiliSearch;
}

export const Header: FC<Props> = ({ client }) => {
  const navigate = useNavigatePreCheck(([to], opt) => {
    // check before keys page (no masterKey will cause error)
    if (to === '/keys') {
      return validateKeysRouteAvailable(opt?.currentInstance?.apiKey);
    }
    return null;
  });
  const store = useAppStore();
  const clipboard = useClipboard({ timeout: 500 });

  const stats = useInstanceStats(client);
  const [version, setVersion] = useState<Version>();
  const [health, setHealth] = useState<boolean>(true);

  useQuery(
    ['version', store.currentInstance?.host],
    async () => {
      return await client.getVersion();
    },
    { refetchOnMount: 'always', refetchInterval: 60000, onSuccess: (res) => setVersion(res) }
  );
  useQuery(
    ['health', store.currentInstance?.host],
    async () => {
      return (await client.health()).status === 'available';
    },
    { refetchOnMount: 'always', refetchInterval: 5000, onSuccess: (res) => setHealth(res) }
  );

  const onClickHost = useCallback(() => {
    clipboard.copy(store.currentInstance?.host);
    showNotification({
      color: 'success',
      title: 'Copied',
      message: 'Server Host Copied ✍',
    });
  }, [clipboard, store.currentInstance?.host]);

  const onClickDump = useCallback(() => {
    openConfirmModal({
      title: 'Create a new dump',
      centered: true,
      children: <p>Are you sure you want to start a new dump?</p>,
      labels: { confirm: 'Start', cancel: 'Cancel' },
      confirmProps: { color: 'orange' },
      onConfirm: () => {
        client.createDump().then((value) => {
          showTaskSubmitNotification(value);
        });
      },
    });
  }, [client]);

  return useMemo(
    () => (
      <div
        className={`bg-background-light
        flex justify-between items-center
        p-5 rounded-3xl drop-shadow-xl`}
      >
        <Button
          leftIcon={<IconHomeBolt size={26} />}
          color="primary"
          size="md"
          radius="xl"
          variant="gradient"
          onClick={() => navigate(['/'], { currentInstance: store.currentInstance })}
        >
          Home
        </Button>
        <p className={`text-2xl underline font-bold`}>{_.truncate(store.currentInstance?.name, { length: 20 })}</p>
        <Badge
          className={`!cursor-pointer hover:border hover:border-brand-4`}
          onClick={onClickHost}
          size="xl"
          radius="lg"
          variant="dot"
          color={'green'}
        >
          Host: {_.truncate(store.currentInstance?.host, { length: 40 })}
        </Badge>
        <Badge className={``} size="xl" radius="lg">
          Database Size: {_.ceil((stats?.databaseSize ?? 0) / 1048576, 2)} MB
        </Badge>
        <p className={`font-bold `}>Last Updated: {getTimeText(stats?.lastUpdate)}</p>
        <Badge className={``} size="xl" radius="lg" variant="dot" color={health ? 'green' : 'yellow'}>
          Status: {health ? 'Available' : 'Unknown'}
        </Badge>

        <HoverCard withinPortal shadow="lg" radius={'lg'} transition={'fade'}>
          <HoverCard.Target>
            <Badge className={``} size="xl" radius="lg">
              Version: {version?.pkgVersion}
            </Badge>
          </HoverCard.Target>
          <HoverCard.Dropdown>
            Commit Date: {version?.commitDate} <br />
            Commit Sha: {version?.commitSha}
          </HoverCard.Dropdown>
        </HoverCard>

        <Menu withinPortal shadow="xl" width={180} radius={'lg'} transition={'pop'}>
          <Menu.Target>
            <ActionIcon color="primary" size="lg" radius="xl" variant="outline">
              <IconSettings size={26} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>Instance</Menu.Label>
            <Menu.Item icon={<IconBooks size={14} />} component={Link} to={'/index'}>
              Index
            </Menu.Item>
            <Menu.Item
              icon={<IconKey size={14} />}
              className={'font-semibold hover:underline'}
              onClick={() => {
                navigate(['/keys'], { currentInstance: store.currentInstance });
              }}
            >
              Keys
            </Menu.Item>
            <Menu.Item icon={<IconListCheck size={14} />} component={Link} to={'/tasks'}>
              Tasks
            </Menu.Item>
            <Menu.Item
              className={'font-semibold hover:underline'}
              icon={<IconDeviceFloppy size={14} />}
              onClick={onClickDump}
            >
              Dump
            </Menu.Item>
            <Menu.Divider />
            <Menu.Label>System</Menu.Label>
            <Menu.Item color="red" icon={<IconArrowsLeftRight size={14} />} component={Link} to={'/'}>
              Change Instance
            </Menu.Item>
            <Menu.Divider />
            <Menu.Label>Support</Menu.Label>
            <Menu.Item icon={<IconBook2 size={14} />} component={Link} to={'//docs.meilisearch.com'} target={'_blank'}>
              Meilisearch Docs
            </Menu.Item>
            <Menu.Item
              icon={<IconBug size={14} />}
              component={Link}
              to={'//github.com/riccox/meilisearch-ui/issues'}
              target={'_blank'}
            >
              Issues
            </Menu.Item>
            <Menu.Item
              icon={<IconBrandGithub size={14} />}
              component={Link}
              to={'//github.com/riccox/meilisearch-ui'}
              target={'_blank'}
            >
              Open Source
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </div>
    ),
    [
      health,
      navigate,
      onClickDump,
      onClickHost,
      stats?.databaseSize,
      stats?.lastUpdate,
      store.currentInstance,
      version?.commitDate,
      version?.commitSha,
      version?.pkgVersion,
    ]
  );
};
