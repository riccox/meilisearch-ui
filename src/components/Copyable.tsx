'use client';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@douyinfe/semi-ui';
import { toast } from 'sonner';
import { IconCopy } from '@tabler/icons-react';
interface Props {
  children: string;
  className?: string;
}

export const Copyable: FC<Props> = ({ className = '', children }) => {
  const { t } = useTranslation();

  return (
    <Typography.Paragraph
      className={className}
      copyable={{
        onCopy: () => toast.success(t('common:copied')),
        icon: <IconCopy size={'0.95em'} className=" text-current" />,
        copyTip: t('common:copy'),
        successTip: '✅',
      }}
    >
      {children}
    </Typography.Paragraph>
  );
};
