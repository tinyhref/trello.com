import type { CSSProperties, FunctionComponent } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import RepeatIcon from '@atlaskit/icon-lab/core/repeat';
import { classForDueDate, titleForDueDate } from '@trello/dates';
import { getStringForCombinedDateBadge } from '@trello/dates/i18n';
import { ClockIcon } from '@trello/nachos/icons/clock';
import type { BadgesTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import type { BadgeProps } from './Badge';
import { Badge } from './Badge';

import * as styles from './RecurrenceDueDateBadge.module.less';

interface RecurrenceDueDateBadgeProps {
  startDate?: Date;
  dueDate?: Date;
  dueComplete?: boolean;
  isRepeating?: boolean;
}

export const RecurrenceDueDateBadge: FunctionComponent<
  RecurrenceDueDateBadgeProps
> = ({ startDate, dueDate, dueComplete, isRepeating = false }) => {
  const [dueClass, setDueClass] = useState<string | null>(() =>
    dueDate ? classForDueDate(dueDate, dueComplete, Date.now()) : null,
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [showNewDate, setShowNewDate] = useState(false);
  const [fadeInNewDate, setFadeInNewDate] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [showCheckmark, setShowCheckmark] = useState(false);
  const [skeletonWidth, setSkeletonWidth] = useState(60);
  const prevDueDateRef = useRef<Date | undefined>(dueDate);
  const isAnimatingRef = useRef<boolean>(false);

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

    if (dueComplete) {
      prevDueDateRef.current = dueDate;
    }

    if (dueDate && !dueComplete) {
      if (!isAnimatingRef.current) {
        setShowNewDate(true);
      }
      const intervalId = window.setInterval(() => updateDueClass(), 10 * 1000);
      return () => window.clearInterval(intervalId);
    }
  }, [dueComplete, dueDate, updateDueClass]);

  useEffect(() => {
    if (dueDate) {
      const dateText = getStringForCombinedDateBadge(startDate, dueDate);
      const estimatedWidth = dateText.length * 8;
      setSkeletonWidth(Math.max(estimatedWidth, 40));
    }
  }, [dueDate, startDate]);

  /**
   * Handle processing state when dueComplete changes
   */
  const startRecurrenceAnimation = useCallback(() => {
    isAnimatingRef.current = true;

    setShowNewDate(false);
    setFadeInNewDate(false);
    setShowCheckmark(true);

    setTimeout(() => {
      setRotation((prev) => prev + 360);
      setIsProcessing(true);
      setShowCheckmark(false);

      // Wait for rotation animation to complete (500ms) before showing new date
      setTimeout(() => {
        setShowNewDate(true);
        setFadeInNewDate(true);
        setIsProcessing(false);
        isAnimatingRef.current = false;
      }, 500);
    }, 1000);
  }, []);

  useEffect(() => {
    // If we're animating, ignore all state changes for the duration of the animation
    if (isAnimatingRef.current) {
      return;
    }

    if (dueComplete && isRepeating) {
      startRecurrenceAnimation();
    }
  }, [dueComplete, isRepeating, startRecurrenceAnimation]);

  const badgeColorProps: Pick<BadgeProps, 'color' | 'isBold'> | null =
    useMemo(() => {
      if (!dueDate) {
        return null;
      }

      if (showCheckmark || dueComplete) {
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
    }, [dueDate, dueClass, showCheckmark, dueComplete]);

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
      <div className={styles.badgeContent}>
        {isProcessing ? (
          <div
            className={styles.dueDateSkeletonPulse}
            style={
              {
                '--skeleton-width': `${skeletonWidth}px`,
              } as CSSProperties
            }
          />
        ) : showNewDate ? (
          <span className={fadeInNewDate ? styles.dueDateFadeIn : ''}>
            {getStringForCombinedDateBadge(startDate, dueDate)}
          </span>
        ) : (
          <span>
            {getStringForCombinedDateBadge(
              startDate,
              prevDueDateRef.current || dueDate,
            )}
          </span>
        )}
        {isRepeating && (
          <div
            className={`${styles.repeatIcon} ${isProcessing ? styles.repeatIconProcessing : styles.repeatIconNormal}`}
            style={{
              transform: `rotate(${rotation}deg)`,
            }}
            data-testid="repeat-icon"
          >
            <RepeatIcon size="small" label="repeat-icon" />
          </div>
        )}
      </div>
    </Badge>
  );
};
