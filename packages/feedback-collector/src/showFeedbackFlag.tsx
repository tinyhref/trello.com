import type { FlagId } from '@trello/analytics-types';
import { forTemplate } from '@trello/legacy-i18n';
import { showFlag, type ShowFlagArgs } from '@trello/nachos/experimental-flags';

export const showFeedbackFlag = ({
  id,
  ...rest
}: Partial<Omit<ShowFlagArgs, 'id'>> & { id: FlagId }) => {
  const format = forTemplate('feedback_collector');
  showFlag({
    id,
    appearance: 'success',
    description: format('flag-success-description'),
    title: format('flag-success-title'),
    ...rest,
  });
};
