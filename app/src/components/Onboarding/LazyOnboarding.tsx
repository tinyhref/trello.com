/* eslint-disable @trello/export-matches-filename */
import type { ComponentProps } from 'react';
import { Suspense } from 'react';

import type {
  Spotlight,
  SpotlightCard,
  SpotlightManager,
  SpotlightPulse,
  SpotlightTarget,
  SpotlightTransition,
} from '@trello/nachos/experimental-onboarding';
import { useLazyComponent } from '@trello/use-lazy-component';

export const LazySpotlightManager = (props: SpotlightManager['props']) => {
  const SpotlightManager = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "spotlight-manager" */ '@trello/nachos/experimental-onboarding'
      ),
    { namedImport: 'SpotlightManager' },
  );

  return (
    <Suspense fallback={null}>
      <SpotlightManager {...props} />
    </Suspense>
  );
};

/*
  The Spotlight type accesed by Spotlight['props'] suggests that
  'pulse' and 'dialogWidth' are required props. This is because the
  class provides default values for those props. Consumers do not need
  to pass values in.
*/
interface SpotlightProps
  extends Omit<ComponentProps<typeof Spotlight>, 'dialogWidth' | 'pulse'>,
    Partial<Pick<ComponentProps<typeof Spotlight>, 'dialogWidth' | 'pulse'>> {}

export const LazySpotlight = (props: SpotlightProps) => {
  const Spotlight = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "spotlight" */ '@trello/nachos/experimental-onboarding'
      ),
    { namedImport: 'Spotlight' },
  );

  return (
    <Suspense fallback={null}>
      <Spotlight {...props} />
    </Suspense>
  );
};

export const LazySpotlightTarget = (
  props: ComponentProps<typeof SpotlightTarget>,
) => {
  const SpotlightTarget = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "spotlight-target" */ '@trello/nachos/experimental-onboarding'
      ),
    { namedImport: 'SpotlightTarget' },
  );

  return (
    <Suspense fallback={null}>
      <SpotlightTarget {...props} />
    </Suspense>
  );
};

export const LazySpotlightTransition = (
  props: SpotlightTransition['props'],
) => {
  const SpotlightTransition = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "spotlight-transition" */ '@trello/nachos/experimental-onboarding'
      ),
    { namedImport: 'SpotlightTransition' },
  );

  return (
    <Suspense fallback={null}>
      <SpotlightTransition {...props} />
    </Suspense>
  );
};

export const LazySpotlightCard = (
  props: ComponentProps<typeof SpotlightCard>,
) => {
  const SpotlightCard = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "spotlight-card" */ '@trello/nachos/experimental-onboarding'
      ),
    { namedImport: 'SpotlightCard' },
  );

  return (
    <Suspense fallback={null}>
      <SpotlightCard {...props} />
    </Suspense>
  );
};

export const LazySpotlightPulse = (
  props: ComponentProps<typeof SpotlightPulse>,
) => {
  const SpotlightPulse = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "spotlight-pulse" */ '@trello/nachos/experimental-onboarding'
      ),
    { namedImport: 'SpotlightPulse' },
  );

  return (
    <Suspense fallback={null}>
      {/* 2025.06.18 temp disable animation for all spotlight pulses
      until performance issue (CPU spiking) is addressed by ADS
      https://product-fabric.atlassian.net/browse/DSP-22761 */}
      <SpotlightPulse {...props} style={{ animation: 'none' }} />
    </Suspense>
  );
};
