import { SearchForm } from '@/src/components/Document/searchForm';
import SearchResult from '@/src/components/Document/SearchResult';
import { Loader } from '@/src/components/Loader';
import { useForm } from '@mantine/form';
import { Suspense, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  currentIndex: string;
};

export const SearchPage = ({ currentIndex }: Props) => {
  const { t } = useTranslation('document');
  const [searchFormError, setSearchFormError] = useState<string | null>(null);
  const [showSearchBar, setShowSearchBar] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const toggleSearch = () => {
    if (showSearchBar) {
      setShowSearchBar(false);
    } else {
      setShowSearchBar(true);
    }
  };

  const searchForm = useForm({
    initialValues: {
      q: '',
      offset: 0,
      limit: 20,
      filter: '',
      sort: '',
    },
    validate: {
      limit: (value: number) => (value < 500 ? null : t('search.form.limit.validation_error')),
    },
  });

  return useMemo(
    () => (
      <div className={`h-full flex flex-col p-6 gap-4 overflow-hidden`}>
        <div className={`rounded-lg p-4 border ${showSearchBar && 'hidden'}`}>
          <SearchForm searchForm={searchForm} searchFormError={searchFormError} submitBtnText={t('common:search')} />
        </div>
        <Suspense fallback={<Loader size="md" />}>
          <SearchResult
            currentIndex={currentIndex}
            searchForm={searchForm}
            setError={setSearchFormError}
            toggleSearchBar={toggleSearch}
          />
        </Suspense>
      </div>
    ),
    [currentIndex, searchForm, searchFormError, showSearchBar, t, toggleSearch]
  );
};
