import cx from 'classnames';
import { useCallback, useMemo, type FunctionComponent } from 'react';

import { Analytics } from '@trello/atlassian-analytics';
import { useSharedStateSelector } from '@trello/shared-state';
import { getTestId } from '@trello/test-ids';

import { useCanEditBoard } from 'app/src/components/BoardPermissionsContext';
import {
  cardComposerState,
  openCardComposer,
} from 'app/src/components/CardComposer';

import * as styles from './ListCardGap.module.less';

interface ListCardGapProps {
  prevPosition: number;
  position: number;
  nextPosition: number;
  listId: string;
  className?: string;
  filtered?: boolean;
}

export const ListCardGap: FunctionComponent<ListCardGapProps> = ({
  prevPosition,
  position,
  nextPosition,
  listId,
  className,
  filtered,
}) => {
  const canEditBoard = useCanEditBoard();

  const cardComposerPositionInList = useSharedStateSelector(
    cardComposerState,
    useCallback(
      ({ listId: activeListId, position: activePosition }) => {
        if (activeListId !== listId || typeof activePosition !== 'number') {
          return -1;
        }
        return activePosition;
      },
      [listId],
    ),
  );

  const isCardComposerOpenInCurrentPositionalRange = useMemo(
    () =>
      cardComposerPositionInList > prevPosition &&
      cardComposerPositionInList >= position &&
      cardComposerPositionInList < nextPosition,
    [cardComposerPositionInList, prevPosition, position, nextPosition],
  );

  const onClick = useCallback(() => {
    if (!canEditBoard) {
      return;
    }

    Analytics.sendUIEvent({
      action: 'opened',
      actionSubject: 'cardComposer',
      source: 'boardScreen',
      attributes: {
        method: 'listCardGap',
      },
    });

    openCardComposer({ position, listId });
  }, [canEditBoard, listId, position]);

  if (!filtered || isCardComposerOpenInCurrentPositionalRange) {
    return null;
  }

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className={cx(styles.listCardGap, className, {
        [styles.disabled]: !canEditBoard,
      })}
      onClick={onClick}
      data-testid={getTestId('list-card-gap')}
    >
      <div className={styles.hoverBar} />
      <div className={styles.hoverIcon} />
      <div className={styles.hoverBar} />
    </div>
  );
};
