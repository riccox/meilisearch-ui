import { Button } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { Footer } from '@/src/components/Footer';
import { Logo } from '@/src/components/Logo';
import { useAppStore } from '@/src/store';

function Warning() {
  const navigate = useNavigate();
  const warningPageData = useAppStore((state) => state.warningPageData);
  return (
    <div className="full-page bg-mount gap-y-10 justify-center items-center">
      <div className={'flex gap-6 items-center'}>
        <Logo />
        <h1 className={'text-4xl font-bold text-brand-4'}>Warning</h1>
      </div>
      {warningPageData?.prompt && (
        <p className={`text-brand-2 font-semibold text-base whitespace-pre-line`}>{warningPageData.prompt}</p>
      )}
      <div className="flex gap-3">
        <Button color={'orange'} onClick={() => window.location.assign(window.location.origin)}>
          Reload
        </Button>
        <Button variant={'gradient'} color={'blue'} onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>
      <Footer />
    </div>
  );
}

export default Warning;
