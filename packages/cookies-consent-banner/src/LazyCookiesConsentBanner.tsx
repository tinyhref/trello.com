import type { FunctionComponent } from 'react';
import { Suspense } from 'react';

import { ChunkLoadErrorBoundary } from '@trello/error-boundaries';
import { useLazyComponent } from '@trello/use-lazy-component';

import type { CookiesConsentBannerProps } from './CookiesConsentBanner';

export const LazyCookiesConsentBanner: FunctionComponent<
  CookiesConsentBannerProps
> = (props) => {
  const CookiesConsentBanner = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "browser-storage-message" */ './CookiesConsentBanner'
      ),
    { namedImport: 'CookiesConsentBanner', preload: false },
  );

  return (
    <Suspense fallback={null}>
      <ChunkLoadErrorBoundary fallback={null}>
        <CookiesConsentBanner {...props} />
      </ChunkLoadErrorBoundary>
    </Suspense>
  );
};
