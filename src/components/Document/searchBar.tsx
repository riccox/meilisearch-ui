import { useMemo } from 'react';
import { UseFormReturnType } from '@mantine/form';
import { SearchForm } from './searchForm';

type Props = {
  isFetching?: boolean;
  searchForm: UseFormReturnType<{
    q: string;
    offset: number;
    limit: number;
    filter: string;
    sort: string;
  }>;
  searchFormError: string | null;
  onFormSubmit: () => void;
};

export const SearchBar = ({ isFetching = false, searchForm, searchFormError, onFormSubmit }: Props) => {
  return useMemo(
    () => (
      <div className={`rounded-lg ${isFetching ? 'rainbow-ring-rotate' : ''}`}>
        <div className={`rounded-lg p-4 border`}>
          <SearchForm
            isFetching={isFetching}
            searchForm={searchForm}
            searchFormError={searchFormError}
            onFormSubmit={onFormSubmit}
            submitBtnText="Search"
          />
        </div>
      </div>
    ),
    [isFetching, onFormSubmit, searchForm, searchFormError]
  );
};
