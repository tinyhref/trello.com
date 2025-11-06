import { Suspense, useMemo } from 'react';

import { isEmbeddedDocument, isEmbeddedInAtlassian } from '@trello/browser';
import { ChunkLoadErrorBoundary } from '@trello/error-boundaries';
import { useRouteId, useRouteParams } from '@trello/router';
import { RouteId } from '@trello/router/routes';
import { useLazyComponent } from '@trello/use-lazy-component';

export function EmbeddedBoardFooterContainer() {
  const routeParams = useRouteParams<
    typeof RouteId.BOARD | typeof RouteId.CARD
  >();
  const routeId = useRouteId();

  const shouldRender = useMemo(() => {
    return (
      ((routeId === RouteId.BOARD && 'shortLink' in routeParams) ||
        routeId === RouteId.CARD) &&
      !isEmbeddedInAtlassian() &&
      isEmbeddedDocument()
    );
  }, [routeParams, routeId]);

  const EmbeddedBoardFooter = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "embedded-board-footer" */ './EmbeddedBoardFooter'
      ),
    { namedImport: 'EmbeddedBoardFooter', preload: false },
  );

  return !shouldRender ? null : (
    <ChunkLoadErrorBoundary fallback={null}>
      <Suspense fallback={null}>
        <EmbeddedBoardFooter
          boardId={'shortLink' in routeParams ? routeParams.shortLink : null}
        />
      </Suspense>
    </ChunkLoadErrorBoundary>
  );
}
