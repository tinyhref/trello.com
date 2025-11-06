import type { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';

import { intl } from '@trello/i18n';
import { useCardId } from '@trello/id-context';
import { LabelIcon } from '@trello/nachos/icons/label';
import { usePopover } from '@trello/nachos/popover';
import type { QuickCardEditorTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { LabelsPopover } from 'app/src/components/LabelsPopover';
import { QuickCardEditorButton } from './QuickCardEditorButton';

export const EditLabelsButton: FunctionComponent = () => {
  const cardId = useCardId();

  const { triggerRef, toggle, push, pop, hide, popoverProps } =
    usePopover<HTMLButtonElement>();

  return (
    <>
      <QuickCardEditorButton
        ref={triggerRef}
        icon={<LabelIcon size="small" />}
        onClick={toggle}
        testId={getTestId<QuickCardEditorTestIds>(
          'quick-card-editor-edit-labels',
        )}
        isSelected={popoverProps.isVisible}
        shortcutText={intl.formatMessage({
          id: 'templates.quick_card_editor.open-labels',
          defaultMessage: 'Open labels',
          description: 'Tooltip text for opening the labels popover for a card',
        })}
        shortcutKey={'l'}
        position="right"
      >
        <FormattedMessage
          id="templates.quick_card_editor.edit-labels"
          defaultMessage="Edit labels"
          description="Button text for editing labels"
        />
      </QuickCardEditorButton>
      <LabelsPopover
        hide={hide}
        idCard={cardId}
        pop={pop}
        popoverProps={popoverProps}
        push={push}
        source={'quickCardEditorInlineDialog'}
      />
    </>
  );
};
