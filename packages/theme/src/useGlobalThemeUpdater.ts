import { useEffect, useLayoutEffect } from 'react';

import { setGlobalTheme as setAtlasKitGlobalTheme } from '@atlaskit/tokens';
import { Analytics } from '@trello/atlassian-analytics';
import { useFeatureGate } from '@trello/feature-gate-client';

import { globalThemeState } from './globalThemeState';
import { setGlobalTheme } from './setGlobalTheme';
import { setTypographyTheme } from './setTypographyTheme';
import type { ColorMode } from './theme.types';
import { useGlobalTheme } from './useGlobalTheme';

const VALID_COLOR_MODES: ColorMode[] = ['light', 'dark', 'auto'];

/**
 * Sets the `data-color-mode` attribute on the :html root when the appropriate
 * feature flag is enabled.
 */
export const useGlobalThemeUpdater = () => {
  const { loading: isVisualRefreshLoading } = useFeatureGate(
    'platform-component-visual-refresh',
  );
  const { value: isTypographyRefreshEnabled } = useFeatureGate(
    'phx_typography_refresh_2',
  );

  const { colorMode, typography } = useGlobalTheme();

  useLayoutEffect(() => {
    if (isTypographyRefreshEnabled && typography !== 'typography-refreshed') {
      setTypographyTheme('typography-refreshed');
    }
    if (!isTypographyRefreshEnabled && typography === 'typography-refreshed') {
      setTypographyTheme(undefined);
    }
  }, [isTypographyRefreshEnabled, typography]);

  useLayoutEffect(() => {
    // Prevent users from viewing Trello with an invalid theme.
    // This will essentially serve as a mini-heartbeat to ensure that users are
    // correctly upgraded to a theme. We can remove it once we find that this is
    // no longer triggered.
    if (!VALID_COLOR_MODES.includes(colorMode)) {
      setGlobalTheme('auto');
      Analytics.sendTrackEvent({
        actionSubject: 'theme',
        action: 'converted',
        source: '@trello/theme',
      });
      return;
    }

    // The value of the gate is not really important here. The @atlaskit/tokens
    // package will handle checking the gate value and applying the appropriate
    // theme. However, we need to wait for the feature gates to load before
    // calling setAtlasKitGlobalTheme because it will only load the theme once,
    // and calling it before the feature gate loads will result in the wrong
    // theme being applied.
    if (!isVisualRefreshLoading) {
      setAtlasKitGlobalTheme({
        colorMode,
        typography,
        shape: 'shape',
      });
    }
  }, [colorMode, typography, isVisualRefreshLoading]);

  /**
   * With the changes to the @atlaskit/tokens API made for version 1.0.0,
   * we no longer have explicit access to the effective color mode in the app.
   * This shim is meant to help us retain access to the effective color mode
   * directly by updating our theme state to maintain a direct reference to the
   * actual color mode, i.e. `light`, `dark`, or `null`.
   */
  useEffect(() => {
    if (colorMode !== 'auto') {
      return;
    }

    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    function setEffectiveColorMode({ matches }: { matches: boolean }) {
      const effectiveColorMode = matches ? 'dark' : 'light';
      globalThemeState.setValue({ effectiveColorMode });
    }

    setEffectiveColorMode({ matches: mql.matches });
    try {
      mql.addEventListener('change', setEffectiveColorMode);
    } catch (_) {
      // Safari versions < 14 don't support addEventListener yet.
      // Safari 14 is our minimum required version, but this would throw on page
      // load for unsupported versions, so this is just here for Sentry.
      mql.addListener(setEffectiveColorMode);
    }

    return () => mql.removeEventListener('change', setEffectiveColorMode);
  }, [colorMode]);
};
