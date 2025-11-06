import type {
  DynamicTokenEntryPoint,
  DynamicTokenEntryPointMap,
  GetDynamicTokensConfig,
} from '../DynamicTokenConfig.types';
import {
  getDynamicBackgroundTokens,
  getFallbackBackgroundTokens,
} from './getDynamicBackgroundTokens';
import {
  getDynamicButtonTokens,
  getFallbackButtonTokens,
} from './getDynamicButtonTokens';
import {
  getDynamicLogoTokens,
  getFallbackLogoTokens,
} from './getDynamicLogoTokens';
import {
  getDynamicNavItemTokens,
  getFallbackNavItemTokens,
} from './getDynamicNavItemTokens';
import {
  getDynamicStarToken,
  getFallbackStarToken,
} from './getDynamicStarToken';
import {
  getDynamicTextTokens,
  getFallbackTextTokens,
} from './getDynamicTextTokens';

// Mark a single property as NonNullable.
type NonNullableProperty<T, TKey extends keyof T> = T & {
  [TProp in TKey]: NonNullable<T[TProp]>;
};

export type GetDynamicTokens<T extends DynamicTokenEntryPoint> = (
  config: NonNullableProperty<GetDynamicTokensConfig, 'background'>,
) => { [K in DynamicTokenEntryPointMap[T][number]]: string };

export type GetFallbackTokens<T extends DynamicTokenEntryPoint> = (
  config: GetDynamicTokensConfig,
) => { [K in DynamicTokenEntryPointMap[T][number]]: string };

const DYNAMIC_TOKENS_GETTERS: {
  [K in DynamicTokenEntryPoint]: GetDynamicTokens<K>;
} = {
  'dynamic.background': getDynamicBackgroundTokens,
  'dynamic.button': getDynamicButtonTokens,
  'dynamic.navitem': getDynamicNavItemTokens,
  'dynamic.star': getDynamicStarToken,
  'dynamic.text': getDynamicTextTokens,
  'dynamic.logo': getDynamicLogoTokens,
} as const;

const FALLBACK_TOKENS_GETTERS: {
  [K in DynamicTokenEntryPoint]: GetFallbackTokens<K>;
} = {
  'dynamic.background': getFallbackBackgroundTokens,
  'dynamic.button': getFallbackButtonTokens,
  'dynamic.navitem': getFallbackNavItemTokens,
  'dynamic.star': getFallbackStarToken,
  'dynamic.text': getFallbackTextTokens,
  'dynamic.logo': getFallbackLogoTokens,
} as const;

/**
 * Given an entry point, returns associated dynamic token values. For example,
 * the 'dynamic.button' entry point will return 'dynamic.button',
 * 'dynamic.button.hovered', and 'dynamic.button.pressed'.
 *
 * The list of entry points can be found in `getDynamicTokens.ts`.
 */
export const getDynamicTokens = (
  token: DynamicTokenEntryPoint,
  { background, ...config }: GetDynamicTokensConfig,
) => {
  // Extra protection for non-TS callers.
  if (!Object.prototype.hasOwnProperty.call(DYNAMIC_TOKENS_GETTERS, token)) {
    throw new Error(`Invalid entry point for getDynamicTokens: ${token}.`);
  }

  return background
    ? DYNAMIC_TOKENS_GETTERS[token]({ ...config, background })
    : FALLBACK_TOKENS_GETTERS[token]({ ...config, background });
};
