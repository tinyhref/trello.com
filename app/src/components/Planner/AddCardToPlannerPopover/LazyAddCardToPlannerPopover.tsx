import type { FunctionComponent } from 'react';
import { Suspense } from 'react';
import { useIntl } from 'react-intl';

import { ChunkLoadErrorBoundary } from '@trello/error-boundaries';
import { Popover, type PopoverProps } from '@trello/nachos/popover';
import { useLazyComponent } from '@trello/use-lazy-component';

import type { AddCardToPlannerPopoverProps } from './AddCardToPlannerPopover';
import { AddCardToPlannerPopoverSkeleton } from './AddCardToPlannerPopoverSkeleton';

interface LazyAddCardToPlannerPopoverProps
  extends AddCardToPlannerPopoverProps {
  popoverProps: PopoverProps;
}

export const LazyAddCardToPlannerPopover: FunctionComponent<
  LazyAddCardToPlannerPopoverProps
> = ({ popoverProps, ...props }) => {
  const AddCardToPlannerPopover = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "add-card-to-planner-popover" */ './AddCardToPlannerPopover'
      ),
    { namedImport: 'AddCardToPlannerPopover' },
  );

  const intl = useIntl();

  const popoverContent = (
    <Suspense fallback={<AddCardToPlannerPopoverSkeleton />}>
      <ChunkLoadErrorBoundary fallback={null}>
        <AddCardToPlannerPopover {...props} />
      </ChunkLoadErrorBoundary>
    </Suspense>
  );

  return (
    <Popover
      title={intl.formatMessage({
        id: 'templates.planner.schedule-focus-time',
        defaultMessage: 'Schedule focus time',
        description:
          'Title for the popover to schedule focus time from card quick actions.',
      })}
      {...popoverProps}
      labelledBy="add-card-to-planner-popover"
    >
      {popoverContent}
    </Popover>
  );
};
