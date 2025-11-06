import type { FunctionComponent } from 'react';
import { Suspense } from 'react';

import { ChunkLoadErrorBoundary } from '@trello/error-boundaries';
import { useLazyComponent } from '@trello/use-lazy-component';

import type { LinkCardProps } from './LinkCard';
import { MinimalCard } from './MinimalCard';

export const LazyLinkCard: FunctionComponent<LinkCardProps> = (props) => {
  const LinkCard = useLazyComponent(
    () => import(/* webpackChunkName: "link-card" */ './LinkCard'),
    { namedImport: 'LinkCard' },
  );

  const { url } = props;
  return (
    <ChunkLoadErrorBoundary fallback={<MinimalCard name={url} url={url} />}>
      <Suspense fallback={<MinimalCard name={url} url={url} />}>
        <LinkCard {...props} />
      </Suspense>
    </ChunkLoadErrorBoundary>
  );
};
