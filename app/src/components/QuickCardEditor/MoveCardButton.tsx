import type { FunctionComponent, MouseEventHandler } from 'react';
import { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';

import { isMac } from '@trello/browser';
import { intl } from '@trello/i18n';
import { MoveIcon } from '@trello/nachos/icons/move';
import { usePopover } from '@trello/nachos/popover';
import type { QuickCardEditorTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { LazyMoveCardPopover } from 'app/src/components/MoveCardPopover';
import { QuickCardEditorButton } from './QuickCardEditorButton';

interface MoveCardButtonProps {
  onClose: () => void;
  isPlannerCard: boolean;
}

export const MoveCardButton: FunctionComponent<MoveCardButtonProps> = ({
  onClose,
  isPlannerCard,
}) => {
  const { popoverProps, toggle, triggerRef } = usePopover();

  const onClick = useCallback<MouseEventHandler>(
    (e) => {
      toggle();
    },
    [toggle],
  );

  const shortcutText = isMac() ? 'Command + x/v' : 'Ctrl + x/v';

  return (
    <>
      <QuickCardEditorButton
        icon={<MoveIcon size="small" />}
        onClick={onClick}
        ref={triggerRef}
        testId={getTestId<QuickCardEditorTestIds>('quick-card-editor-move')}
        isSelected={popoverProps.isVisible}
        shortcutText={intl.formatMessage({
          id: 'templates.quick_card_editor.move-card',
          defaultMessage: 'Move card',
          description: 'Tooltip text for moving a card',
        })}
        shortcutKey={isPlannerCard ? '' : shortcutText}
        position="right"
      >
        <FormattedMessage
          id="templates.quick_card_editor.move"
          defaultMessage="Move"
          description="Quick card editor Move button"
        />
      </QuickCardEditorButton>

      {popoverProps.isVisible && (
        <LazyMoveCardPopover
          popoverProps={popoverProps}
          onClose={onClose}
          source="quickCardEditorInlineDialog"
        />
      )}
    </>
  );
};
