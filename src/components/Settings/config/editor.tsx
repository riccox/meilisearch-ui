import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { hiddenRequestLoader, showRequestLoader } from '@/utils/loader';
import { showTaskSubmitNotification } from '@/utils/text';
import { Settings } from 'meilisearch';
import { IndexSettingConfigComponentProps } from '..';
import MonacoEditor from '@monaco-editor/react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

export const Editor: FC<IndexSettingConfigComponentProps> = ({ client, host, className, toggleLoading }) => {
  const { t } = useTranslation('instance');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editorRef = useRef<any>(null);
  const [isSettingsEditing, setIsSettingsEditing] = useState<boolean>(false);

  const onClickEditSettings = useCallback(() => {
    setIsSettingsEditing(true);
  }, []);
  const [indexSettingDisplayData, setIndexSettingDisplayData] = useState<Settings>({});
  const [indexSettingInputData, setIndexSettingInputData] = useState<Settings>(indexSettingDisplayData);

  const resetSettings = useCallback(
    (data: Settings = {}) => {
      setIsSettingsEditing(false);
      setIndexSettingDisplayData(data);
      if (!isSettingsEditing) {
        setIndexSettingInputData(data);
        editorRef.current?.setValue(JSON.stringify(data, null, 2));
      }
    },
    [isSettingsEditing]
  );

  const querySettings = useQuery({
    queryKey: ['settings', host, client.uid],
    queryFn: async () => {
      showRequestLoader();
      return await client.getSettings();
    },
  });

  useEffect(() => {
    if (querySettings.isSuccess) {
      // change display data when not editing
      !isSettingsEditing && resetSettings(querySettings.data);
    }
    if (!querySettings.isFetching) {
      hiddenRequestLoader();
    }
  }, [isSettingsEditing, querySettings.data, querySettings.isFetching, querySettings.isSuccess, resetSettings]);

  const onSettingJsonEditorUpdate = useCallback(
    (value?: string) => value && setIndexSettingInputData(JSON.parse(value) as Settings),
    [setIndexSettingInputData]
  );

  const settingsMutation = useMutation({
    mutationKey: ['settings', host, client.uid],
    mutationFn: async (variables: Settings) => {
      showRequestLoader();
      return await client.updateSettings(variables);
    },

    onSuccess: (t) => {
      showTaskSubmitNotification(t);
      setTimeout(() => querySettings.refetch(), 450);
    },
    onSettled: () => {
      hiddenRequestLoader();
    },
  });

  const onSaveSettings = useCallback(() => {
    setIsSettingsEditing(false);
    indexSettingInputData && settingsMutation.mutate(indexSettingInputData);
  }, [indexSettingInputData, settingsMutation]);

  useEffect(() => {
    const isLoading = querySettings.isLoading || querySettings.isFetching || settingsMutation.isPending;
    toggleLoading(isLoading);
  }, [querySettings.isFetching, querySettings.isLoading, settingsMutation.isPending, toggleLoading]);

  return useMemo(
    () => (
      <div className={clsx(className, 'p-1')}>
        <div className={`flex items-center gap-4 w-full pb-2`}>
          <p className={`text-lg font-medium`}>JSON {t('setting.index.config.label')}</p>
          {!isSettingsEditing && (
            <button
              className={'btn outline xs primary'}
              onClick={() => {
                onClickEditSettings();
              }}
            >
              {t('edit')}
            </button>
          )}
          {isSettingsEditing && (
            <button
              className={'btn outline xs primary'}
              onClick={() => {
                onSaveSettings();
              }}
            >
              {t('save')}
            </button>
          )}
          {isSettingsEditing && (
            <button
              className={'btn outline xs bw'}
              onClick={() => {
                resetSettings();
              }}
            >
              {t('cancel')}
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
          onMount={(ed) => {
            editorRef.current = ed;
          }}
        ></MonacoEditor>
      </div>
    ),
    [
      className,
      t,
      indexSettingDisplayData,
      isSettingsEditing,
      onClickEditSettings,
      onSaveSettings,
      onSettingJsonEditorUpdate,
      resetSettings,
    ]
  );
};
