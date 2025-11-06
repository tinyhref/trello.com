import type { FunctionComponent } from 'react';
import { Suspense } from 'react';

import { ChunkLoadErrorBoundary } from '@trello/error-boundaries';
import { useLazyComponent } from '@trello/use-lazy-component';

import type { RovoChatInterfaceProps } from './RovoChatInterface';

export const LazyRovoChatInterface: FunctionComponent<
  RovoChatInterfaceProps
> = (props) => {
  const RovoChatInterface = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "rovo-chat-interface" */ './RovoChatInterface'
      ),
    { namedImport: 'RovoChatInterface' },
  );

  return (
    <ChunkLoadErrorBoundary fallback={null}>
      <Suspense fallback={null}>
        <RovoChatInterface {...props} />
      </Suspense>
    </ChunkLoadErrorBoundary>
  );
};
