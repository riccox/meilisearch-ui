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
import { useCallback, useState } from 'react';
import { showNotification } from '@mantine/notifications';
import { useClipboard } from '@mantine/hooks';
import { useAppStore } from '@/src/store';
import { Version } from 'meilisearch';
import { useQuery } from 'react-query';
import { useMeiliClient } from '@/src/hooks/useMeiliClient';
import { useInstanceStats } from '@/src/hooks/useInstanceStats';

export const Header = () => {
  const navigate = useNavigate();
  const clipboard = useClipboard({ timeout: 500 });
  const store = useAppStore();

  const client = useMeiliClient();
  const stats = useInstanceStats();
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
      className={`bg-background-light 
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
      <Badge
        className={`!cursor-pointer hover:border hover:border-brand-4`}
        onClick={onClickHost}
        size="xl"
        radius="lg"
        variant="dot"
        color={'green'}
      >
        Host: {store.currentInstance?.host}
      </Badge>
      <Badge className={``} size="xl" radius="lg">
        Database Size: {stats?.databaseSize} Bytes
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
          <Menu.Item icon={<IconListCheck size={14} />}>Tasks</Menu.Item>
          <Menu.Item icon={<IconDeviceFloppy size={14} />}>Dump</Menu.Item>
          <Menu.Divider />
          <Menu.Label>System</Menu.Label>
          <Menu.Item color="red" icon={<IconArrowsLeftRight size={14} />} component={Link} to={'/start'}>
            Change Instance
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </div>
  );
};
