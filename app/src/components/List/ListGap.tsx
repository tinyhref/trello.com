import cx from 'classnames';
import { useCallback, useMemo, type FunctionComponent } from 'react';

import { Analytics } from '@trello/atlassian-analytics';
import { useFeatureGate } from '@trello/feature-gate-client';
import { useSharedStateSelector } from '@trello/shared-state';
import { getTestId } from '@trello/test-ids';

import { useCanEditBoard } from 'app/src/components/BoardPermissionsContext';
import {
  listComposerState,
  openListComposer,
} from 'app/src/components/ListComposer/listComposerState';

import * as styles from './ListGap.module.less';

interface ListGapProps {
  prevPosition: number;
  position: number;
  nextPosition: number;
}

export const ListGap: FunctionComponent<ListGapProps> = ({
  prevPosition,
  position,
  nextPosition,
}) => {
  const { value: isHoverInbetweenEnabled } = useFeatureGate(
    'trello_hover_inbetween_lists',
  );

  const canEditBoard = useCanEditBoard();

  const listComposerPositionInBoard = useSharedStateSelector(
    listComposerState,
    useCallback(({ position: activePosition }) => {
      if (typeof activePosition !== 'number') {
        return -1;
      }
      return activePosition;
    }, []),
  );

  const isListComposerOpenInCurrentPositionalRange = useMemo(
    () =>
      listComposerPositionInBoard > prevPosition &&
      listComposerPositionInBoard >= position &&
      listComposerPositionInBoard < nextPosition,
    [listComposerPositionInBoard, prevPosition, position, nextPosition],
  );

  const onClick = useCallback(() => {
    if (!canEditBoard) {
      return;
    }

    Analytics.sendUIEvent({
      action: 'opened',
      actionSubject: 'listComposer',
      source: 'boardScreen',
      attributes: {
        method: 'listGap',
      },
    });

    openListComposer({ position });
  }, [canEditBoard, position]);

  if (!isHoverInbetweenEnabled || isListComposerOpenInCurrentPositionalRange) {
    return null;
  }

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className={cx(styles.listGap, {
        [styles.disabled]: !canEditBoard,
      })}
      onClick={onClick}
      data-testid={getTestId('list-hover-gap')}
    >
      <div className={styles.hoverBar} />
      <div className={styles.hoverIcon} />
      <div className={styles.hoverBar} />
    </div>
  );
};
