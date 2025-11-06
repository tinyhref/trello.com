import type { FunctionComponent } from 'react';
import { Suspense } from 'react';

import { ChunkLoadErrorBoundary } from '@trello/error-boundaries';
import { intl } from '@trello/i18n';
import { Popover, type PopoverProps } from '@trello/nachos/popover';
import { useLazyComponent } from '@trello/use-lazy-component';

import type { CopyCardPopoverProps } from './CopyCardPopover';
import { CopyCardPopoverSkeleton } from './CopyCardPopoverSkeleton';

interface LazyCopyCardPopoverProps extends CopyCardPopoverProps {
  /** If this is undefined, use a legacy PopOver. */
  popoverProps?: PopoverProps;
}

export const LazyCopyCardPopover: FunctionComponent<
  LazyCopyCardPopoverProps
> = ({ popoverProps, ...props }) => {
  const CopyCardPopover = useLazyComponent(
    () =>
      import(/* webpackChunkName: "copy-card-popover" */ './CopyCardPopover'),
    { namedImport: 'CopyCardPopover' },
  );

  const popoverContent = (
    <Suspense fallback={<CopyCardPopoverSkeleton />}>
      <ChunkLoadErrorBoundary fallback={null}>
        <CopyCardPopover {...props} />
      </ChunkLoadErrorBoundary>
    </Suspense>
  );

  if (!popoverProps) {
    return popoverContent;
  }

  return (
    <Popover
      title={intl.formatMessage({
        id: 'templates.card_copy.copy-card',
        defaultMessage: 'Copy card',
        description: 'Copy card popover title',
      })}
      {...popoverProps}
      labelledBy="copy-card-popover"
    >
      {popoverContent}
    </Popover>
  );
};
