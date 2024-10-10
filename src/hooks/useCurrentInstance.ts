import { Instance, useAppStore } from '@/store';
import _ from 'lodash';
import { toast } from '../utils/toast';
import { useParams } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { getSingletonCfg, isSingletonMode } from '@/utils/conn';

export const useCurrentInstance = () => {
  const { t } = useTranslation('instance');
  const { insID } = useParams({ strict: false }) as { insID: string };
  const currentInstance = useAppStore((state) => state.instances.find((i) => i.id === parseInt(insID || '1')));
  const setWarningPageData = useAppStore((state) => state.setWarningPageData);

  if (!isSingletonMode()) {
    if (currentInstance && _.isEmpty(currentInstance)) {
      toast.error(`${t('not_found')} 🤥`);
      console.debug('useCurrentInstance', 'Instance lost');
      // do not use useNavigate, because maybe in first render
      window.location.assign(import.meta.env.BASE_URL ?? '/');
    }
    return currentInstance as Instance;
  } else {
    const currentInstance = getSingletonCfg();
    if (!currentInstance) {
      toast.error(`${t('not_found')} 🤥`);
      console.debug('useCurrentInstance', 'Singleton Instance lost');
      setWarningPageData({ prompt: t('instance:singleton_cfg_not_found') });
      // do not use useNavigate, because maybe in first render
      if (import.meta.env.BASE_URL !== '/') {
        window.location.assign((import.meta.env.BASE_URL || '') + '/warning');
      } else {
        window.location.assign('/warning');
      }
    }
    return currentInstance as Instance;
  }
};
