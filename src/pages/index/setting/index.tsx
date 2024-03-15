import { useMemo } from 'react';
import { useMeiliClient } from '@/hooks/useMeiliClient';
import { useNavigate, useOutletContext, useParams } from '@tanstack/react-router';
import { BaseInfo } from '@/components/Settings/baseInfo';
import { DangerZone } from '@/components/Settings/dangerZone';
import { IndexConfiguration } from '@/components/Settings/config';
import { useCurrentInstance } from '@/hooks/useCurrentInstance';
import { useTranslation } from 'react-i18next';

function SettingsPage() {
  const outletContext = useOutletContext<{ refreshIndexes: () => void }>();

  const { t } = useTranslation();
  const currentInstance = useCurrentInstance();
  const { indexId } = useParams();
  const navigate = useNavigate();
  const client = useMeiliClient();

  if (!indexId) {
    navigate(`/ins/${currentInstance.id}/index`);
  }

  const indexClient = useMemo(() => {
    return client.index(indexId ?? '');
  }, [client, indexId]);

  const host = currentInstance?.host;
  return useMemo(
    () => (
      <div
        className={`overflow-hidden fill bg-background-light 
        flex flex-col items-stretch
        p-6 rounded-3xl gap-y-4`}
      >
        <div className={`flex justify-between items-center gap-x-6`}>
          <div className={`font-extrabold text-3xl`}>🛠️ {t('settings')}</div>
        </div>
        <div className={`flex-1 flex flex-col gap-2 px-4 py-2 overflow-scroll`}>
          <BaseInfo {...{ host, client: indexClient }} />
          <IndexConfiguration {...{ host, client: indexClient }} />
          <DangerZone refreshIndexes={outletContext.refreshIndexes} {...{ host, client: indexClient }} />
        </div>
      </div>
    ),
    [host, indexClient, outletContext.refreshIndexes, t]
  );
}

export default SettingsPage;
