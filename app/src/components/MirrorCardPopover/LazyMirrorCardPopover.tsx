import type { FunctionComponent } from 'react';
import { Suspense, useCallback } from 'react';
import { useIntl } from 'react-intl';

import { ChunkLoadErrorBoundary } from '@trello/error-boundaries';
import { useFeatureGate } from '@trello/feature-gate-client';
import type { PopoverProps } from '@trello/nachos/popover';
import { Popover } from '@trello/nachos/popover';
import { useLazyComponent } from '@trello/use-lazy-component';

interface LazyMirrorCardPopoverProps {
  popoverProps?: PopoverProps;
  hide: () => void;
  onClose?: () => void;
}
export const LazyMirrorCardPopover: FunctionComponent<
  LazyMirrorCardPopoverProps
> = ({ popoverProps, hide, onClose }) => {
  const intl = useIntl();

  const { value: isMirrorCardPopoverWithTabsEnabled } = useFeatureGate(
    'ghost_mirror_card_popover_tabs',
  );

  const MirrorCardPopover = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "mirror-card-popover-with-link-card" */ './MirrorCardPopover'
      ),
    { namedImport: 'MirrorCardPopover' },
  );

  const MirrorCardPopoverWithTabs = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "mirror-card-popover-with-tabs" */ './MirrorCardPopoverWithTabs'
      ),
    { namedImport: 'MirrorCardPopoverWithTabs' },
  );

  const handleOnClose = useCallback(() => {
    hide();
    // close quick card editor overlay if invoked from there
    onClose?.();
  }, [hide, onClose]);

  const contents = (
    <Suspense fallback={null}>
      <ChunkLoadErrorBoundary fallback={null}>
        {isMirrorCardPopoverWithTabsEnabled ? (
          <MirrorCardPopoverWithTabs onClose={handleOnClose} />
        ) : (
          <MirrorCardPopover onClose={handleOnClose} />
        )}
      </ChunkLoadErrorBoundary>
    </Suspense>
  );

  if (!popoverProps) {
    return contents;
  }

  return (
    <Popover
      title={intl.formatMessage({
        id: 'templates.popover_mirror_card.mirror-card',
        defaultMessage: 'Mirror card',
        description: 'Title for the mirror card popover',
      })}
      {...popoverProps}
      labelledBy="mirror-card-popover"
    >
      {contents}
    </Popover>
  );
};
