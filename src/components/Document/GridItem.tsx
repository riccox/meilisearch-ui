import { Button } from '@arco-design/web-react';
import { BaseDocItemProps } from './list';
import { useTranslation } from 'react-i18next';
import { Descriptions, Image, Modal } from '@douyinfe/semi-ui';
import _ from 'lodash';
import { Copyable } from '../Copyable';
import { getTimeText, isValidDateTime, isValidImgUrl } from '@/utils/text';

export const GridItem = ({ doc, onClickDocumentDel, onClickDocumentUpdate }: BaseDocItemProps) => {
  const { t } = useTranslation('document');

  return (
    <div
      className={`rounded-xl px-3 py-5 bg-primary-50/20 border border-transparent hover:border-primary group relative overflow-hidden`}
    >
      <Descriptions
        data={Object.entries(doc.content).map(([k, v]) => ({
          key: k,
          value: <ValueDisplay name={k} value={v} />,
        }))}
      />
      <div
        className={`absolute right-0 bottom-0 opacity-95 invisible group-hover:visible p-1.5 flex items-center gap-2`}
      >
        <Button type="secondary" size="mini" status="warning" onClick={() => onClickDocumentUpdate(doc)}>
          {t('common:update')}
        </Button>
        <Button type="secondary" size="mini" status="danger" onClick={() => onClickDocumentDel(doc)}>
          {t('common:delete')}
        </Button>
      </div>
    </div>
  );
};

const ValueDisplay = ({ name, value }: { name: string; value: unknown }) => {
  const str = _.toString(value).trim();
  return (
    <div
      className="cursor-pointer"
      onClick={() => {
        Modal.info({
          title: name,
          centered: true,
          content: (
            <div className="grid gap-2">
              <Copyable className="overflow-scroll whitespace-pre-wrap text-balance break-words">{str}</Copyable>
              {isValidImgUrl(str) && <Image width={'100%'} src={str} />}
            </div>
          ),
        });
      }}
    >
      {/^.*(date|time).*$/gim.test(name) && isValidDateTime(str) ? (
        getTimeText(isValidDateTime(str) as Date)
      ) : isValidImgUrl(str) ? (
        <Image width={'100%'} src={str} preview={false} />
      ) : (
        _.truncate(str, { length: 20 })
      )}
    </div>
  );
};
