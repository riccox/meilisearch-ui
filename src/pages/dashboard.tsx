import { Logo } from '@/src/components/Logo';
import { useCallback, useMemo, useState } from 'react';
import { defaultInstance, Instance, useAppStore } from '@/src/store';
import { ActionIcon, Autocomplete, Modal, PasswordInput, TextInput, Tooltip } from '@mantine/core';
import { Footer } from '@/src/components/Footer';
import { useForm } from '@mantine/form';
import { IconBooks, IconCirclePlus, IconCircleX, IconKey, IconListCheck, IconPencilMinus } from '@tabler/icons-react';
import { testConnection, validateKeysRouteAvailable } from '@/src/utils/conn';
import { openConfirmModal } from '@mantine/modals';
import { getTimeText } from '@/src/utils/text';
import _ from 'lodash';
import { useNavigatePreCheck } from '@/src/hooks/useRoutePreCheck';

const instanceCardClassName = `col-span-1 h-28 rounded-lg`;

function Dashboard() {
  const navigate = useNavigatePreCheck(([to], opt) => {
    console.debug('dashboard', 'navigate', to, opt?.currentInstance?.apiKey);
    // check before keys page (no masterKey will cause error)
    if (to === '/keys') {
      return validateKeysRouteAvailable(opt?.currentInstance?.apiKey);
    }
    return null;
  });
  const currentInstance = useAppStore((state) => state.currentInstance);
  const setCurrentInstance = useAppStore((state) => state.setCurrentInstance);
  const addInstance = useAppStore((state) => state.addInstance);
  const editInstance = useAppStore((state) => state.editInstance);
  const removeInstance = useAppStore((state) => state.removeInstance);
  const instances = useAppStore((state) => state.instances);
  const [instanceFormType, setInstanceFormType] = useState<'create' | 'edit'>('create');
  const [instanceEditing, setInstanceEditing] = useState<Instance>();
  const [isInstanceFormModalOpen, setIsInstanceFormModalOpen] = useState(false);
  const [isSubmitInstanceLoading, setIsSubmitInstanceLoading] = useState(false);

  const instanceForm = useForm({
    initialValues: {
      ...defaultInstance,
      host: currentInstance?.host ?? defaultInstance.host,
      apiKey: currentInstance?.apiKey ?? defaultInstance.apiKey,
    },
    validate: {
      name: (value: string) => {
        let otherNames: string[] = [];
        switch (instanceFormType) {
          case 'create':
            otherNames = instances.map((i) => i.name);
            break;
          case 'edit':
            otherNames = instances.map((i) => i.name).filter((n) => n !== instanceEditing!.name);
            break;
        }
        return otherNames.includes(value) ? 'Name should be different from others' : null;
      },
      host: (value: string) =>
        /(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)/.test(
          value
        )
          ? null
          : 'Invalid host',
    },
  });

  const onSubmitInstance = useCallback(
    async (values: typeof instanceForm.values) => {
      // button loading
      setIsSubmitInstanceLoading(true);
      // normalize host string
      const cfg: typeof instanceForm.values = {
        ...values,
        host: `${/^(https?:\/\/)/.test(values.host) ? '' : 'http://'}${values.host}`,
      };
      // remove empty apikey
      cfg.apiKey = _.isEmpty(cfg.apiKey) ? undefined : cfg.apiKey;
      // do connection check
      testConnection({ ...cfg })
        .finally(() => {
          setIsSubmitInstanceLoading(false);
        })
        .then(() => {
          switch (instanceFormType) {
            case 'create':
              addInstance({ ...cfg });
              break;
            case 'edit':
              editInstance(instanceEditing!.name, { ...cfg });
              break;
          }
          setIsInstanceFormModalOpen(false);
        });
    },
    [instanceForm, instanceFormType, addInstance, editInstance, instanceEditing]
  );

  const onClickInstance = useCallback(
    (ins: Instance, to?: string) => {
      // do connection test before next step
      testConnection({ ...ins }).then(() => {
        setCurrentInstance(ins);
        if (to) {
          navigate([to], { currentInstance: ins });
        }
      });
    },
    [navigate, setCurrentInstance]
  );

  const onClickRemoveInstance = useCallback(
    (ins: Instance) => {
      openConfirmModal({
        title: 'Remove this instance',
        centered: true,
        children: <p>Are you sure you want to remove this instance?</p>,
        labels: { confirm: 'Yes', cancel: 'No' },
        onConfirm: () => {
          removeInstance(ins.name);
        },
      });
    },
    [removeInstance]
  );

  const instancesList = useMemo(() => {
    return instances.map((instance, index) => {
      return (
        <div
          key={index}
          className={`bg-background-light flex flex-col justify-between py-4 px-6 group
      hover:ring-brand-4 hover:ring-2 ${instanceCardClassName}`}
        >
          <div className={`flex justify-between items-center`}>
            <p
              className={`text-2xl font-bold group-hover:underline cursor-pointer`}
              onClick={() => onClickInstance(instance, '/index')}
            >
              {instance.name}
            </p>
            <div className={`flex gap-x-3`}>
              <Tooltip position={'left'} label="Edit">
                <ActionIcon
                  variant="light"
                  color="yellow"
                  onClick={() => {
                    setInstanceEditing(() => ({ ...instance }));
                    instanceForm.setValues(() => ({ ...instance }));
                    setInstanceFormType(() => 'edit');
                    setIsInstanceFormModalOpen(() => true);
                  }}
                >
                  <IconPencilMinus size={24} />
                </ActionIcon>
              </Tooltip>
              <ActionIcon variant="light" onClick={() => onClickRemoveInstance(instance)}>
                <IconCircleX size={24} />
              </ActionIcon>
            </div>
          </div>
          <div className={`w-full flex justify-end items-center gap-x-3`}>
            <p className={`mr-auto text-neutral-500 text-sm`}>Updated at {getTimeText(instance.updatedTime)}</p>
            <Tooltip position={'bottom'} label="Indexes">
              <ActionIcon variant="light" color="violet" onClick={() => onClickInstance(instance, '/index')}>
                <IconBooks size={24} />
              </ActionIcon>
            </Tooltip>
            <Tooltip position={'bottom'} label="Tasks">
              <ActionIcon variant="light" color="blue" onClick={() => onClickInstance(instance, '/tasks')}>
                <IconListCheck size={24} />
              </ActionIcon>
            </Tooltip>
            <Tooltip position={'bottom'} label="Keys">
              <ActionIcon variant="light" color="purple" onClick={() => onClickInstance(instance, '/keys')}>
                <IconKey size={24} />
              </ActionIcon>
            </Tooltip>
          </div>
        </div>
      );
    });
  }, [instanceForm, instances, onClickInstance, onClickRemoveInstance]);

  return (
    <div className="bg-mount full-page justify-center items-center gap-y-6">
      <div className={`w-1/4 h-2/3 flex flex-col justify-center items-center gap-y-10`}>
        <Logo />
        <p className={`text-brand-2 font-bold xl:text-3xl text-xl w-screen text-center`}>A Beautiful Meilisearch UI</p>
        <div className={`grid grid-cols-1 gap-y-3 w-full p-1  overflow-y-scroll`}>
          {instancesList}
          <div
            onClick={() => {
              setInstanceFormType('create');
              setIsInstanceFormModalOpen(true);
            }}
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
        opened={isInstanceFormModalOpen}
        onClose={() => setIsInstanceFormModalOpen(false)}
        centered
        lockScroll
        radius="lg"
        shadow="xl"
        padding="xl"
        withCloseButton={false}
      >
        <p className={`text-center font-semibold text-lg`}>
          {instanceFormType === 'edit' ? 'Edit Instance' : 'Add New Instance'}
        </p>
        <form className={`flex flex-col gap-y-6 w-full `} onSubmit={instanceForm.onSubmit(onSubmitInstance)}>
          <TextInput
            autoFocus
            radius="md"
            size={'lg'}
            label={<p className={'text-brand-5 pb-2 text-lg'}>Name</p>}
            placeholder="name your instance, should be different from others"
            {...instanceForm.getInputProps('name')}
          />
          <Tooltip
            position={'bottom-start'}
            label="Remember enable CORS in your instance server for this ui domain first"
          >
            <Autocomplete
              radius="md"
              size={'lg'}
              label={<p className={'text-brand-5 pb-2 text-lg'}>Host</p>}
              placeholder="http://127.0.0.1:7700"
              data={instances.map((i) => i.host)}
              {...instanceForm.getInputProps('host')}
            />
          </Tooltip>
          <Tooltip
            position={'bottom-start'}
            label="Don't care! Your instance config will only be store in your local browser"
          >
            <PasswordInput
              placeholder="masterKey"
              radius="md"
              size={'lg'}
              label={<p className={'text-brand-5 pb-2 text-lg'}>Api Key</p>}
              {...instanceForm.getInputProps('apiKey')}
            />
          </Tooltip>
          <button type="submit" className="btn primary outline" disabled={isSubmitInstanceLoading}>
            {instanceFormType === 'edit' ? 'Confirm edit' : 'Add this instance'}
          </button>
          <Footer />
        </form>
      </Modal>
    </div>
  );
}

export default Dashboard;
