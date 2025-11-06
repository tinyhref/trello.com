import type { FunctionComponent } from 'react';
import { Suspense } from 'react';

import { ChunkLoadErrorBoundary } from '@trello/error-boundaries';
import { useLazyComponent } from '@trello/use-lazy-component';

import type { CookiesPreferenceModalProps } from './CookiesPreferenceModal';

export const LazyCookiesPreferenceModal: FunctionComponent<
  CookiesPreferenceModalProps
> = (props) => {
  const CookiesPreferenceModal = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "browser-storage-message" */ './CookiesPreferenceModal'
      ),
    { namedImport: 'CookiesPreferenceModal', preload: false },
  );

  return (
    <ChunkLoadErrorBoundary fallback={null}>
      <Suspense fallback={null}>
        <CookiesPreferenceModal {...props} />
      </Suspense>
    </ChunkLoadErrorBoundary>
  );
};
