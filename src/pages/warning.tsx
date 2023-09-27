import { Button } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { Footer } from '@/src/components/Footer';
import { Logo } from '@/src/components/Logo';
import { useAppStore } from '@/src/store';
import { useTranslation } from 'react-i18next';

function Warning() {
  const navigate = useNavigate();
  const { t } = useTranslation('sys');
  const warningPageData = useAppStore((state) => state.warningPageData);
  return (
    <div className="full-page bg-mount gap-y-10 justify-center items-center">
      <div className={'flex gap-6 items-center'}>
        <Logo />
        <h1 className={'text-4xl font-bold text-brand-4'}>{t('warning')}</h1>
      </div>
      {warningPageData?.prompt && (
        <p className={`text-brand-2 font-semibold text-base whitespace-pre-line`}>{warningPageData.prompt}</p>
      )}
      <div className="flex gap-3">
        <Button color={'orange'} onClick={() => window.location.assign(window.location.origin)}>
          {t('reload')}
        </Button>
        <Button variant={'gradient'} color={'blue'} onClick={() => navigate(-1)}>
          {t('back')}
        </Button>
      </div>
      <Footer />
    </div>
  );
}

export default Warning;
