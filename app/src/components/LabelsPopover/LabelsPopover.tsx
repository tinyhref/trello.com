import { Suspense, type FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';

import {
  ChunkLoadErrorBoundary,
  ErrorBoundary,
} from '@trello/error-boundaries';
import type { PopoverProps } from '@trello/nachos/popover';
import { Popover } from '@trello/nachos/popover';
import type { LabelsPopoverTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';
import { useLazyComponent } from '@trello/use-lazy-component';

import type { LabelsPopoverContentProps } from './LabelsPopoverContent';

interface LabelsPopoverProps extends LabelsPopoverContentProps {
  popoverProps?: PopoverProps<HTMLButtonElement, HTMLElement>;
}

export const LabelsPopover: FunctionComponent<LabelsPopoverProps> = ({
  popoverProps,
  ...props
}) => {
  const LabelsPopoverContent = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "labels-popover-content" */ './LabelsPopoverContent'
      ),
    { namedImport: 'LabelsPopoverContent' },
  );

  const popoverContent = (
    <ErrorBoundary
      tags={{ ownershipArea: 'trello-web-eng', feature: 'Labels Popover' }}
    >
      <ChunkLoadErrorBoundary fallback={null}>
        <Suspense fallback={null}>
          <LabelsPopoverContent {...props} />
        </Suspense>
      </ChunkLoadErrorBoundary>
    </ErrorBoundary>
  );

  if (!popoverProps) {
    return popoverContent;
  }

  return (
    <Popover
      {...popoverProps}
      title={
        <FormattedMessage
          id="templates.labels_popover.labels"
          defaultMessage="Labels"
          description="The title of the labels popover"
        />
      }
      testId={getTestId<LabelsPopoverTestIds>('labels-popover')}
      labelledBy="add-labels-popover"
    >
      {popoverContent}
    </Popover>
  );
};
