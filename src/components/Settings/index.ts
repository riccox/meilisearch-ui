import { Index } from 'meilisearch';

export type IndexSettingComponentProps = {
  className?: string;
  host?: string;
  client: Index;
};

export type IndexSettingConfigComponentProps = IndexSettingComponentProps & {
  toggleLoading: (bool: boolean) => void;
};
