import { Instance, useAppStore } from '@/src/store';
import _ from 'lodash';
import { toast } from '../utils/toast';
import { useParams } from 'react-router-dom';

export const useCurrentInstance = () => {
  let { insId } = useParams();
  const currentInstance = useAppStore((state) => state.instances.find((i) => i.id === parseInt(insId || '0')));

  if (currentInstance && _.isEmpty(currentInstance)) {
    toast.error('Instance not found 🤥');
    console.debug('useCurrentInstance', 'Instance lost');
    // do not use useNavigate, because maybe in first render
    window.location.assign(import.meta.env.BASE_URL);
  }

  return currentInstance as Instance;
};
