import { useEffect, useState } from 'react';

import { useIsReducedMotionEnabled } from '@trello/a11y';
import { Analytics } from '@trello/atlassian-analytics';
import { isMemberLoggedIn } from '@trello/authentication';
import { initializeGpuAcceleratedFeatures } from '@trello/gpu';
import { addUFOCustomData } from '@trello/ufo';

export const useBrowserFeatures = (): void => {
  const [gpuTier, setGpuTier] = useState<number | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<
    boolean | null
  >(null);

  const isReducedMotionEnabled = useIsReducedMotionEnabled();

  useEffect(() => {
    initializeGpuAcceleratedFeatures().then(({ tier }) => {
      setGpuTier(tier);
    });
  }, []);

  useEffect(() => {
    if (isReducedMotionEnabled === null) {
      return;
    }
    setPrefersReducedMotion(isReducedMotionEnabled);
  }, [isReducedMotionEnabled]);

  useEffect(() => {
    if (
      !isMemberLoggedIn() ||
      gpuTier === null ||
      prefersReducedMotion === null
    ) {
      return;
    }

    addUFOCustomData({
      gpuTier,
      prefersReducedMotion,
    });

    Analytics.sendOperationalEvent({
      action: 'initialized',
      actionSubject: 'browserFeatures',
      source: 'appStartup',
      attributes: {
        gpuTier,
        prefersReducedMotion,
      },
    });
  }, [gpuTier, prefersReducedMotion]);
};
