import { useMutation, useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { Synonyms as TSynonyms } from 'meilisearch';
import { FC, useCallback, useEffect, useMemo, useReducer } from 'react';
import { IndexSettingConfigComponentProps } from '../..';
import _ from 'lodash';
import { IconCircleMinus, IconEdit, IconPlus } from '@tabler/icons-react';
import { openConfirmModal } from '@mantine/modals';
import { Controller, useForm } from 'react-hook-form';

type State = {
  // add or update synonyms modal state
  isSynonymsMutationModalShow: boolean;
  // add or update synonyms modal type
  synonymsMutationType: 'add' | 'update';
  // the updating synonyms Key
  updatingSynonymsKey?: string;
  // add single synonyms word modal
  isMutateSynonymsWordModalShow: boolean;
  // added single synonyms word
  mutatingSynonymsWord: string;
};

type SynonymsMutationForm = {
  synonyms: string;
  synonymsWords: string[];
};

export const Synonyms: FC<IndexSettingConfigComponentProps> = ({ client, className, host, toggleLoading }) => {
  const [state, updateState] = useReducer((prev: State, curr: Partial<State>) => ({ ...prev, ...curr }), {
    isSynonymsMutationModalShow: false,
    synonymsMutationType: 'add',
    isMutateSynonymsWordModalShow: false,
    mutatingSynonymsWord: '',
  });

  const query = useQuery({
    queryKey: ['getSynonyms', host, client.uid],
    refetchInterval: 4500,
    async queryFn(ctx) {
      return (await client.getSynonyms()) as TSynonyms;
    },
  });

  const synonymsKeys = useMemo(() => Object.keys(query.data ?? {}), [query.data]);

  const mutation = useMutation({
    mutationKey: ['updateSynonyms', host, client.uid],
    async mutationFn(variables: TSynonyms) {
      console.debug('🚀 ~ file: synonyms.tsx:19 ~ mutationFn ~ variables:', variables);
      if (_.isEmpty(variables)) {
        // empty to reset
        return await client.resetSynonyms();
      }
      return await client.updateSynonyms(variables);
    },
  });

  useEffect(() => {
    const isLoading = query.isLoading || query.isFetching || mutation.isLoading;
    toggleLoading(isLoading);
  }, [mutation.isLoading, query.isFetching, query.isLoading, toggleLoading]);

  const synonymsMutationForm = useForm<SynonymsMutationForm>({
    defaultValues: {
      synonyms: '',
      synonymsWords: [],
    },
  });

  const onClickItemDel = useCallback(
    (key: string) => {
      console.debug('🚀 ~ file: Synonyms onClickItemDel', key);

      openConfirmModal({
        title: 'Remove this synonyms',
        centered: true,
        children: <p>Are you sure you want to remove "{key}" ?</p>,
        labels: { confirm: 'Remove', cancel: 'Cancel' },
        confirmProps: { color: 'red' },
        onConfirm: async () => {
          const updated = _.omit(query.data, [key]);
          mutation.mutate(updated);
        },
      });
    },
    [mutation, query.data]
  );

  const onSubmitSynonymsMutation = synonymsMutationForm.handleSubmit((data) => {
    const updated = { ...query.data, [data.synonyms]: data.synonymsWords };
    if (state.updatingSynonymsKey && state.updatingSynonymsKey !== data.synonyms) {
      // means that is updating the synonyms key.
      // @ts-ignore // do not use delete to remove old key because that will create a slow object.
      updated[state.updatingSynonymsKey] = undefined;
    }
    console.debug('🚀 ~ file: synonyms.tsx ~ onSubmitSynonymsMutation ~ data:', data, updated);
    mutation.mutateAsync(updated).then(() => {
      // close modal
      toggleSynonymsMutationModal(false);
    });
  });

  const toggleSynonymsMutationModal = useCallback(
    (show: boolean, updating?: SynonymsMutationForm) => {
      updateState({
        isSynonymsMutationModalShow: show,
        synonymsMutationType: updating ? 'update' : 'add',
        // for tag editing synonyms
        updatingSynonymsKey: updating ? updating.synonyms : undefined,
      });
      synonymsMutationForm.reset(updating);
    },
    [synonymsMutationForm]
  );

  const toggleSynonymsWordMutationModal = useCallback((show: boolean) => {
    updateState({ isMutateSynonymsWordModalShow: show, mutatingSynonymsWord: '' });
  }, []);

  return useMemo(
    () => (
      <div className={clsx(className)}>
        <h2 className="font-semibold">Synonyms</h2>
        <span className="text-sm flex gap-2">
          <p>
            The synonyms object contains words and their respective synonyms. A synonym in Meilisearch is considered
            equal to its associated word for the purposes of calculating search results.
          </p>
          <a
            className="link info text-info-800"
            href="https://docs.meilisearch.com/learn/configuration/synonyms.html"
            target={'_blank'}
            rel="noreferrer"
          >
            Learn more
          </a>
        </span>
        <div className={clsx('flex flex-col gap-2')}>
          {synonymsKeys.map((key) => (
            <div
              key={key}
              className="w-full flex justify-center items-center gap-2 p-2 bg-primary-200 text-primary-1000 rounded-xl"
            >
              <p className="flex-1 text-left">{`${key}: ${(query.data?.[key] as string[]).join(',')}`}</p>
              <button
                className={clsx('ml-auto')}
                onClick={() =>
                  toggleSynonymsMutationModal(true, {
                    synonyms: key,
                    synonymsWords: query.data?.[key] || [],
                  })
                }
              >
                <IconEdit />
              </button>
              <button className={clsx('')} onClick={() => onClickItemDel(key)}>
                <IconCircleMinus />
              </button>
            </div>
          ))}
          <label className="modal-overlay"></label>
          <form className={clsx(state.isSynonymsMutationModalShow && 'show', 'modal flex flex-col gap-5 pause-scroll')}>
            <button
              className="absolute right-4 top-3"
              onClick={(e) => {
                e.preventDefault();
                toggleSynonymsMutationModal(false);
              }}
            >
              ✕
            </button>
            <h2 className="text-xl">{state.synonymsMutationType === 'add' ? 'Add Synonyms' : 'Update Synonyms'}</h2>
            <label className="grid gap-2">
              Synonyms Key
              <input
                className="input outline secondary"
                {...synonymsMutationForm.register('synonyms', { required: true })}
              />
            </label>
            <Controller
              name="synonymsWords"
              control={synonymsMutationForm.control}
              render={({ field }) => (
                <div className="flex flex-wrap items-center gap-2">
                  {(field.value || []).map((value) => (
                    <span className="tooltip bw top" data-tooltip="Click to remove">
                      <span
                        key={value}
                        className="badge solid secondary cursor-pointer items-center"
                        onClick={(e) => {
                          e.preventDefault();
                          // remove this synonyms value
                          field.onChange(_.without([...field.value], value));
                        }}
                      >
                        {value}
                      </span>
                    </span>
                  ))}
                  <span
                    className="cursor-pointer flex items-center hover:opacity-70"
                    onClick={() => {
                      toggleSynonymsWordMutationModal(true);
                    }}
                  >
                    <IconPlus />
                    Add a word
                  </span>
                  <label className="modal-overlay !h-full"></label>
                  <div
                    className={clsx(
                      state.isMutateSynonymsWordModalShow && 'show',
                      'z-[70] modal has-shadow flex flex-col gap-5 pause-scroll',
                      '!w-fit'
                    )}
                  >
                    <button
                      className="absolute right-4 top-3"
                      onClick={(e) => {
                        e.preventDefault();
                        toggleSynonymsWordMutationModal(false);
                      }}
                    >
                      ✕
                    </button>
                    <h2 className="text-xl">Add Synonyms Word</h2>
                    <input
                      className="input outline primary"
                      value={state.mutatingSynonymsWord}
                      onChange={(ev) => updateState({ mutatingSynonymsWord: ev.currentTarget.value })}
                    ></input>
                    <div className="flex gap-3">
                      <button
                        className="btn solid info flex-1"
                        onClick={(e) => {
                          e.preventDefault();
                          // add new synonyms value
                          const updated = field.value.concat(state.mutatingSynonymsWord);
                          console.debug('🚀 ~ file: synonyms.tsx:208 ~ updated:', updated);
                          field.onChange(updated);
                          // close modal , do not use toggleSynonymsWordMutationModal(false) cause will clear form.
                          updateState({ isMutateSynonymsWordModalShow: false });
                        }}
                      >
                        Confirm
                      </button>
                      <button
                        className="btn solid bw flex-1"
                        onClick={(e) => {
                          e.preventDefault();
                          toggleSynonymsWordMutationModal(false);
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            />
            <div className="flex gap-3">
              <button
                className={clsx('btn solid success flex-1', mutation.isLoading && 'is-loading')}
                onClick={(e) => {
                  e.preventDefault();
                  onSubmitSynonymsMutation();
                }}
              >
                Submit
              </button>
              <button
                className="btn solid bw flex-1"
                onClick={(e) => {
                  e.preventDefault();
                  toggleSynonymsMutationModal(false);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
          <button className={clsx('btn primary outline w-full')} onClick={() => toggleSynonymsMutationModal(true)}>
            <IconPlus />
          </button>
        </div>
      </div>
    ),
    [
      className,
      synonymsKeys,
      state.isSynonymsMutationModalShow,
      state.synonymsMutationType,
      state.isMutateSynonymsWordModalShow,
      state.mutatingSynonymsWord,
      synonymsMutationForm,
      mutation.isLoading,
      query.data,
      toggleSynonymsMutationModal,
      onClickItemDel,
      toggleSynonymsWordMutationModal,
      onSubmitSynonymsMutation,
    ]
  );
};
