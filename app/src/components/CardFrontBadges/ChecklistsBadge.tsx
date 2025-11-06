import type { FunctionComponent } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';

import { classForDueDate } from '@trello/dates';
import { formatHumanDate } from '@trello/dates/i18n';
import { ChecklistIcon } from '@trello/nachos/icons/checklist';
import type { BadgesTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { useIsInboxBoard } from 'app/src/components/Inbox';
import type { BadgeProps } from './Badge';
import { Badge } from './Badge';

interface ChecklistsBadgeProps {
  total: number | undefined;
  completed: number | undefined;
  due: string | null | undefined;
}

export const ChecklistsBadge: FunctionComponent<ChecklistsBadgeProps> = ({
  total,
  completed,
  due,
}) => {
  const intl = useIntl();
  const isInbox = useIsInboxBoard();

  const dueComplete = completed === total;
  const dueDate = useMemo(() => {
    return due ? new Date(due) : null;
  }, [due]);

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
    // Immediately update the class when the due date or complete fields change.
    updateDueClass();

    if (dueDate && !dueComplete) {
      const intervalId = window.setInterval(() => updateDueClass(), 10 * 1000);
      return () => window.clearInterval(intervalId);
    }
  }, [dueComplete, dueDate, updateDueClass]);

  const formattedDueDate = dueDate ? formatHumanDate(dueDate) : null;

  const props: BadgeProps = {
    color: undefined,
    isBold: false,
    title: intl.formatMessage({
      id: 'templates.badge.checkitems',
      defaultMessage: 'Checklist items',
      description: 'Badge that indicates that a card has checklist items.',
    }),
    testId: due
      ? getTestId<BadgesTestIds>('checklist-item-due-date-badge')
      : getTestId<BadgesTestIds>('checklist-badge'),
  };

  if (completed === total) {
    props.color = 'green';
    props.isBold = true;
  } else if (due) {
    if (dueClass === 'is-due-past') {
      props.color = 'red';
    } else if (dueClass === 'is-due-now') {
      props.color = 'red';
      props.isBold = true;
    } else if (dueClass === 'is-due-soon') {
      props.color = 'yellow';
      props.isBold = true;
    }
  }

  if (!total || isInbox) {
    return null;
  }

  return (
    <Badge Icon={ChecklistIcon} {...props}>
      {completed}/{total} {formattedDueDate && ` • ${formattedDueDate}`}
    </Badge>
  );
};
