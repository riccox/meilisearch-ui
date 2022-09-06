import { Logo } from '@/src/components/Logo';
import { useCallback, useMemo, useState } from 'react';
import { Instance, useAppStore } from '@/src/store';
import { ActionIcon, Autocomplete, Button, Modal, PasswordInput, TextInput, Tooltip } from '@mantine/core';
import { Footer } from '@/src/components/Footer';
import { useNavigate } from 'react-router-dom';
import { useForm } from '@mantine/form';
import { MeiliSearch } from 'meilisearch';
import _ from 'lodash';
import { showNotification } from '@mantine/notifications';
import { IconAdjustments, IconBooks, IconCirclePlus, IconKey, IconListCheck, IconPencilMinus } from '@tabler/icons';
import dayjs from 'dayjs';

const instanceCardClassName = `col-span-1 h-28 rounded-lg`;

function Dashboard() {
  const navigate = useNavigate();
  const setCurrentInstance = useAppStore((state) => state.setCurrentInstance);
  const addInstance = useAppStore((state) => state.addInstance);
  const instances = useAppStore((state) => state.instances);
  const currentInstance = useAppStore((state) => state.currentInstance);
  const [isAddInstanceModalOpen, setIsAddInstanceModalOpen] = useState(false);

  const [isAddInstanceLoading, setIsAddInstanceLoading] = useState(false);

  const form = useForm({
    initialValues: {
      name: 'default',
      host: currentInstance?.host ?? '',
      apiKey: currentInstance?.apiKey ?? '',
    },
    validate: {
      host: (value: string) =>
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)/.test(
          value
        )
          ? null
          : 'Invalid host',
    },
  });

  const onAddInstance = useCallback(async (values: typeof form.values) => {
    // button loading
    setIsAddInstanceLoading(true);
    // do connection check
    const client = new MeiliSearch({ ...values });
    let stats;
    try {
      stats = await client.getStats();
      console.info(stats);
    } catch (e) {
      console.warn(e);
    }
    // button stop loading
    setIsAddInstanceLoading(false);
    if (_.isEmpty(stats)) {
      showNotification({
        color: 'danger',
        title: 'Fail',
        message: 'Connection fail, go check your config! 🤥',
      });
      return;
    } else {
      addInstance({ ...values });
      setIsAddInstanceModalOpen(false);
    }
  }, []);

  const onClickInstance = useCallback((ins: Instance, to?: string) => {
    setCurrentInstance(ins);
    to && navigate(to);
  }, []);

  const instancesList = useMemo(() => {
    return instances.map((instance, index) => {
      return (
        <div
          key={index}
          className={`bg-background-light flex flex-col justify-between py-4 px-6
      hover:ring-brand-4 hover:ring-2 ${instanceCardClassName}`}
        >
          <div className={`flex justify-between items-center group`}>
            <p className={`text-2xl font-bold group-hover:underline`}>{instance.name}</p>
            <Tooltip position={'left'} label="Edit">
              <ActionIcon variant="light" color="yellow">
                <IconPencilMinus size={24} />
              </ActionIcon>
            </Tooltip>
          </div>
          <div className={`w-full flex justify-end items-center gap-x-3`}>
            <p className={`mr-auto text-neutral-500 text-sm`}>
              Added at {dayjs(instance.addTime).format('YYYY-MM-DD HH:mm')}
            </p>
            <Tooltip position={'bottom'} label="Indexes">
              <ActionIcon variant="light" color="violet" onClick={() => onClickInstance(instance, '/index')}>
                <IconBooks size={24} />
              </ActionIcon>
            </Tooltip>
            <Tooltip position={'bottom'} label="Tasks">
              <ActionIcon variant="light" color="info" onClick={() => onClickInstance(instance, '/tasks')}>
                <IconListCheck size={24} />
              </ActionIcon>
            </Tooltip>
            <Tooltip position={'bottom'} label="Keys">
              <ActionIcon variant="light" color="purple" onClick={() => onClickInstance(instance, '/keys')}>
                <IconKey size={24} />
              </ActionIcon>
            </Tooltip>
            <Tooltip position={'bottom'} label="Settings">
              <ActionIcon variant="light" color="danger">
                <IconAdjustments size={24} />
              </ActionIcon>
            </Tooltip>
          </div>
        </div>
      );
    });
  }, [instances]);

  return (
    <div className="bg-mount full-page justify-center items-center gap-y-6">
      <div className={`w-1/4 h-2/3 flex flex-col justify-center items-center gap-y-10`}>
        <Logo />
        <h1 className={`text-brand-2 font-bold`}>A Beautiful Meilisearch UI</h1>
        <div className={`grid grid-cols-1 gap-y-3 w-full p-1  overflow-y-scroll`}>
          {instancesList}
          <div
            onClick={() => setIsAddInstanceModalOpen(true)}
            className={`${instanceCardClassName}
            flex justify-center items-center 
            hover:cursor-pointer hover:opacity-80 hover:border-neutral-200 hover:border-2 
            bg-neutral-500 bg-opacity-30 border border-neutral-500 border-dashed`}
          >
            <IconCirclePlus color={'white'} opacity={0.5} size={48} />
          </div>
        </div>
      </div>
      <Footer className={`!text-white`} />

      <Modal
        opened={isAddInstanceModalOpen}
        onClose={() => setIsAddInstanceModalOpen(false)}
        centered
        lockScroll
        radius="lg"
        shadow="xl"
        overlayOpacity={0.3}
        padding="xl"
        withCloseButton={false}
      >
        <p className={`text-center font-semibold text-lg`}>Add New Instance</p>
        <form className={`flex flex-col gap-y-6 w-full `} onSubmit={form.onSubmit(onAddInstance)}>
          <TextInput
            autoFocus
            radius="md"
            size={'lg'}
            label={<p className={'text-brand-5 pb-2 text-lg'}>Name</p>}
            placeholder="just describe your instance"
            {...form.getInputProps('name')}
          />
          <Autocomplete
            radius="md"
            size={'lg'}
            label={<p className={'text-brand-5 pb-2 text-lg'}>Host</p>}
            placeholder="http://127.0.0.1:7700"
            data={instances.map((i) => i.host)}
            {...form.getInputProps('host')}
          />
          <Tooltip
            position={'bottom-start'}
            label="Don't care! Your instance config will only be store in your local browser"
          >
            <PasswordInput
              placeholder="masterKey"
              radius="md"
              size={'lg'}
              label={<p className={'text-brand-5 pb-2 text-lg'}>Api Key</p>}
              {...form.getInputProps('apiKey')}
            />
          </Tooltip>
          <Button type="submit" radius={'xl'} size={'lg'} variant="light" loading={isAddInstanceLoading}>
            Add this instance
          </Button>
          <Footer />
        </form>
      </Modal>
    </div>
  );
}

export default Dashboard;
