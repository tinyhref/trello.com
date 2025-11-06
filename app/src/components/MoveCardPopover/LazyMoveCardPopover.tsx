import type { FunctionComponent } from 'react';
import { Suspense } from 'react';

import { ChunkLoadErrorBoundary } from '@trello/error-boundaries';
import { intl } from '@trello/i18n';
import type { PopoverProps } from '@trello/nachos/popover';
import { Popover } from '@trello/nachos/popover';
import { useLazyComponent } from '@trello/use-lazy-component';

import type { MoveCardPopoverProps } from './MoveCardPopover';
import { MoveCardPopoverSkeleton } from './MoveCardPopoverSkeleton';

interface LazyMoveCardPopoverProps extends MoveCardPopoverProps {
  /** If this is undefined, use a legacy PopOver. */
  popoverProps?: PopoverProps;
}

export const LazyMoveCardPopover: FunctionComponent<
  LazyMoveCardPopoverProps
> = ({ popoverProps, ...props }) => {
  const MoveCardPopover = useLazyComponent(
    () =>
      import(/* webpackChunkName: "move-card-popover" */ './MoveCardPopover'),
    { namedImport: 'MoveCardPopover' },
  );

  const popoverContent = (
    <Suspense fallback={<MoveCardPopoverSkeleton />}>
      <ChunkLoadErrorBoundary fallback={null}>
        <MoveCardPopover {...props} />
      </ChunkLoadErrorBoundary>
    </Suspense>
  );

  if (!popoverProps) {
    return popoverContent;
  }

  return (
    <Popover
      title={intl.formatMessage({
        id: 'templates.popover_move_card.move-card',
        defaultMessage: 'Move card',
        description: 'Move card popover title',
      })}
      {...popoverProps}
      labelledBy="move-card-popover"
    >
      {popoverContent}
    </Popover>
  );
};
