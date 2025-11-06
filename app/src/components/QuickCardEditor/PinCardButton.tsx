import type { FunctionComponent } from 'react';
import { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';

import { Analytics } from '@trello/atlassian-analytics';
import { useCardId } from '@trello/id-context';
import { showFlag } from '@trello/nachos/experimental-flags';
import { PinIcon } from '@trello/nachos/icons/pin';

import { QuickCardEditorButton } from './QuickCardEditorButton';
import { useQuickEditPinCardMutation } from './QuickEditPinCardMutation.generated';

interface PinCardButtonProps {
  onClose: () => void;
  pinned: boolean;
}

export const PinCardButton: FunctionComponent<PinCardButtonProps> = ({
  onClose,
  pinned,
}) => {
  const idCard = useCardId();
  const [quickEditPinCardMutation] = useQuickEditPinCardMutation();
  const onClick = useCallback(async () => {
    const traceId = Analytics.startTask({
      taskName: 'edit-card/pinned',
      source: 'quickCardEditorInlineDialog',
    });
    try {
      await quickEditPinCardMutation({
        variables: { idCard, pinned: !pinned, traceId },
      });
      Analytics.taskSucceeded({
        taskName: 'edit-card/pinned',
        traceId,
        source: 'quickCardEditorInlineDialog',
      });
      onClose();
    } catch (error) {
      Analytics.taskFailed({
        taskName: 'edit-card/pinned',
        traceId,
        source: 'quickCardEditorInlineDialog',
        error,
      });
      showFlag({
        id: 'quick-card-editor',
        title: (
          <FormattedMessage
            id="templates.app_management.something-went-wrong"
            defaultMessage="Something went wrong. Please try again later."
            description="Error message"
          />
        ),
        appearance: 'error',
        isAutoDismiss: true,
      });
    }
  }, [idCard, onClose, pinned, quickEditPinCardMutation]);

  return (
    <QuickCardEditorButton icon={<PinIcon size="small" />} onClick={onClick}>
      {pinned ? 'Unpin card' : 'Pin card'}
    </QuickCardEditorButton>
  );
};
