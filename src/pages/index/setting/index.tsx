import './index.css';
import { useCallback, useMemo, useState } from 'react';
import { useMeiliClient } from '@/src/hooks/useMeiliClient';
import { useNavigate, useOutletContext, useSearchParams } from 'react-router-dom';
import { ActionIcon, Button, JsonInput, Modal, Paper, Text, TextInput, Tooltip } from '@mantine/core';
import { useAppStore } from '@/src/store';
import { useMutation, useQuery } from 'react-query';
import { hiddenRequestLoader, showRequestLoader } from '@/src/utils/loader';
import { getTimeText, showTaskSubmitNotification, stringifyJsonPretty } from '@/src/utils/text';
import { IndexObject, IndexOptions, Settings } from 'meilisearch';
import { IconPencilMinus } from '@tabler/icons';
import { useForm } from '@mantine/form';
import { openConfirmModal } from '@mantine/modals';

function SettingsPage() {
  const outletContext = useOutletContext<{ refreshIndexes: () => void }>();

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
  const [isSettingsEditing, setIsSettingsEditing] = useState<boolean>(false);
  const [isRawInfoEditing, setIsRawInfoEditing] = useState<boolean>(false);

  const onClickEditSettings = useCallback(() => {
    setIsSettingsEditing(true);
  }, []);
  const onClickEditPrimaryKey = useCallback(() => {
    setIsRawInfoEditing(true);
  }, []);

  const querySettings = useQuery(
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
        !isSettingsEditing && resetSettings();
      },
      onSettled: () => {
        hiddenRequestLoader();
      },
    }
  );
  const [indexSettingDisplayData, setIndexSettingDisplayData] = useState<Settings>();

  const queryRawInfo = useQuery(
    ['rawInfo', host, indexClient.uid],
    async () => {
      showRequestLoader();
      return await indexClient.getRawInfo();
    },
    {
      keepPreviousData: true,
      refetchOnMount: 'always',
      refetchInterval: 3000,
      onSuccess: () => {
        // change display data when not editing
        !isRawInfoEditing && resetRawInfo();
      },
      onSettled: () => {
        hiddenRequestLoader();
      },
    }
  );
  const [indexRawInfoDisplayData, setIndexRawInfoDisplayData] = useState<IndexObject>();

  const resetSettings = useCallback(() => {
    setIsSettingsEditing(false);
    setIndexSettingDisplayData(querySettings.data);
  }, [querySettings.data]);

  const resetRawInfo = useCallback(() => {
    setIsRawInfoEditing(false);
    setIndexRawInfoDisplayData(queryRawInfo.data);
  }, [queryRawInfo.data]);

  const settingsMutation = useMutation(
    ['settings', host, indexClient.uid],
    async (variables: Settings) => {
      showRequestLoader();
      return await indexClient.updateSettings(variables);
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

  const rawInfoMutation = useMutation(
    ['rawInfo', host, indexClient.uid],
    async (variables: IndexOptions) => {
      showRequestLoader();
      return await indexClient.update(variables);
    },
    {
      onSuccess: (t) => {
        showTaskSubmitNotification(t);
        setTimeout(() => queryRawInfo.refetch(), 450);
      },
      onSettled: () => {
        hiddenRequestLoader();
      },
    }
  );

  const onSaveSettings = useCallback(() => {
    setIsSettingsEditing(false);
    indexSettingDisplayData && settingsMutation.mutate(indexSettingDisplayData);
  }, [indexSettingDisplayData, settingsMutation]);

  const editRawInfoForm = useForm({
    initialValues: {
      primaryKey: indexRawInfoDisplayData?.primaryKey,
    },
    validate: {
      primaryKey: (value: string) => (/[a-zA-Z\d-_]+/.test(value) ? null : 'Invalid primary key'),
    },
  });

  const onSubmitEditRawInfoUpdate = useCallback(
    async (values: typeof editRawInfoForm.values) => {
      setIsRawInfoEditing(false);
      values && rawInfoMutation.mutate(values);
    },
    [editRawInfoForm, rawInfoMutation]
  );

  const delIndexMutation = useMutation(
    ['delIndex', host, indexClient.uid],
    async () => {
      showRequestLoader();
      return await indexClient.delete();
    },
    {
      onSuccess: (t) => {
        showTaskSubmitNotification(t);
        outletContext.refreshIndexes();
        navigate('/index');
      },
      onSettled: () => {
        hiddenRequestLoader();
      },
    }
  );

  const onClickDeleteIndex = useCallback(async () => {
    openConfirmModal({
      title: 'Please confirm your action',
      children: (
        <Text size="sm">
          You are deleting index <strong>{indexClient.uid}</strong>. <br />
          This action is so important that you are required to confirm it.
          <br />
          Please click one of these buttons to proceed.
        </Text>
      ),
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      confirmProps: {
        color: 'danger',
      },
      onConfirm: () => delIndexMutation.mutate(),
    });
  }, [delIndexMutation, indexClient.uid]);

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
        <div className={`flex-1 flex flex-col gap-2 px-4 py-2 overflow-scroll`}>
          <p className={`text-xl font-bold font-sans`}>Index Info</p>
          <Paper radius="md" p="lg" withBorder>
            <div className={`index-properties grid grid-cols-6 gap-2`}>
              <p className={`cell`}>Index UID</p>
              <p className={`cell`}>{indexRawInfoDisplayData?.uid}</p>
              <p className={`cell`}>Primary Key</p>
              <div className={`cell flex items-center gap-x-1`}>
                {indexRawInfoDisplayData?.primaryKey || '-'}
                <ActionIcon onClick={onClickEditPrimaryKey}>
                  <IconPencilMinus size={18} />
                </ActionIcon>
              </div>
              <p className={`cell`}>Created At</p>
              <p className={`cell`}>{getTimeText(indexRawInfoDisplayData?.createdAt)}</p>
              <p className={`cell`}>Updated At</p>
              <p className={`cell`}>{getTimeText(indexRawInfoDisplayData?.updatedAt)}</p>
            </div>
          </Paper>
          <JsonInput
            className={`h-fit`}
            labelProps={{
              style: {
                width: '100%',
              },
            }}
            label={
              <div className={`flex justify-end items-center gap-x-2 w-full py-1`}>
                <p className={`mr-auto text-xl font-bold font-sans`}>Index Settings</p>
                <Button
                  size={'xs'}
                  hidden={isSettingsEditing}
                  variant="light"
                  color={'brand'}
                  onClick={() => {
                    onClickEditSettings();
                  }}
                >
                  Edit
                </Button>
                <Button
                  size={'xs'}
                  hidden={!isSettingsEditing}
                  variant="light"
                  color={'brand'}
                  onClick={() => {
                    onSaveSettings();
                  }}
                >
                  Save
                </Button>
                <Button
                  size={'xs'}
                  hidden={!isSettingsEditing}
                  variant="light"
                  color={'gray'}
                  onClick={() => {
                    resetSettings();
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
            value={stringifyJsonPretty(indexSettingDisplayData)}
            onChange={(e) => setIndexSettingDisplayData(JSON.parse(e) as Settings)}
            disabled={!isSettingsEditing}
          />
          <Paper radius="md" p="lg" withBorder className={`!bg-opacity-50 !bg-danger-1`}>
            <div className={`flex flex-col items-start gap-4`}>
              <p className={`text-danger-7 text-xl font-bold font-sans`}>Danger Zone</p>
              <Button color={'danger'} onClick={onClickDeleteIndex}>
                Delete This Index
              </Button>
            </div>
          </Paper>
        </div>
        <Modal
          opened={isRawInfoEditing}
          onClose={() => setIsRawInfoEditing(false)}
          centered
          lockScroll
          radius="lg"
          shadow="xl"
          overlayOpacity={0.3}
          padding="xl"
          withCloseButton={true}
          title={<p className={`font-bold text-lg`}>Edit Primary Key</p>}
        >
          <form
            className={`flex flex-col gap-y-6 w-full `}
            onSubmit={editRawInfoForm.onSubmit(onSubmitEditRawInfoUpdate)}
          >
            <Tooltip
              position={'bottom-start'}
              label="NOTE: Primary key cannot be changed while documents are present in the index."
            >
              <TextInput
                autoFocus
                radius="md"
                size={'lg'}
                label={<p className={'text-brand-5 pb-2 text-lg'}>Name</p>}
                placeholder="field must be present in all documents"
                {...editRawInfoForm.getInputProps('primaryKey')}
              />
            </Tooltip>
            <Button
              type="submit"
              radius={'xl'}
              size={'lg'}
              variant="light"
              // submit only value changed
              disabled={editRawInfoForm.values.primaryKey === indexRawInfoDisplayData?.primaryKey}
            >
              Submit
            </Button>
            <div>
              <Text
                variant="link"
                component="a"
                color="gray"
                size="sm"
                href="//docs.meilisearch.com/learn/core_concepts/primary_key.html#primary-key"
              >
                🔎 Look up official docs about primary-key
              </Text>
            </div>
          </form>
        </Modal>
      </div>
    ),
    [
      editRawInfoForm,
      indexRawInfoDisplayData?.createdAt,
      indexRawInfoDisplayData?.primaryKey,
      indexRawInfoDisplayData?.uid,
      indexRawInfoDisplayData?.updatedAt,
      indexSettingDisplayData,
      isRawInfoEditing,
      isSettingsEditing,
      onClickDeleteIndex,
      onClickEditPrimaryKey,
      onClickEditSettings,
      onSaveSettings,
      onSubmitEditRawInfoUpdate,
      resetSettings,
    ]
  );
}

export default SettingsPage;
