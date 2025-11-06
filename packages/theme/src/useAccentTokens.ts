import type { RefObject } from 'react';
import { useEffect } from 'react';

import type { CSSToken } from '@atlaskit/tokens';

type AccentColor =
  | 'blue'
  | 'gray'
  | 'green'
  | 'lime'
  | 'magenta'
  | 'orange'
  | 'purple'
  | 'red'
  | 'teal'
  | 'yellow';
type LegacyAccentColor = 'black' | 'pink' | 'sky';

const LEGACY_COLORS_MAP: Record<LegacyAccentColor, AccentColor> = {
  black: 'gray',
  pink: 'magenta',
  sky: 'teal',
};

interface AccentColorOptions {
  color: AccentColor | LegacyAccentColor;
  modifier: 'bolder' | 'subtle' | 'subtler' | 'subtlest';
}

// Support the "warning" color palette as well, as it's a kind of accent.
interface WarningOptions {
  color: 'warning';
  modifier?: 'bold' | null;
}

// Allow falsy values for consumers to conditionally disable this hook.
interface InvalidOptions {
  color: null;
  modifier?: null;
}

export type AccentTokenOptions =
  | AccentColorOptions
  | InvalidOptions
  | WarningOptions;

type AccentToken =
  | '--accent-background-hovered'
  | '--accent-background-pressed'
  | '--accent-background'
  | '--accent-icon'
  | '--accent-text-bolder'
  | '--accent-text';

const getAccentTokens = ({
  color,
  modifier,
}: AccentTokenOptions): Record<AccentToken, CSSToken | ''> => {
  if (!color) {
    return {
      '--accent-background': '',
      '--accent-background-hovered': '',
      '--accent-background-pressed': '',
      '--accent-icon': '',
      '--accent-text': '',
      '--accent-text-bolder': '',
    };
  }

  if (color === 'warning') {
    const formattedBackground = modifier ? 'warning-bold' : 'warning';
    const formattedForeground = modifier ? 'warning-inverse' : 'warning';
    return {
      '--accent-background': `var(--ds-background-${formattedBackground})`,
      '--accent-background-hovered': `var(--ds-background-${formattedBackground}-hovered)`,
      '--accent-background-pressed': `var(--ds-background-${formattedBackground}-pressed)`,
      '--accent-icon': `var(--ds-icon-${formattedForeground})`,
      '--accent-text': `var(--ds-text-${formattedForeground})`,
      '--accent-text-bolder': `var(--ds-text-${formattedForeground})`,
    };
  }

  const formattedColor =
    LEGACY_COLORS_MAP[color as LegacyAccentColor] || (color as AccentColor);

  if (modifier === 'bolder') {
    return {
      '--accent-background': `var(--ds-background-accent-${formattedColor}-${modifier})`,
      '--accent-background-hovered': `var(--ds-background-accent-${formattedColor}-${modifier}-hovered)`,
      '--accent-background-pressed': `var(--ds-background-accent-${formattedColor}-${modifier}-pressed)`,
      '--accent-icon': `var(--ds-icon-inverse)`,
      '--accent-text': `var(--ds-text-inverse)`,
      '--accent-text-bolder': `var(--ds-text-inverse)`,
    };
  }

  return {
    '--accent-background': `var(--ds-background-accent-${formattedColor}-${modifier})`,
    '--accent-background-hovered': `var(--ds-background-accent-${formattedColor}-${modifier}-hovered)`,
    '--accent-background-pressed': `var(--ds-background-accent-${formattedColor}-${modifier}-pressed)`,
    '--accent-icon': `var(--ds-icon-accent-${formattedColor})`,
    '--accent-text': `var(--ds-text-accent-${formattedColor})`,
    '--accent-text-bolder': `var(--ds-text-accent-${formattedColor}-bolder)`,
  };
};

/**
 * Set relevant accent color tokens as CSS variables on an HTML element for
 * more convenient local usage, based on a given accent color (e.g. "blue")
 * and modifier for the background color (e.g. "subtler").
 *
 * See {@link AccentToken} for CSS syntax.
 */
export const useAccentTokens = ({
  ref,
  isSmartScheduledEvent,
  ...options
}: {
  ref: RefObject<HTMLElement>;
  isSmartScheduledEvent?: boolean;
} & AccentTokenOptions) => {
  useEffect(() => {
    const element = ref.current;
    if (!element || isSmartScheduledEvent) {
      return;
    }
    const accentTokens = getAccentTokens(options);
    // Wrap the DOM interactions in a requestAnimationFrame for performance.
    requestAnimationFrame(() => {
      Object.entries(accentTokens).forEach(([key, value]) => {
        const property = key as AccentToken;
        if (value) {
          element.style.setProperty(property, value);
        } else {
          element.style.removeProperty(property);
        }
      });
    });
  }, [ref, options, isSmartScheduledEvent]);
};
