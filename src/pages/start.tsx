import { Autocomplete, Button, PasswordInput } from '@mantine/core';
import { Logo } from '@/src/components/Logo';
import { Footer } from '@/src/components/Footer';
import { useAppStore } from '@/src/store';
import { useForm } from '@mantine/form';
import { useCallback, useState } from 'react';
import { MeiliSearch } from 'meilisearch';
import _ from 'lodash';
import { showNotification } from '@mantine/notifications';
import { useNavigate } from 'react-router-dom';

function Start() {
  const [loading, setLoading] = useState(false);
  const store = useAppStore();
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      host: store.config.host,
      apiKey: store.config.apiKey,
    },
    validate: {
      host: (value) =>
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)/.test(
          value
        )
          ? null
          : 'Invalid host',
    },
  });

  const onStart = useCallback(async (values: typeof form.values) => {
    // button loading
    setLoading(true);
    // do connection check
    const client = new MeiliSearch(values);
    let stats;
    try {
      stats = await client.getStats();
      console.info(stats);
    } catch (e) {
      console.warn(e);
    }
    if (_.isEmpty(stats)) {
      showNotification({
        color: 'danger',
        title: 'Fail',
        message: 'Connection fail, go check your config! 🤥',
      });
    } else {
      store.start(values);
      navigate('/');
    }

    // button stop loading
    setLoading(false);
  }, []);

  return (
    <div className="bg-mount fill flex flex-col justify-center items-center gap-y-10">
      <Logo />
      <h1 className={`text-brand-2 font-bold`}>A Beautiful Meilisearch UI</h1>
      <div
        className={`min-w-fit w-1/2 2xl:w-1/4 bg-background-light 
        flex flex-col justify-center items-center gap-y-10 
        p-10 rounded-3xl drop-shadow-2xl`}
      >
        <form className={`flex flex-col gap-y-6 w-full `} onSubmit={form.onSubmit(onStart)}>
          <Autocomplete
            radius="md"
            size={'lg'}
            label={<p className={'text-brand-5 pb-2 text-lg'}>Host</p>}
            placeholder="Meilisearch Server Host"
            data={store.history.host}
            {...form.getInputProps('host')}
          />
          <PasswordInput
            placeholder="Meilisearch Api Key"
            radius="md"
            size={'lg'}
            label={<p className={'text-brand-5 pb-2 text-lg'}>Api Key</p>}
            {...form.getInputProps('apiKey')}
          />
          <Button type="submit" radius={'xl'} size={'lg'} variant="light" loading={loading}>
            Start Meilisearch UI
          </Button>
        </form>
        <Footer />
      </div>
    </div>
  );
}

export default Start;
