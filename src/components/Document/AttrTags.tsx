'use client';
import { Tooltip } from '@arco-design/web-react';
import { useTranslation } from 'react-i18next';
import { Tag } from '@douyinfe/semi-ui';
import { Settings } from 'meilisearch';

export const AttrTags = ({ attr, indexSettings }: { attr: string; indexSettings: Settings }) => {
  const { t } = useTranslation('index');

  return (
    <>
      {indexSettings?.filterableAttributes?.includes(attr) && (
        <Tooltip content={t('index:setting.filterableAttributes')}>
          <Tag size="small" color="amber">
            FL
          </Tag>
        </Tooltip>
      )}
      {indexSettings?.searchableAttributes?.includes(attr) && (
        <Tooltip content={t('index:setting.searchableAttributes')}>
          <Tag size="small" color="indigo">
            SC
          </Tag>
        </Tooltip>
      )}
      {indexSettings?.sortableAttributes?.includes(attr) && (
        <Tooltip content={t('index:setting.sortableAttributes')}>
          <Tag size="small" color="cyan">
            ST
          </Tag>
        </Tooltip>
      )}
    </>
  );
};
