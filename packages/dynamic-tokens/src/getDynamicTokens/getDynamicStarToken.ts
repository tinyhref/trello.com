import { hasValidContrastRatio } from '@trello/a11y';
import { token } from '@trello/theme';

import { dynamicToken } from '../dynamicToken';
import type { GetDynamicTokens, GetFallbackTokens } from './getDynamicTokens';

// This should be aligned with the value of the custom `--tr-icon-star` token
// in `@trello/theme/tokens.less`. This implicit coupling should be temporary,
// as the ADS team is actively working on improving the shade of their yellows:
// https://product-fabric.atlassian.net/browse/DSP-5850
const STAR_TOKEN_VALUE = '#e2b203';

/**
 * Assign a dynamic star color based on the board background color.
 * If the equivalent yellow star token from ADS has a valid contrast ratio,
 * we use it; otherwise, we fallback to the value of the `dynamic.icon` token.
 * Note that this has an explicit dependency on the `dynamic.text` token
 * and must be fetched in tandem.
 */
export const getDynamicStarToken: GetDynamicTokens<'dynamic.star'> = ({
  background: { backgroundColor },
}) => {
  if (
    !backgroundColor ||
    hasValidContrastRatio(backgroundColor, STAR_TOKEN_VALUE, 16, false).isValid
  ) {
    return { 'dynamic.star': token('trello.color.icon.star', '#E2B203') };
  }

  return { 'dynamic.star': dynamicToken('dynamic.icon') };
};

export const getFallbackStarToken: GetFallbackTokens<'dynamic.star'> = (
  config,
) => {
  return {
    'dynamic.star': '',
  };
};
