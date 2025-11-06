import type { FunctionComponent } from 'react';
import { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';

import { CopyIcon } from '@trello/nachos/icons/copy';
import { usePopover } from '@trello/nachos/popover';
import type { QuickCardEditorTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { LazyCopyCardPopover } from 'app/src/components/MoveCardPopover';
import { QuickCardEditorButton } from './QuickCardEditorButton';

interface CopyCardButtonProps {
  onClose: () => void;
}

export const CopyCardButton: FunctionComponent<CopyCardButtonProps> = ({
  onClose,
}) => {
  const { popoverProps, toggle, triggerRef } = usePopover();

  const onClick = useCallback(() => {
    toggle();
  }, [toggle]);

  return (
    <>
      <QuickCardEditorButton
        icon={<CopyIcon size="small" />}
        onClick={onClick}
        ref={triggerRef}
        testId={getTestId<QuickCardEditorTestIds>('quick-card-editor-copy')}
        isSelected={popoverProps.isVisible}
      >
        <FormattedMessage
          id="templates.quick_card_editor.copy-card"
          defaultMessage="Copy card"
          description="Quick card editor Copy card button"
        />
      </QuickCardEditorButton>

      {popoverProps.isVisible && (
        <LazyCopyCardPopover
          popoverProps={popoverProps}
          onClose={onClose}
          source="quickCardEditorInlineDialog"
        />
      )}
    </>
  );
};
