import { DynamicTokenMap } from './dynamicToken';
import type { DynamicToken } from './DynamicToken.types';
import type { SetDynamicTokensConfig } from './DynamicTokenConfig.types';
import { getDynamicTokens } from './getDynamicTokens';

export const setDynamicTokens = ({
  element,
  dynamicTokens,
  ...config
}: SetDynamicTokensConfig) => {
  const tokens = dynamicTokens.reduce(
    (acc, key) => ({ ...acc, ...getDynamicTokens(key, config) }),
    {} as Record<DynamicToken, string>,
  );
  // Wrap the DOM interactions in a requestAnimationFrame for performance.
  requestAnimationFrame(() => {
    Object.entries(tokens).forEach(([key, value]) => {
      const cssPropertyName = DynamicTokenMap[key as DynamicToken];
      if (value) {
        element.style.setProperty(cssPropertyName, value);
      } else {
        element.style.removeProperty(cssPropertyName);
      }
    });
  });
};
