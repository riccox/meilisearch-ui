import { Button } from '@mantine/core';
import { useRouter } from '@tanstack/react-router';
import { Footer } from '@/components/Footer';
import { Logo } from '@/components/Logo';
import { useTranslation } from 'react-i18next';

export function NotFound() {
  const { history } = useRouter();
  const { t } = useTranslation();
  return (
    <div className="full-page bg-mount gap-y-10 justify-center items-center">
      <Logo />
      <h1 className={`text-primary-100 font-bold`}>404 Page Not Found</h1>
      <div className="">
        <Button variant={'gradient'} color={'blue'} onClick={() => history.back()}>
          {t('back')}
        </Button>
      </div>
      <Footer />
    </div>
  );
}
