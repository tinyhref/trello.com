import type { FunctionComponent } from 'react';
import { useCallback } from 'react';

import CalendarPlusIcon from '@atlaskit/icon/core/calendar-plus';
import { LabsLozenge } from '@trello/ai-labs';
import { Analytics } from '@trello/atlassian-analytics';
import { useCardId } from '@trello/id-context';
import { token } from '@trello/theme';

import { useSmartScheduleCards } from 'app/src/components/SmartSchedule';
import { QuickCardEditorButton } from './QuickCardEditorButton';

import * as styles from './ScheduleCardButton.module.less';

interface ScheduleCardButtonProps {
  onClose: () => void;
}

export const ScheduleCardButton: FunctionComponent<ScheduleCardButtonProps> = ({
  onClose,
}) => {
  const cardId = useCardId();
  const { handleSmartScheduleCards } = useSmartScheduleCards();

  const handleSchedule = useCallback(() => {
    Analytics.sendClickedButtonEvent({
      buttonName: 'smartScheduleButton',
      source: 'quickEditOverlay',
      attributes: {
        numSelectedCards: 1,
      },
    });

    onClose();

    handleSmartScheduleCards({ cardId, source: 'quickEditOverlay' });
  }, [cardId, handleSmartScheduleCards, onClose]);

  return (
    <QuickCardEditorButton
      icon={<CalendarPlusIcon label="Schedule" />}
      style={{
        display: 'flex',
        gap: token('space.100', '8px'),
      }}
      onClick={handleSchedule}
      className={styles.scheduleButton}
    >
      <span className={styles.scheduleButtonText}>
        {/* TODO: i18n */}
        Schedule
        <LabsLozenge />
      </span>
    </QuickCardEditorButton>
  );
};
