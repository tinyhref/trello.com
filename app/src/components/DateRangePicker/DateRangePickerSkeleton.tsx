import type { FunctionComponent } from 'react';

import type { DateRangePickerTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import * as styles from './DateRangePickerSkeleton.module.less';

export const DateRangePickerSkeleton: FunctionComponent<{
  disableStartDate?: boolean;
}> = ({ disableStartDate = false }) => (
  <div
    data-testid={getTestId<DateRangePickerTestIds>(
      'date-range-picker-skeleton',
    )}
  >
    <div className={styles.calendar} />

    {!disableStartDate && <div className={styles.dateField} />}
    <div className={styles.dateField} />

    <div className={styles.dueReminderField} />
    <div className={styles.dueReminderClarification} />

    <div className={styles.buttons}>
      <div className={styles.button} />
      <div className={styles.button} />
    </div>
  </div>
);
