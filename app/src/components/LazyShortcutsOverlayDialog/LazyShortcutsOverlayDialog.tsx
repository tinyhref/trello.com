import type { FunctionComponent } from 'react';
import { Suspense, useEffect } from 'react';

import { ChunkLoadErrorBoundary } from '@trello/error-boundaries';
import { Dialog, useDialog } from '@trello/nachos/dialog';
import { useLazyComponent } from '@trello/use-lazy-component';

import { useShowShortcutsOverlayByUrl } from './useShowShortcutsOverlayByUrl';

export const LazyShortcutsOverlayDialog: FunctionComponent = () => {
  const { dialogProps, show } = useDialog();
  const { showShortcutsOverlay, onCloseShortcutsOverlay } =
    useShowShortcutsOverlayByUrl();

  const ShortcutsOverlay = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "shortcuts-overlay" */ 'app/src/components/ShortcutsOverlay'
      ),
    { namedImport: 'ShortcutsOverlay', preload: false },
  );

  useEffect(() => {
    if (showShortcutsOverlay) {
      show();
    }
  }, [showShortcutsOverlay, show]);

  return showShortcutsOverlay ? (
    <Dialog {...dialogProps} hide={onCloseShortcutsOverlay}>
      <ChunkLoadErrorBoundary fallback={null}>
        <Suspense>
          <ShortcutsOverlay onClose={onCloseShortcutsOverlay} />
        </Suspense>
      </ChunkLoadErrorBoundary>
    </Dialog>
  ) : null;
};
