import type { FunctionComponent } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { classForDueDate, titleForDueDate } from '@trello/dates';
import { getStringForCombinedDateBadge } from '@trello/dates/i18n';
import { useFeatureGate } from '@trello/feature-gate-client';
import { ClockIcon } from '@trello/nachos/icons/clock';
import type { BadgesTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import type { BadgeProps } from './Badge';
import { Badge } from './Badge';
import { RecurrenceDueDateBadge } from './RecurrenceDueDateBadge';

interface DueDateBadgeProps {
  startDate?: Date;
  dueDate?: Date;
  dueComplete?: boolean;
}

export const DueDateBadge: FunctionComponent<DueDateBadgeProps> = ({
  startDate,
  dueDate,
  dueComplete,
}) => {
  const [dueClass, setDueClass] = useState<string | null>(() =>
    dueDate ? classForDueDate(dueDate, dueComplete, Date.now()) : null,
  );

  const updateDueClass = useCallback(() => {
    setDueClass(
      dueDate ? classForDueDate(dueDate, dueComplete, Date.now()) : null,
    );
  }, [dueComplete, dueDate]);

  /**
   * Periodically update the dueClass variable, so we can keep the color of
   * the badge up to date. But avoid listening to this event if the dueDate
   * has not been set or if it has already been marked as complete.
   */
  useEffect(() => {
    updateDueClass();

    if (dueDate && !dueComplete) {
      const intervalId = window.setInterval(() => updateDueClass(), 10 * 1000);
      return () => window.clearInterval(intervalId);
    }
  }, [dueComplete, dueDate, updateDueClass]);

  const badgeColorProps: Pick<BadgeProps, 'color' | 'isBold'> | null =
    useMemo(() => {
      if (!dueDate) {
        return null;
      }

      if (dueComplete) {
        return { color: 'green', isBold: true };
      }

      switch (dueClass) {
        case 'is-due-soon':
          return { color: 'yellow', isBold: true };
        case 'is-due-past':
          return { color: 'red' };
        case 'is-due-now':
          return { color: 'red', isBold: true };
        default:
          return null;
      }
    }, [dueDate, dueClass, dueComplete]);

  return (
    <Badge
      Icon={ClockIcon}
      title={dueDate ? titleForDueDate(dueDate, dueComplete) : undefined}
      testId={
        dueComplete
          ? getTestId<BadgesTestIds>('badge-due-date-completed')
          : getTestId<BadgesTestIds>('badge-due-date-not-completed')
      }
      {...badgeColorProps}
    >
      {getStringForCombinedDateBadge(startDate, dueDate)}
    </Badge>
  );
};

interface DueDateBadgeWrapperProps {
  due?: string | null;
  start?: string | null;
  dueComplete?: boolean;
  isTemplate?: boolean;
  isRepeating?: boolean;
}

// Thin layer around DueDateBadge to avoid excessive rendering.
export const DueDateBadgeWrapper: FunctionComponent<
  DueDateBadgeWrapperProps
> = ({ due, start, dueComplete, isTemplate, isRepeating }) => {
  const { value: isRecurringTasksEnabled } = useFeatureGate(
    'billplat_recurring_tasks',
  );

  if ((!due && !start) || isTemplate) {
    return null;
  }

  // Branch between old and new component based on feature gate and recurrence
  if (isRecurringTasksEnabled && isRepeating) {
    return (
      <RecurrenceDueDateBadge
        startDate={start ? new Date(start) : undefined}
        dueDate={due ? new Date(due) : undefined}
        dueComplete={dueComplete}
        isRepeating={isRepeating && isRecurringTasksEnabled}
      />
    );
  }

  return (
    <DueDateBadge
      startDate={start ? new Date(start) : undefined}
      dueDate={due ? new Date(due) : undefined}
      dueComplete={dueComplete}
    />
  );
};
