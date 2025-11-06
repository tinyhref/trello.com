import { useEffect } from 'react';

import { useGlobalTheme } from '@trello/theme';

import type { UseDynamicTokensConfig } from './DynamicTokenConfig.types';
import { setDynamicTokens } from './setDynamicTokens';

export const useDynamicTokens = ({
  ref,
  ...config
}: UseDynamicTokensConfig) => {
  const { effectiveColorMode } = useGlobalTheme();

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    setDynamicTokens({
      element: ref.current,
      colorMode: effectiveColorMode,
      ...config,
    });
  }, [config, ref, effectiveColorMode]);
};
