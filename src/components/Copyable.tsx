'use client';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@arco-design/web-react';
import { toast } from 'sonner';
import { cn } from '@/lib/cn';
interface Props {
  children: string;
  className?: string;
}

export const Copyable: FC<Props> = ({ className = '', children }) => {
  const { t } = useTranslation();

  return (
    <Typography.Paragraph
      className={cn('!mb-0', className)}
      copyable={{
        onCopy: () => {
          toast.success(t('common:copied'));
        },
        text: children,
      }}
    >
      {children}
    </Typography.Paragraph>
  );
};
