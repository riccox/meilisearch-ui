import { DocumentList } from '@/src/components/Document/list';
import { MultiSearchQueries } from '@/src/components/Document/multi-search/queries';
import { EmptyArea } from '@/src/components/EmptyArea';
import { Header } from '@/src/components/Header';
import { useCurrentInstance } from '@/src/hooks/useCurrentInstance';
import { useMeiliClient } from '@/src/hooks/useMeiliClient';
import { useQuery } from '@tanstack/react-query';
import { MultiSearchQuery, MultiSearchResult } from 'meilisearch';
import { useMemo, useReducer } from 'react';

type DocList = (MultiSearchResult<Record<string, any>> & { primaryKey?: string })[];

type State = {
  queries: MultiSearchQuery[];
  queriesEditorShow: boolean;
};

export const MultiIndexSearch = () => {
  const currentInstance = useCurrentInstance();
  const host = currentInstance?.host;
  const client = useMeiliClient();

  const [state, updateState] = useReducer(
    (prev: State, next: Partial<State>) => {
      return { ...prev, ...next };
    },
    { queries: [], queriesEditorShow: false }
  );

  const query = useQuery<unknown, unknown, DocList>({
    queryKey: [
      'multiSearchDocuments',
      host,
      // dependencies for the search refresh
      state.queries,
    ],
    queryFn: async () => {
      try {
        const data: DocList = (await client!.multiSearch({ queries: state.queries })).results;

        if (data.length > 0) {
          for (let i in data) {
            data[i] = {
              ...data[i],
              primaryKey: (await client.index(data[i].indexUid).getRawInfo())!.primaryKey,
            };
          }
        }
        return data || [];
      } catch (err) {
        return [];
      }
    },
    enabled: !!client,
  });

  return useMemo(
    () => (
      <div className="bg-mount full-page items-stretch p-5 gap-4">
        <Header client={client} />
        <div
          className={`flex-1 overflow-hidden bg-background-light 
        flex flex-col justify-start items-stretch
        p-6 rounded-3xl gap-y-2`}
        >
          <div className={`flex justify-between items-center gap-x-6`}>
            <div className={`font-extrabold text-xl`}>🌿 Multi Search</div>
            <button className="btn light info" onClick={() => updateState({ queriesEditorShow: true })}>
              Queries
            </button>
          </div>
          <MultiSearchQueries
            show={state.queriesEditorShow}
            toggle={(show) => updateState({ queriesEditorShow: show })}
          />
          <div className={`flex-1 flex flex-col gap-4 overflow-scroll`}>
            {state.queries.length > 0 ? (
              <DocumentList
                // @ts-ignore
                docs={query.data?.reduce((prev, curr) => {
                  return [
                    ...prev,
                    ...curr.hits.map((i) => ({
                      indexId: curr.indexUid,
                      content: i,
                      primaryKey: curr.primaryKey,
                    })),
                  ];
                }, [])}
                refetchDocs={query.refetch}
              />
            ) : (
              <EmptyArea text={'Empty results on current queries, try click button on top right to edit queries'} />
            )}
          </div>
        </div>
      </div>
    ),
    [client, query.data, query.refetch, state.queries.length, state.queriesEditorShow]
  );
};
