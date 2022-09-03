import type { FC } from 'react';

import { JellyTriangle } from '@uiball/loaders';
import { useMantineTheme } from '@mantine/core';

interface Props {
  size?: number;
}

export const Loader: FC<Props> = ({ size }) => {
  const theme = useMantineTheme();
  return <JellyTriangle size={size ?? 60} speed={2} color={theme.colors.brand[5]} />;
};
