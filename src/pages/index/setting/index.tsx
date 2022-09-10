import { useCallback, useMemo, useState } from 'react';
import { useMeiliClient } from '@/src/hooks/useMeiliClient';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button, JsonInput } from '@mantine/core';
import { useAppStore } from '@/src/store';
import { useMutation, useQuery } from 'react-query';
import { hiddenRequestLoader, showRequestLoader } from '@/src/utils/loader';
import { showTaskSubmitNotification, stringifyJsonPretty } from '@/src/utils/text';
import { Settings } from 'meilisearch';

function SettingsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const client = useMeiliClient();

  if (!searchParams.get('index')) {
    navigate('/index');
  }

  const indexClient = useMemo(() => {
    return client.index(searchParams.get('index') ?? '');
  }, [client, searchParams]);

  const host = useAppStore((state) => state.currentInstance?.host);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const onClickEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

  const query = useQuery(
    ['settings', host, indexClient.uid],
    async () => {
      showRequestLoader();
      return await indexClient.getSettings();
    },
    {
      keepPreviousData: true,
      refetchOnMount: 'always',
      refetchInterval: 3000,
      onSuccess: () => {
        // change display data when not editing
        !isEditing && reset();
      },
      onSettled: () => {
        hiddenRequestLoader();
      },
    }
  );
  const [displayData, setDisplayData] = useState<Settings>();

  const reset = useCallback(() => {
    setIsEditing(false);
    setDisplayData(query.data);
  }, [query.data]);

  const mutation = useMutation(
    ['settings', host, indexClient.uid],
    async (variables: Settings) => {
      showRequestLoader();
      return await indexClient.updateSettings(variables);
    },
    {
      onSuccess: (t) => {
        showTaskSubmitNotification(t);
      },
      onSettled: () => {
        hiddenRequestLoader();
      },
    }
  );

  const onSave = useCallback(() => {
    setIsEditing(false);
    displayData && mutation.mutate(displayData);
  }, [displayData, mutation]);

  return useMemo(
    () => (
      <div
        className={`overflow-hidden fill bg-background-light 
        flex flex-col items-stretch
        p-6 rounded-3xl gap-y-4`}
      >
        <div className={`flex justify-between items-center gap-x-6`}>
          <div className={`font-extrabold text-3xl`}>🛠️ Settings</div>
        </div>
        <div className={`flex-1 px-4 py-2 overflow-scroll`}>
          <JsonInput
            className={`h-fit `}
            labelProps={{
              style: {
                width: '100%',
              },
            }}
            label={
              <div className={`flex justify-end items-center gap-x-2 w-full py-1`}>
                <p className={`mr-auto`}>Index Settings</p>
                <Button
                  hidden={isEditing}
                  variant="light"
                  color={'brand'}
                  onClick={() => {
                    onClickEdit();
                  }}
                >
                  Edit
                </Button>
                <Button
                  hidden={!isEditing}
                  variant="light"
                  color={'brand'}
                  onClick={() => {
                    onSave();
                  }}
                >
                  Save
                </Button>
                <Button
                  hidden={!isEditing}
                  variant="light"
                  color={'gray'}
                  onClick={() => {
                    reset();
                  }}
                >
                  Cancel
                </Button>
              </div>
            }
            radius="md"
            size="md"
            validationError="Invalid setting object"
            formatOnBlur
            autosize
            value={stringifyJsonPretty(displayData)}
            onChange={(e) => setDisplayData(JSON.parse(e) as Settings)}
            disabled={!isEditing}
          />
        </div>
      </div>
    ),
    [displayData, isEditing, onClickEdit, onSave, reset]
  );
}

export default SettingsPage;
