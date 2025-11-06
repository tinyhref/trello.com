import { Suspense } from 'react';

import {
  ChunkLoadErrorBoundary,
  ErrorBoundary,
} from '@trello/error-boundaries';
import { useLazyComponent } from '@trello/use-lazy-component';

import type { UpgradePromptFullProps } from './UpgradePromptFull';

export function LazyUpgradePromptFullConnected(props: UpgradePromptFullProps) {
  const UpgradePromptFullConnected = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "upgrade-prompt-full" */ './UpgradePromptFull'
      ),
    {
      preload: false,
      namedImport: 'UpgradePromptFullConnected',
    },
  );

  return (
    <Suspense fallback={null}>
      <ErrorBoundary
        tags={{
          ownershipArea: 'trello-web-eng',
          feature: 'Upgrade Prompts',
        }}
      >
        <ChunkLoadErrorBoundary fallback={null}>
          <UpgradePromptFullConnected {...props} />
        </ChunkLoadErrorBoundary>
      </ErrorBoundary>
    </Suspense>
  );
}

export function LazyUpgradePromptFull(props: UpgradePromptFullProps) {
  const UpgradePromptFull = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "upgrade-prompt-full" */ './UpgradePromptFull'
      ),
    {
      preload: false,
      namedImport: 'UpgradePromptFull',
    },
  );

  return (
    <Suspense fallback={null}>
      <ErrorBoundary
        tags={{
          ownershipArea: 'trello-web-eng',
          feature: 'Upgrade Prompts',
        }}
      >
        <ChunkLoadErrorBoundary fallback={null}>
          <UpgradePromptFull {...props} />
        </ChunkLoadErrorBoundary>
      </ErrorBoundary>
    </Suspense>
  );
}
