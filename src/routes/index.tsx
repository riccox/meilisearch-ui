import { Logo } from '@/components/Logo';
import { useCallback, useMemo } from 'react';
import { Instance, useAppStore } from '@/store';
import { ActionIcon, Tooltip } from '@mantine/core';
import { Footer } from '@/components/Footer';
import { IconBooks, IconCirclePlus, IconCircleX, IconKey, IconListCheck, IconPencilMinus } from '@tabler/icons-react';
import { isSingletonMode, testConnection, validateKeysRouteAvailable } from '@/utils/conn';
import { modals } from '@mantine/modals';
import { useNavigatePreCheck } from '@/hooks/useRoutePreCheck';
import { useTranslation } from 'react-i18next';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { Button } from '@douyinfe/semi-ui';
import { InsFormModal } from '@/components/instanceFormModal';
import { TimeAgo } from '@/components/timeago';

const instanceCardClassName = `col-span-1 h-28 rounded-lg`;

function Dashboard() {
  const { t } = useTranslation('dashboard');

  const navigate = useNavigatePreCheck((params, opt) => {
    console.debug('dashboard', 'navigate', params.to, opt?.currentInstance);
    if (typeof params.to === 'string' && /\/keys$/.test(params.to)) {
      // check before keys page (no masterKey will cause error)
      return validateKeysRouteAvailable(opt?.currentInstance?.apiKey);
    }
    return null;
  });

  const removeInstance = useAppStore((state) => state.removeInstance);
  const instances = useAppStore((state) => state.instances);

  const onClickInstance = useCallback(
    (ins: Instance, to?: string) => {
      // do connection test before next step
      testConnection({ ...ins }).then(() => {
        if (to) {
          navigate({ to }, { currentInstance: ins });
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
              <Button
                block
                theme="solid"
                type="danger"
                onClick={() => {
                  removeInstance(ins.id);
                  modals.close(modalId);
                }}
              >
                {t('confirm')}
              </Button>
              <Button
                block
                theme="solid"
                type="secondary"
                onClick={() => {
                  modals.close(modalId);
                }}
              >
                {t('cancel')}
              </Button>
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
          className={`bg-white flex flex-col justify-between py-4 px-6 group
      hover:ring-primary-100 hover:ring-2 ${instanceCardClassName}`}
        >
          <div className={`flex justify-between items-center`}>
            <div className="flex items-center gap-2">
              <p
                className={`text-2xl font-bold group-hover:underline cursor-pointer`}
                onClick={() => onClickInstance(instance, `/ins/${instance.id}`)}
              >
                {instance.name}
              </p>
              <p
                className={`text-2xl font-bold cursor-pointer text-bw-800/50`}
                onClick={() => onClickInstance(instance, `/ins/${instance.id}`)}
              >
                #{instance.id}
              </p>
            </div>
            <div className={`flex gap-x-3`}>
              <InsFormModal ins={instance} type="edit">
                <Tooltip position={'left'} label={t('edit')}>
                  <ActionIcon variant="light" color="yellow">
                    <IconPencilMinus size={24} />
                  </ActionIcon>
                </Tooltip>
              </InsFormModal>
              <ActionIcon variant="light" onClick={() => onClickRemoveInstance(instance)}>
                <IconCircleX size={24} />
              </ActionIcon>
            </div>
          </div>
          <div className={`w-full flex justify-end items-center gap-x-3`}>
            <p className={`mr-auto text-neutral-500 text-sm inline-flex gap-1`}>
              {t('instance.updated_at')} <TimeAgo date={instance.updatedTime} />
            </p>
            <Tooltip position={'bottom'} label={t('indexes')}>
              <ActionIcon
                variant="light"
                color="violet"
                onClick={() => onClickInstance(instance, `/ins/${instance.id}`)}
              >
                <IconBooks size={24} />
              </ActionIcon>
            </Tooltip>
            <Tooltip position={'bottom'} label={t('tasks')}>
              <ActionIcon
                variant="light"
                color="blue"
                onClick={() => onClickInstance(instance, `/ins/${instance.id}/tasks`)}
              >
                <IconListCheck size={24} />
              </ActionIcon>
            </Tooltip>
            <Tooltip position={'bottom'} label={t('keys')}>
              <ActionIcon
                variant="light"
                color="grape"
                onClick={() => onClickInstance(instance, `/ins/${instance.id}/keys`)}
              >
                <IconKey size={24} />
              </ActionIcon>
            </Tooltip>
          </div>
        </div>
      );
    });
  }, [instances, onClickInstance, onClickRemoveInstance, t]);

  return (
    <div className="bg-mount full-page justify-center items-center gap-y-6">
      <div className={`w-1/2 2xl:w-1/4 h-2/3 flex flex-col justify-center items-center gap-y-10`}>
        <Logo className="size-20" />
        <p className={`text-primary-100 font-bold xl:text-3xl text-xl w-screen text-center`}>{t('slogan')}</p>
        <div className={`grid grid-cols-1 gap-y-3 w-full p-1  overflow-y-scroll`}>
          {instancesList}
          <InsFormModal type="create">
            <div
              className={`${instanceCardClassName}
              flex justify-center items-center 
              hover:cursor-pointer hover:opacity-80 hover:border-neutral-200 hover:border-2 
              bg-neutral-500 bg-opacity-30 border border-neutral-500 border-dashed`}
            >
              <IconCirclePlus color={'white'} opacity={0.5} size={48} />
            </div>
          </InsFormModal>
        </div>
      </div>
      <Footer className={`!text-white`} />
    </div>
  );
}

export const Route = createFileRoute('/')({
  component: Dashboard,
  beforeLoad: async () => {
    if (isSingletonMode()) {
      throw redirect({
        to: '/ins/$insID',
        params: {
          insID: '0',
        },
      });
    }
  },
});
