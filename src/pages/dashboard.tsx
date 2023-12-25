import {Logo} from '@/src/components/Logo';
import {useNavigatePreCheck} from '@/src/hooks/useRoutePreCheck';
import {defaultInstance, Instance, useAppStore} from '@/src/store';
import {testConnection, validateKeysRouteAvailable} from '@/src/utils/conn';
import {Autocomplete, Button, Modal, PasswordInput, TextInput, Tooltip} from '@mantine/core';
import {useForm} from '@mantine/form';
import {modals} from '@mantine/modals';
import {
  IconArrowRight,
  IconBooks,
  IconCirclePlus,
  IconCircleX,
  IconKey,
  IconListCheck,
  IconPencilMinus
} from '@tabler/icons-react';
import _ from 'lodash';
import {useCallback, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useCurrentInstance} from '../hooks/useCurrentInstance';

const instanceCardClassName = `col-span-1 h-28 rounded-md`;

function Dashboard() {
  const { t } = useTranslation('dashboard');

  function isValidUrl(url: string) {
    try {
      new URL(url);
      return true;
    } catch (err) {
      return false;
    }
  }

  const navigate = useNavigatePreCheck(([to], opt) => {
    console.debug('dashboard', 'navigate', to, opt?.currentInstance);
    if (typeof to === 'string' && /\/keys$/.test(to)) {
      // check before keys page (no masterKey will cause error)
      return validateKeysRouteAvailable(opt?.currentInstance?.apiKey);
    }
    return null;
  });

  const currentInstance = useCurrentInstance();
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
      host: (value: string) => (isValidUrl(value) ? null : 'Invalid host'),
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
              editInstance(instanceEditing!.id, { ...cfg });
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
        if (to) {
          navigate([to], { currentInstance: ins });
        }
      });
    },
    [navigate]
  );

  const onClickRemoveInstance = useCallback(
    (ins: Instance) => {
      const modalId = 'removeInsModal';
      modals.open({
        modalId,
        title: t('instance.remove.title'),
        centered: true,
        children: (
          <div className="flex flex-col gap-6">
            <p>
              {t('instance.remove.tip')} ({ins.name})?
            </p>
            <div className="flex gap-3">
              <button
                className="btn sm solid danger flex-1"
                onClick={() => {
                  removeInstance(ins.id);

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
    },
    [removeInstance, t]
  );

  const instancesList = useMemo(() => {
    return instances.map((instance, index) => {
      return (
        <div
          key={index}
          className={`bg-background-light/90
                      flex flex-col justify-between
                      py-4 px-6 group
                      h-96 w-80
                      hover:ring-brand-4 hover:ring-2
                      ${instanceCardClassName}`}
        >
          <p className={`text-2xl font-bold cursor-pointer capitalize text-center`}>{instance.name}</p>

          <div className={`grid  gap-2`}>
            <div
              className="flex gap-5 items-center bg-yellow-400 p-1 rounded-sm"
              onClick={() => {
                setInstanceEditing(() => ({ ...instance }));
                instanceForm.setValues(() => ({ ...instance }));
                setInstanceFormType('edit');
                setIsInstanceFormModalOpen(true);
              }}
            >
              <Tooltip position={'left'} label={t('edit')}>
                <IconPencilMinus size={24} />
              </Tooltip>
              <p>{t('edit')}</p>
            </div>

            <div
              className="flex gap-5 items-center bg-red-400 p-1 rounded-sm"
              onClick={() => onClickRemoveInstance(instance)}
            >
              <IconCircleX size={24} />
              <p>{'Remove'}</p>
            </div>

            <div
              className="flex gap-5 items-center bg-violet-400 p-1 rounded-sm"
              onClick={() => onClickInstance(instance, `/instance/${instance.id}/index`)}
            >
              <Tooltip position={'bottom'} label={t('indexes')}>
                <IconBooks size={24} />
              </Tooltip>
              <p>{t('indexes')}</p>
            </div>
            <div
              className="flex gap-5 items-center bg-blue-400 p-1 rounded-sm"
              onClick={() => onClickInstance(instance, `/instance/${instance.id}/tasks`)}
            >
              <Tooltip position={'bottom'} label={t('tasks')}>
                <IconListCheck size={24} />
              </Tooltip>
              <p>{t('tasks')}</p>
            </div>
            <div
              className="flex gap-5 items-center bg-purple-400 p-1 rounded-sm"
              onClick={() => onClickInstance(instance, `/instance/${instance.id}/keys`)}
            >
              <Tooltip position={'bottom'} label={t('keys')}>
                <IconKey size={24} />
              </Tooltip>
              <p>{t('keys')}</p>
            </div>
            <div
              className={`flex mt-10 justify-evenly items-center `}
              onClick={() => onClickInstance(instance, `/instance/${instance.id}/index`)}
            >
              <Button color={'indigo'} style={{ borderRadius: '30px', width: '80%', height: '50px' }}>
                <IconArrowRight size={44} />
              </Button>
            </div>
          </div>
        </div>
      );
    });
  }, [instanceForm, instances, onClickInstance, onClickRemoveInstance, t]);

  return (
    <div className="bg-mount full-page justify-center items-center gap-y-6">
      <div className="w-1/2 2xl:w-1/4 flex flex-col justify-center items-center gap-y-10">
        <Logo />
        <div className={`flex gap-4`}>{instancesList}</div>
        <div
          onClick={() => {
            setInstanceFormType('create');
            setIsInstanceFormModalOpen(true);
          }}
          className={`${instanceCardClassName}
            flex justify-center items-center 
            w-80 py-5
            hover:cursor-pointer hover:opacity-80 hover:border-neutral-200 hover:border-2 
            bg-neutral-500 bg-opacity-30 border border-neutral-500 border-dashed`}
        >
          <IconCirclePlus color={'white'} opacity={0.5} size={48} />
        </div>
      </div>
      <Modal
        opened={isInstanceFormModalOpen}
        onClose={() => setIsInstanceFormModalOpen(false)}
        centered
        lockScroll
        radius="md"
        shadow="xl"
        padding="xl"
        withCloseButton={false}
      >
        <p className={`text-center font-semibold text-lg`}>{t(`instance.form.title.${instanceFormType}`)}</p>
        <form className={`flex flex-col gap-y-6 w-full`} onSubmit={instanceForm.onSubmit(onSubmitInstance)}>
          <TextInput
            autoFocus
            radius="md"
            size={'lg'}
            label={<p className={'text-brand-5 pb-2 text-lg'}>{t('instance.form.name.label')}</p>}
            placeholder={t('instance.form.name.placeholder')}
            {...instanceForm.getInputProps('name')}
          />
          <Autocomplete
            radius="md"
            type={'url'}
            size={'lg'}
            label={<p className={'text-brand-5 pb-2 text-lg'}>{t('instance.form.host.label')}</p>}
            placeholder="http://127.0.0.1:7700"
            {...instanceForm.getInputProps('host')}
          />

          <PasswordInput
            placeholder="masterKey"
            radius="md"
            size={'lg'}
            label={<p className={'text-brand-5 pb-2 text-lg'}>{t('instance.form.api_key.label')}</p>}
            {...instanceForm.getInputProps('apiKey')}
          />
          <button type="submit" className="btn primary outline w-full" disabled={isSubmitInstanceLoading}>
            {t('confirm')}
          </button>
        </form>
      </Modal>
    </div>
  );
}

export default Dashboard;
