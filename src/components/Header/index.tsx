import { ActionIcon, Badge, Button, HoverCard, Menu } from '@mantine/core';
import dayjs from 'dayjs';
import {
  IconArrowsLeftRight,
  IconDeviceFloppy,
  IconHomeBolt,
  IconKey,
  IconListCheck,
  IconSettings,
} from '@tabler/icons';
import { Link, useNavigate } from 'react-router-dom';
import { FC, useCallback, useState } from 'react';
import { showNotification } from '@mantine/notifications';
import { useClipboard } from '@mantine/hooks';
import { useAppStore } from '@/src/store';
import { MeiliSearch, Version } from 'meilisearch';
import { useQuery } from 'react-query';
import { useInstanceStats } from '@/src/hooks/useInstanceStats';
import _ from 'lodash';

interface Props {
  client: MeiliSearch;
}

export const Header: FC<Props> = ({ client }) => {
  const navigate = useNavigate();
  const clipboard = useClipboard({ timeout: 500 });
  const store = useAppStore();

  const stats = useInstanceStats(client);
  const [version, setVersion] = useState<Version>();
  const [health, setHealth] = useState<boolean>(true);

  useQuery(
    ['version', store.currentInstance?.host],
    async () => {
      return await client.getVersion();
    },
    { refetchOnMount: 'always', onSuccess: (res) => setVersion(res) }
  );
  useQuery(
    ['health', store.currentInstance?.host],
    async () => {
      return (await client.health()).status === 'available';
    },
    { refetchOnMount: 'always', onSuccess: (res) => setHealth(res) }
  );

  const onClickHost = useCallback(() => {
    clipboard.copy(store.currentInstance?.host);
    showNotification({
      color: 'success',
      title: 'Copied',
      message: 'Server Host Copied ✍',
    });
  }, [store.currentInstance?.host]);
  return (
    <div
      className={`bg-background-light flex-grow-0 flex-shrink
        flex justify-between items-center
        p-5 rounded-3xl drop-shadow-2xl`}
    >
      <Button
        leftIcon={<IconHomeBolt size={26} />}
        color="primary"
        size="md"
        radius="xl"
        variant="gradient"
        onClick={() => navigate('/')}
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
      <p className={`font-bold `}>Last Updated: {dayjs(stats?.lastUpdate).format('YYYY-MM-DD HH:mm:ss.SSS')}</p>
      <Badge className={``} size="xl" radius="lg" variant="dot" color={health ? 'green' : 'yellow'}>
        Status: {health ? 'Available' : 'Unknown'}
      </Badge>

      <HoverCard shadow="lg" radius={'lg'} transition={'fade'}>
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

      <Menu shadow="xl" width={180} radius={'lg'} transition={'pop'}>
        <Menu.Target>
          <ActionIcon color="primary" size="lg" radius="xl" variant="outline">
            <IconSettings size={26} />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>Instance</Menu.Label>
          <Menu.Item icon={<IconKey size={14} />}>Keys</Menu.Item>
          <Menu.Item icon={<IconListCheck size={14} />} component={Link} to={'/task'}>
            Tasks
          </Menu.Item>
          <Menu.Item icon={<IconDeviceFloppy size={14} />}>Dump</Menu.Item>
          <Menu.Divider />
          <Menu.Label>System</Menu.Label>
          <Menu.Item color="red" icon={<IconArrowsLeftRight size={14} />} component={Link} to={'/'}>
            Change Instance
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </div>
  );
};
