import type { FunctionComponent } from 'react';
import { useEffect, useState } from 'react';

import { Dialog, useDialog } from '@trello/nachos/dialog';

import { LazyAboutThisBoardContent } from './LazyAboutThisBoardContent';
import { useAboutThisBoardModal } from './useAboutThisBoardModal';

export const PossiblyRenderAboutThisBoardModal: FunctionComponent<{
  boardId: string;
}> = ({ boardId }) => {
  const { dialogProps, show, hide } = useDialog();
  const [hasShown, setHasShown] = useState<boolean>(false);

  const { wouldRender } = useAboutThisBoardModal({ boardId });

  // Reset the hasShown state each time the boardId changes
  useEffect(() => {
    setHasShown(false);
  }, [boardId]);

  useEffect(() => {
    if (!hasShown && wouldRender) {
      show();
      setHasShown(true);
    }
  }, [show, hide, wouldRender, hasShown]);

  if (!wouldRender) {
    return null;
  }

  return (
    <Dialog {...dialogProps} size="large">
      <LazyAboutThisBoardContent boardId={boardId} onClose={hide} />
    </Dialog>
  );
};
