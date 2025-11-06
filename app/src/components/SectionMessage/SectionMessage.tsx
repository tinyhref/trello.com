import type { ReactNode } from 'react';
import { Suspense } from 'react';

import type {
  SectionMessageActionProps,
  SectionMessageProps,
} from '@atlaskit/section-message';
import { ChunkLoadErrorBoundary } from '@trello/error-boundaries';
import { useLazyComponent } from '@trello/use-lazy-component';

export type {
  Appearance as SectionMessageAppearance,
  SectionMessageProps,
} from '@atlaskit/section-message';

interface ChunkLoadErrorBoundaryFallback {
  fallback?: ReactNode;
}

export function SectionMessage({
  fallback = null,
  ...rest
}: SectionMessageProps & ChunkLoadErrorBoundaryFallback) {
  const AkSectionMessage = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "atlaskit-section-message" */ '@atlaskit/section-message'
      ),
    {
      preload: false,
      namedImport: 'default',
    },
  );
  return (
    <ChunkLoadErrorBoundary fallback={fallback}>
      <Suspense fallback={null}>
        <AkSectionMessage {...rest} />
      </Suspense>
    </ChunkLoadErrorBoundary>
  );
}

export function SectionMessageAction({
  fallback = null,
  ...rest
}: SectionMessageActionProps & ChunkLoadErrorBoundaryFallback) {
  const AkSectionMessageAction = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "atlaskit-section-message" */ '@atlaskit/section-message'
      ),
    {
      preload: false,
      namedImport: 'SectionMessageAction',
    },
  );
  return (
    <ChunkLoadErrorBoundary fallback={fallback}>
      <Suspense fallback={null}>
        <AkSectionMessageAction {...rest} />
      </Suspense>
    </ChunkLoadErrorBoundary>
  );
}
