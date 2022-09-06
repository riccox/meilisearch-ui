import { useCallback, useState } from 'react';
import { Modal } from '@mantine/core';
import { useMeiliClient } from '@/src/hooks/useMeiliClient';
import { Index } from 'meilisearch';
import { useQuery } from 'react-query';
import { useAppStore } from '@/src/store';
import { Header } from '@/src/components/Header';
import _ from 'lodash';
import { hiddenRequestLoader, showRequestLoader } from '@/src/utils/loader';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import dayjs from 'dayjs';
import { useOutletContext } from 'react-router-dom';

function Settings() {
  const context = useOutletContext<{
    currentIndex?: Index;
  }>();
  const client = useMeiliClient();
  const host = useAppStore((state) => state.currentInstance?.host);
  const [isCreateKeyModalOpen, setIsCreateKeyModalOpen] = useState<boolean>(false);

  const settingsQuery = useQuery(
    ['settings', host, context.currentIndex?.uid],
    async ({}) => {
      showRequestLoader();
      return await client.index(context.currentIndex?.uid ?? '').getSettings();
    },
    {
      keepPreviousData: true,
      refetchOnMount: 'always',
      onError: (err) => {
        console.warn('get meilisearch settings error', err);
      },
      onSettled: () => {
        hiddenRequestLoader();
      },
    }
  );

  const onClickCreate = useCallback(() => {
    setIsCreateKeyModalOpen(true);
  }, []);

  const refreshKeys = useCallback(() => {
    // wait for create key task complete
    setTimeout(() => {
      settingsQuery.refetch().then();
    }, 1000);
  }, []);

  const [isCreateLoading, setIsCreateLoading] = useState(false);

  const form = useForm({
    initialValues: {
      name: undefined,
      description: undefined,
      indexes: [],
      actions: [],
      expiresAt: null,
    },
    validate: {
      expiresAt: (value: string | null) =>
        value ? (/^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}$/.test(value) ? null : 'Invalid Expire Time') : null,
    },
  });

  const onCreation = useCallback(async ({ name, description, indexes, actions, expiresAt }: typeof form.values) => {
    // button loading
    setIsCreateLoading(true);
    let res;
    try {
      res = await client.createKey({
        name,
        description,
        indexes: _.isEmpty(indexes) ? ['*'] : indexes,
        actions: _.isEmpty(actions) ? ['*'] : actions,
        expiresAt: _.isEmpty(expiresAt)
          ? null
          : dayjs(expiresAt, 'YYYY-MM-dd HH:mm:ss').format('YYYY-MM-dd HH:mm:ss+00:00'),
      });
      console.info(res);
    } catch (e) {
      console.warn(e);
    }
    // button stop loading
    setIsCreateLoading(false);
    if (_.isEmpty(res)) {
      showNotification({
        color: 'danger',
        title: 'Fail',
        message: `Creation fail, go check tasks! 🤥`,
      });
      return;
    } else {
      setIsCreateKeyModalOpen(false);
      refreshKeys();
    }
  }, []);

  return (
    <div className="bg-mount full-page items-stretch p-5 gap-4">
      <Header client={client} />
      <div
        className={`flex-1 overflow-hidden bg-background-light 
        flex flex-col justify-start items-stretch
        p-6 rounded-3xl gap-y-2`}
      >
        <div className={`flex justify-between items-center gap-x-6`}>
          <div className={`font-extrabold text-3xl`}>🦄 Settings</div>
        </div>
      </div>
      <Modal
        centered
        lockScroll
        size="lg"
        radius="lg"
        shadow="xl"
        overlayOpacity={0.3}
        padding="xl"
        opened={isCreateKeyModalOpen}
        onClose={() => setIsCreateKeyModalOpen(false)}
      >
        <p className={`text-center font-semibold text-lg`}>Add New Key</p>
      </Modal>
    </div>
  );
}

export default Settings;
