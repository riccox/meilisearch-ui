import { FC, useCallback, useMemo, useState } from 'react';
import { IndexSettingComponentProps } from '..';
import clsx from 'clsx';
import { Editor } from './editor';
import { FilterableAttributes } from './detail/filterableAttributes';

const tabs = [
  'Filterable Attributes',
  'Distinct Attributes',
  'Sortable Attributes',
  'Searchable Attributes',
  'Displayed Attributes',
  'Ranking Rules',
  'Stop Words',
  'Synonyms',
  'Typo Tolerance',
  'Faceting',
  'Pagination',
];

export const IndexConfiguration: FC<IndexSettingComponentProps> = ({ host, client }) => {
  const [inputType, setInputType] = useState<'visualization' | 'json'>('visualization');
  const [selectTab, setSelectTab] = useState<number>(0);
  const [isLoading, toggleLoading] = useState<boolean>(false);

  return useMemo(
    () => (
      <div className="has-border bg-bw-50 py-2 px-3 rounded-lg font-sans">
        <div className={`flex justify-between items-center gap-x-2 w-full py-1`}>
          <p className={`text-xl font-bold font-sans`}>Index Configuration</p>
          <div className={clsx('loader bw xs opacity-70', !isLoading && '!hidden')}>
            <div className="spin" />
          </div>
          <div className="ml-auto tabs boxed bw pill">
            <div
              className={clsx('tab px-3 !py-1 min-h-0 h-fit', inputType === 'visualization' && 'active')}
              onClick={() => setInputType('visualization')}
            >
              Visualization
            </div>
            <div
              className={clsx('tab px-3 !py-1 min-h-0 h-fit', inputType === 'json' && 'active')}
              onClick={() => setInputType('json')}
            >
              JSON
            </div>
          </div>
        </div>
        <div className={clsx('flex flex-nowrap', inputType !== 'visualization' && 'hidden')}>
          <div className="tabs bordered primary left">
            {tabs.map((tab, i) => (
              <div key={tab} className={clsx('tab p-4', selectTab === i && 'active')} onClick={() => setSelectTab(i)}>
                {tab}
              </div>
            ))}
          </div>
          <div className="flex-1 flex">
            <FilterableAttributes
              className={clsx(selectTab !== 0 && 'hidden', 'flex-1 flex flex-col gap-2 p-2')}
              {...{ client, host, toggleLoading }}
            />
          </div>
        </div>
        <Editor className={clsx(inputType !== 'json' && 'hidden')} {...{ host, client, toggleLoading }} />
      </div>
    ),
    [client, host, inputType, isLoading, selectTab, toggleLoading]
  );
};
