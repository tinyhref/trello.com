import type { FunctionComponent, ReactNode } from 'react';

import { useFeatureGate } from '@trello/feature-gate-client';
import { useBoardId, useWorkspaceId } from '@trello/id-context';
import { useSharedState } from '@trello/shared-state';

import {
  PossiblyRenderAboutThisBoardModal,
  useAboutThisBoardModal,
} from 'app/src/components/AboutThisBoardModal';
import {
  LazyConfirmEmailModal,
  useConfirmEmailModal,
} from 'app/src/components/ConfirmEmailModal';
import { LazyPluginModal } from 'app/src/components/Plugins/LazyPluginModal';
import { PluginModalState } from 'app/src/components/Plugins/PluginModalState';
import { LazyPluginPopover } from 'app/src/components/Plugins/PluginPopover/LazyPluginPopover';
import { PluginPopoverState } from 'app/src/components/Plugins/PluginPopover/PluginPopoverState';
import {
  LazyReadOnlyBoardModal,
  useReadOnlyBoardModal,
} from 'app/src/components/ReadOnlyBoardModal';
import { ConditionalBoardOverlay } from './ConditionalBoardOverlay';

export const BoardOverlays: FunctionComponent = () => {
  const boardId = useBoardId();
  const workspaceId = useWorkspaceId();

  const { value: isPluginModalModernized } = useFeatureGate(
    'xf_plugin_modernization_modal',
  );

  const { value: isPluginPopoverModernized } = useFeatureGate(
    'xf_plugin_modernization_popover_views',
  );

  const [
    {
      isOpen: isPluginModalOpen,
      url,
      accentColor,
      height,
      fullscreen,
      title,
      actions,
    },
  ] = useSharedState(PluginModalState);
  const [{ isOpen: isPluginPopoverOpen }] = useSharedState(PluginPopoverState);

  const { wouldRender: wouldRenderConfirmEmailModal } = useConfirmEmailModal({
    boardId,
  });

  const { wouldRender: wouldRenderReadOnlyBoardModal } = useReadOnlyBoardModal({
    boardId,
    workspaceId,
  });

  const { wouldRender: wouldRenderAboutThisBoardModal } =
    useAboutThisBoardModal({ boardId });

  let overlay: ReactNode;

  if (wouldRenderReadOnlyBoardModal) {
    overlay = <LazyReadOnlyBoardModal />;
  } else if (wouldRenderConfirmEmailModal) {
    overlay = <LazyConfirmEmailModal boardId={boardId} />;
  } else if (wouldRenderAboutThisBoardModal) {
    overlay = <PossiblyRenderAboutThisBoardModal boardId={boardId} />;
  } else if (isPluginModalModernized && isPluginModalOpen) {
    overlay = (
      <LazyPluginModal
        url={url}
        accentColor={accentColor}
        height={height}
        fullscreen={fullscreen}
        title={title}
        actions={actions}
      />
    );
  } else if (isPluginPopoverOpen && isPluginPopoverModernized) {
    overlay = <LazyPluginPopover />;
  }

  return (
    <>
      {overlay}
      <ConditionalBoardOverlay />
    </>
  );
};
