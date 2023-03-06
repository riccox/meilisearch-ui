import { FC, useMemo, useState } from 'react';
import { IndexSettingComponentProps } from '..';
import clsx from 'clsx';
import { Editor } from './editor';

export const IndexConfiguration: FC<IndexSettingComponentProps> = ({ host, client }) => {
  const [inputType, setInputType] = useState<'visualization' | 'json'>('visualization');

  return useMemo(
    () => (
      <div className="has-border bg-bw-50 py-2 px-3 rounded-lg font-sans">
        <div className={`flex justify-between items-center gap-x-2 w-full py-1`}>
          <p className={`text-xl font-bold font-sans`}>Index Configuration</p>
          <div className="tabs boxed bw pill">
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
            <div className={clsx('tab p-4')}>Filterable Attributes</div>
            <div className={clsx('tab p-4')}>Distinct Attribute</div>
            <div className={clsx('tab p-4')}>Sortable Attributes</div>
            <div className={clsx('tab p-4')}>Searchable Attributes</div>
            <div className={clsx('tab p-4')}>Displayed Attributes</div>
            <div className={clsx('tab p-4')}>Ranking Rules</div>
            <div className={clsx('tab p-4')}>Stop Words</div>
            <div className={clsx('tab p-4')}>Synonyms</div>
            <div className={clsx('tab p-4')}>Typo Tolerance</div>
            <div className={clsx('tab p-4')}>Faceting</div>
            <div className={clsx('tab p-4')}>Pagination</div>
          </div>
        </div>
        <Editor className={clsx(inputType !== 'json' && 'hidden')} {...{ host, client }} />
      </div>
    ),
    [client, host, inputType]
  );
};
