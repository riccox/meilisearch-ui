'use client';
import { FC, ReactNode, useCallback, useState } from 'react';
import { Drawer } from 'vaul';
import { cn } from '@/lib/cn';
import { Footer } from './Footer';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { defaultInstance, Instance, useAppStore } from '@/store';
import { useCurrentInstance } from '@/hooks/useCurrentInstance';
import { Autocomplete, Input, Button, Tooltip, AutocompleteItem } from '@nextui-org/react';
import _ from 'lodash';
import { testConnection } from '@/utils/conn';

interface Props {
  className?: string;
  children: ReactNode;
  ins?: Instance;
  type?: 'create' | 'edit';
}

type InstanceFormValue = Pick<Instance, 'apiKey' | 'host' | 'name'>;

export const InsFormModal: FC<Props> = ({ className = '', children, type = 'create', ins }) => {
  const [visible, setVisible] = useState<boolean>(false);
  const { t } = useTranslation('instance');
  const currentInstance = useCurrentInstance();
  const [instanceFormType] = useState<'create' | 'edit'>(type);
  const [isSubmitInstanceLoading, setIsSubmitInstanceLoading] = useState(false);
  const [instanceEditing] = useState<Instance | undefined>(ins);
  const addInstance = useAppStore((state) => state.addInstance);
  const editInstance = useAppStore((state) => state.editInstance);
  const instances = useAppStore((state) => state.instances);

  const form = useForm<InstanceFormValue>({
    defaultValues: {
      ...defaultInstance,
      host: currentInstance?.host ?? defaultInstance.host,
      apiKey: currentInstance?.apiKey ?? defaultInstance.apiKey,
    },
  });

  const onSubmitInstance = useCallback(
    async (values: InstanceFormValue) => {
      // button loading
      setIsSubmitInstanceLoading(true);
      // normalize host string
      const cfg = {
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
          // close modal
          setVisible(false);
        });
    },
    [instanceFormType, addInstance, editInstance, instanceEditing]
  );

  return (
    <Drawer.Root
      open={visible}
      onOpenChange={(open) => {
        form.reset(ins);
        setVisible(open);
      }}
    >
      <Drawer.Trigger data-state={visible ? 'open' : 'closed'}>{children}</Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className={cn(className, 'bg-zinc-100 rounded-t-6 mt-24 fixed bottom-0 left-0 right-0 z-10')}>
          <form
            className={`flex flex-col gap-y-6 w-full p-4 bg-white flex-1 rounded-t-6`}
            onSubmit={form.handleSubmit(onSubmitInstance)}
          >
            <div bg-zinc-4 rounded-2xl w-15 h-2 self-center></div>
            <p className={`text-center font-semibold text-lg`}>{t(`form.title.${instanceFormType}`)}</p>
            <Input
              label={t('form.name.label')}
              placeholder={t('form.name.placeholder')}
              {...form.register('name', {
                validate: (value: string) => {
                  let otherNames: string[] = [];
                  switch (instanceFormType) {
                    case 'create':
                      otherNames = instances.map((i) => i.name);
                      break;
                    case 'edit':
                      otherNames = instances.map((i) => i.name).filter((n) => n !== instanceEditing!.name);
                      break;
                  }
                  if (otherNames.includes(value)) {
                    form.setError('name', { message: 'Name should be different from others' });
                    return false;
                  } else {
                    return true;
                  }
                },
              })}
            />
            <Tooltip placement={'bottom-start'} content={t('form.host.tip')}>
              <Autocomplete
                label={t('form.host.label')}
                placeholder="http://127.0.0.1:7700"
                isClearable={false}
                {...form.register('host', {
                  validate: (value) => {
                    if (
                      /(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_+.~#?&//=]*)/.test(
                        value
                      )
                    ) {
                      return true;
                    } else {
                      form.setError('host', { message: 'Host not valid' });
                      return false;
                    }
                  },
                })}
              >
                {instances.map((i) => (
                  <AutocompleteItem key={i.host} value={i.host}>
                    {i.host}
                  </AutocompleteItem>
                ))}
              </Autocomplete>
            </Tooltip>
            <Tooltip placement={'bottom-start'} content={t('form.api_key.tip')}>
              <Input
                type="password"
                placeholder="masterKey"
                label={t('form.api_key.label')}
                {...form.register('apiKey')}
              />
            </Tooltip>
            <Button type="submit" variant="solid" size="sm" color="primary" disabled={isSubmitInstanceLoading}>
              {t('confirm')}
            </Button>
            <Footer />
          </form>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
