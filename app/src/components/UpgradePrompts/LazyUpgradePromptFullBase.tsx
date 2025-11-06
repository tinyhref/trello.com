import { Suspense } from 'react';

import {
  ChunkLoadErrorBoundary,
  ErrorBoundary,
} from '@trello/error-boundaries';
import { useLazyComponent } from '@trello/use-lazy-component';

import type { UpgradePromptFullBaseProps } from './UpgradePromptFullBase';

export function LazyUpgradePromptFullBase(props: UpgradePromptFullBaseProps) {
  const UpgradePromptFullBase = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "upgrade-prompt-full-base" */ './UpgradePromptFullBase'
      ),
    {
      preload: false,
      namedImport: 'UpgradePromptFullBase',
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
          <UpgradePromptFullBase {...props} />
        </ChunkLoadErrorBoundary>
      </ErrorBoundary>
    </Suspense>
  );
}
