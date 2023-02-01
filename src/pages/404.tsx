import { Button } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { Footer } from '@/src/components/Footer';
import { Logo } from '@/src/components/Logo';

function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="full-page bg-mount gap-y-10 justify-center items-center">
      <Logo />
      <h1 className={`text-brand-2 font-bold`}>404 Page Not Found</h1>
      <div className="">
        <Button variant={'gradient'} color={'blue'} onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>
      <Footer />
    </div>
  );
}

export default NotFound;
