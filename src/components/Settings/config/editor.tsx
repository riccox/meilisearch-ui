import { FC, useCallback, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { hiddenRequestLoader, showRequestLoader } from '@/src/utils/loader';
import { showTaskSubmitNotification } from '@/src/utils/text';
import { Settings } from 'meilisearch';
import { IndexSettingComponentProps } from '..';
import MonacoEditor from '@monaco-editor/react';
import clsx from 'clsx';

export const Editor: FC<IndexSettingComponentProps> = ({ client, host, className }) => {
  const [isSettingsEditing, setIsSettingsEditing] = useState<boolean>(false);

  const onClickEditSettings = useCallback(() => {
    setIsSettingsEditing(true);
  }, []);
  const [indexSettingDisplayData, setIndexSettingDisplayData] = useState<Settings>({});
  const [indexSettingInputData, setIndexSettingInputData] = useState<Settings>(indexSettingDisplayData);

  const resetSettings = useCallback(
    (data?: Settings) => {
      setIsSettingsEditing(false);
      setIndexSettingDisplayData(data || {});
      !isSettingsEditing && setIndexSettingInputData(data || {});
    },
    [isSettingsEditing]
  );

  const querySettings = useQuery(
    ['settings', host, client.uid],
    async () => {
      showRequestLoader();
      return await client.getSettings();
    },
    {
      keepPreviousData: true,
      refetchOnMount: 'always',
      onSuccess: (data) => {
        // change display data when not editing
        !isSettingsEditing && resetSettings(data);
      },
      onSettled: () => {
        hiddenRequestLoader();
      },
    }
  );
  const onSettingJsonEditorUpdate = useCallback(
    (value?: string) => value && setIndexSettingInputData(JSON.parse(value) as Settings),
    [setIndexSettingInputData]
  );

  const settingsMutation = useMutation(
    ['settings', host, client.uid],
    async (variables: Settings) => {
      showRequestLoader();
      return await client.updateSettings(variables);
    },
    {
      onSuccess: (t) => {
        showTaskSubmitNotification(t);
        setTimeout(() => querySettings.refetch(), 450);
      },
      onSettled: () => {
        hiddenRequestLoader();
      },
    }
  );

  const onSaveSettings = useCallback(() => {
    setIsSettingsEditing(false);
    indexSettingInputData && settingsMutation.mutate(indexSettingInputData);
  }, [indexSettingInputData, settingsMutation]);

  return useMemo(
    () => (
      <div className={clsx(className, 'p-1')}>
        <div className={`flex items-center gap-4 w-full pb-2`}>
          <p className={`text-lg font-medium`}>Configuration JSON</p>
          {!isSettingsEditing && (
            <button
              className={'btn outline xs primary'}
              onClick={() => {
                onClickEditSettings();
              }}
            >
              Edit
            </button>
          )}
          {isSettingsEditing && (
            <button
              className={'btn outline xs primary'}
              onClick={() => {
                onSaveSettings();
              }}
            >
              Save
            </button>
          )}
          {isSettingsEditing && (
            <button
              className={'btn outline xs bw'}
              onClick={() => {
                resetSettings();
              }}
            >
              Cancel
            </button>
          )}
        </div>
        <MonacoEditor
          language="json"
          className={clsx('h-[30rem]', !isSettingsEditing && 'opacity-50')}
          defaultValue={JSON.stringify(indexSettingDisplayData, null, 2)}
          options={{
            automaticLayout: true,
            lineDecorationsWidth: 1,
            readOnly: !isSettingsEditing,
          }}
          onChange={onSettingJsonEditorUpdate}
        ></MonacoEditor>
      </div>
    ),
    [
      className,
      indexSettingDisplayData,
      isSettingsEditing,
      onClickEditSettings,
      onSaveSettings,
      onSettingJsonEditorUpdate,
      resetSettings,
    ]
  );
};
