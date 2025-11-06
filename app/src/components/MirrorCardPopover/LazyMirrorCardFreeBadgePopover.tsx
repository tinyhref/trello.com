import type { FunctionComponent } from 'react';
import { Suspense } from 'react';

import { ChunkLoadErrorBoundary } from '@trello/error-boundaries';
import type { PopoverProps } from '@trello/nachos/popover';
import { Popover } from '@trello/nachos/popover';
import { useLazyComponent } from '@trello/use-lazy-component';

interface LazyMirrorCardFreeBadgePopoverProps {
  popoverProps?: PopoverProps;
  hide: () => void;
}
export const LazyMirrorCardFreeBadgePopover: FunctionComponent<
  LazyMirrorCardFreeBadgePopoverProps
> = ({ popoverProps, hide }) => {
  const MirrorCardFreeBadgePopover = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "mirror-card-popover" */ './MirrorCardFreeBadgePopover'
      ),
    { namedImport: 'MirrorCardFreeBadgePopover' },
  );

  const contents = (
    <Suspense fallback={null}>
      <ChunkLoadErrorBoundary fallback={null}>
        <MirrorCardFreeBadgePopover hide={hide} />
      </ChunkLoadErrorBoundary>
    </Suspense>
  );

  if (!popoverProps) {
    return contents;
  }

  return (
    <Popover {...popoverProps} placement="right-start">
      {contents}
    </Popover>
  );
};
