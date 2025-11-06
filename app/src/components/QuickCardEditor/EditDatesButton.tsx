import { type FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';

import { intl } from '@trello/i18n';
import { useBoardId, useCardId, useWorkspaceId } from '@trello/id-context';
import { ClockIcon } from '@trello/nachos/icons/clock';
import { Popover, usePopover } from '@trello/nachos/popover';
import type { QuickCardEditorTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { LazyCardDateRangePicker } from 'app/src/components/DateRangePicker/LazyCardDateRangePicker';
import { QuickCardEditorButton } from './QuickCardEditorButton';

interface EditDatesButtonProps {
  isCardTemplate: boolean;
  due?: string | null;
  start?: string | null;
  dueReminder?: number | null;
  isPlannerCard: boolean;
}

export const EditDatesButton: FunctionComponent<EditDatesButtonProps> = ({
  isCardTemplate,
  due,
  start,
  dueReminder,
  isPlannerCard,
}) => {
  const cardId = useCardId();
  const boardId = useBoardId();
  const workspaceId = useWorkspaceId();

  const { triggerRef, toggle, hide, popoverProps } =
    usePopover<HTMLButtonElement>();

  if (isCardTemplate) {
    return null;
  }

  return (
    <>
      <QuickCardEditorButton
        icon={<ClockIcon size="small" />}
        onClick={toggle}
        testId={getTestId<QuickCardEditorTestIds>(
          'quick-card-editor-edit-dates',
        )}
        ref={triggerRef}
        isSelected={popoverProps.isVisible}
        shortcutText={intl.formatMessage({
          id: 'templates.quick_card_editor.open-dates',
          defaultMessage: 'Open dates',
          description: 'Tooltip text for opening the dates popover for a card',
        })}
        shortcutKey={isPlannerCard ? '' : 'd'}
        position="right"
      >
        <FormattedMessage
          id="templates.quick_card_editor.edit-dates"
          defaultMessage="Edit dates"
          description="Quick card editor Edit dates button"
        />
      </QuickCardEditorButton>
      <Popover
        {...popoverProps}
        title={
          <FormattedMessage
            id="templates.quick_card_editor.dates"
            defaultMessage="Dates"
            description="Quick card editor Dates title"
          />
        }
        size="medium"
      >
        <LazyCardDateRangePicker
          key="lazy-card-date-range-picker"
          due={due}
          start={start}
          dueReminder={dueReminder}
          hidePopover={hide}
          idCard={cardId}
          idBoard={boardId}
          idOrg={workspaceId}
        />
      </Popover>
    </>
  );
};
