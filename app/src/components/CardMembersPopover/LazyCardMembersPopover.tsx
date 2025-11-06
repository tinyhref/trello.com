import type { FunctionComponent } from 'react';
import { Suspense } from 'react';

import { ChunkLoadErrorBoundary } from '@trello/error-boundaries';
import { intl } from '@trello/i18n';
import { Popover, type PopoverProps } from '@trello/nachos/popover';
import { useLazyComponent } from '@trello/use-lazy-component';

import type { CardMembersPopoverProps } from './CardMembersPopover';

interface LazyCardMembersPopoverProps extends CardMembersPopoverProps {
  /** If this is undefined, use a legacy PopOver. */
  popoverProps?: PopoverProps;
  popoverTitle?: string;
}

export const LazyCardMembersPopover: FunctionComponent<
  LazyCardMembersPopoverProps
> = ({ popoverTitle, popoverProps, ...props }) => {
  const CardMembersPopover = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "card-members-popover" */ './CardMembersPopover'
      ),
    { namedImport: 'CardMembersPopover' },
  );

  const popoverContent = (
    <ChunkLoadErrorBoundary fallback={null}>
      <Suspense fallback={null}>
        <CardMembersPopover {...props} />
      </Suspense>
    </ChunkLoadErrorBoundary>
  );

  if (!popoverProps) {
    return popoverContent;
  }

  return (
    <Popover
      title={
        popoverTitle ||
        intl.formatMessage({
          id: 'templates.choose_member.title',
          defaultMessage: 'Members',
          description: 'Title for the card members popover',
        })
      }
      {...popoverProps}
      labelledBy="add-members-popover"
    >
      {popoverContent}
    </Popover>
  );
};
