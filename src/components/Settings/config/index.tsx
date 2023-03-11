import { FC, useMemo, useState } from 'react';
import { IndexSettingComponentProps } from '..';
import clsx from 'clsx';
import { Editor } from './editor';
import { FilterableAttributes } from './detail/filterableAttributes';
import { DistinctAttribute } from './detail/distinctAttribute';
import { SortableAttributes } from './detail/sortableAttributes';
import { SearchableAttributes } from './detail/searchableAttributes';
import { DisplayedAttributes } from './detail/displayedAttributes';
import { RankingRules } from './detail/rankingRules';
import { StopWords } from './detail/stopWords';
import { Synonyms } from './detail/synonyms';
import { TypoTolerance } from './detail/typoTolerance';
import { Faceting } from './detail/faceting';
import { Pagination } from './detail/pagination';

const tabs = [
  'Filterable Attributes',
  'Distinct Attribute',
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
              className={clsx('tab px-3 !py-1 !min-h-0 !h-fit', inputType === 'visualization' && 'active')}
              onClick={() => setInputType('visualization')}
            >
              Visualization
            </div>
            <div
              className={clsx('tab px-3 !py-1 !min-h-0 !h-fit', inputType === 'json' && 'active')}
              onClick={() => setInputType('json')}
            >
              JSON
            </div>
          </div>
        </div>
        <div className={clsx('flex flex-nowrap', inputType !== 'visualization' && 'hidden')}>
          <div className="tabs ghost primary left border-r-2 border-color-400">
            {tabs.map((tab, i) => (
              <div
                key={tab}
                className={clsx('tab !p-4 w-full', selectTab === i && 'active bordered')}
                onClick={() => setSelectTab(i)}
              >
                {tab}
              </div>
            ))}
          </div>
          <div className="flex-1 flex">
            <FilterableAttributes
              className={clsx(selectTab !== 0 && 'hidden', 'flex-1 flex flex-col gap-2 p-2 overflow-scroll')}
              {...{ client, host, toggleLoading }}
            />
            <DistinctAttribute
              className={clsx(selectTab !== 1 && 'hidden', 'flex-1 flex flex-col gap-2 p-2 overflow-scroll')}
              {...{ client, host, toggleLoading }}
            />
            <SortableAttributes
              className={clsx(selectTab !== 2 && 'hidden', 'flex-1 flex flex-col gap-2 p-2 overflow-scroll')}
              {...{ client, host, toggleLoading }}
            />
            <SearchableAttributes
              className={clsx(selectTab !== 3 && 'hidden', 'flex-1 flex flex-col gap-2 p-2 overflow-scroll')}
              {...{ client, host, toggleLoading }}
            />
            <DisplayedAttributes
              className={clsx(selectTab !== 4 && 'hidden', 'flex-1 flex flex-col gap-2 p-2 overflow-scroll')}
              {...{ client, host, toggleLoading }}
            />
            <RankingRules
              className={clsx(selectTab !== 5 && 'hidden', 'flex-1 flex flex-col gap-2 p-2 overflow-scroll')}
              {...{ client, host, toggleLoading }}
            />
            <StopWords
              className={clsx(selectTab !== 6 && 'hidden', 'flex-1 flex flex-col gap-2 p-2 overflow-scroll')}
              {...{ client, host, toggleLoading }}
            />
            <Synonyms
              className={clsx(selectTab !== 7 && 'hidden', 'flex-1 flex flex-col gap-2 p-2 overflow-scroll')}
              {...{ client, host, toggleLoading }}
            />
            <TypoTolerance
              className={clsx(selectTab !== 8 && 'hidden', 'flex-1 flex flex-col gap-2 p-2 overflow-scroll')}
              {...{ client, host, toggleLoading }}
            />
            <Faceting
              className={clsx(selectTab !== 9 && 'hidden', 'flex-1 flex flex-col gap-2 p-2 overflow-scroll')}
              {...{ client, host, toggleLoading }}
            />
            <Pagination
              className={clsx(selectTab !== 10 && 'hidden', 'flex-1 flex flex-col gap-2 p-2 overflow-scroll')}
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
