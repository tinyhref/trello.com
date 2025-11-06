import type { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';

import { isAtOrOverLimit } from '@trello/business-logic/limit';
import { useBoardId, useListId } from '@trello/id-context';
import { Button } from '@trello/nachos/button';
import { WarningIcon } from '@trello/nachos/icons/warning';
import { token } from '@trello/theme';

import { useCardComposerLimitsBoardFragment } from './CardComposerLimitsBoardFragment.generated';
import { useCardComposerLimitsListFragment } from './CardComposerLimitsListFragment.generated';
import { closeCardComposer } from './cardComposerState';

import * as styles from './CardComposerLimitError.module.less';

export const CardComposerLimitError: FunctionComponent = () => {
  const boardId = useBoardId();
  const listId = useListId();

  const { data: list } = useCardComposerLimitsListFragment({
    from: { id: listId },
    optimistic: true,
  });

  const { data: board } = useCardComposerLimitsBoardFragment({
    from: { id: boardId },
    optimistic: true,
  });

  const boardName = board?.name ?? '';
  const listName = list?.name ?? '';

  const boardLimits = board?.limits?.cards;
  const openPerBoard = boardLimits?.openPerBoard;
  const totalPerBoard = boardLimits?.totalPerBoard;

  const listLimits = list?.limits?.cards;
  const openPerList = listLimits?.openPerList;
  const totalPerList = listLimits?.totalPerList;

  const tooManyOpenCardsPerBoard =
    Boolean(openPerBoard) && isAtOrOverLimit(openPerBoard);
  const tooManyTotalCardsPerBoard =
    Boolean(totalPerBoard) && isAtOrOverLimit(totalPerBoard);

  const tooManyOpenCardsPerList =
    Boolean(openPerList) && isAtOrOverLimit(openPerList);
  const tooManyTotalCardsPerList =
    Boolean(totalPerList) && isAtOrOverLimit(totalPerList);

  const isLimited =
    tooManyOpenCardsPerBoard ||
    tooManyTotalCardsPerBoard ||
    tooManyOpenCardsPerList ||
    tooManyTotalCardsPerList;

  if (!isLimited) {
    return null;
  }

  return (
    <div className={styles.error}>
      <WarningIcon color={token('color.icon.danger', '#C9372C')} />
      <p>
        {tooManyOpenCardsPerBoard ? (
          <FormattedMessage
            id="templates.card_limits_error.too-many-open-cards-per-board"
            defaultMessage="You have too many open cards on “{boardName}”. Archive some to add more."
            description="Error shown when there are too many open cards on the board"
            values={{
              boardName,
            }}
          />
        ) : tooManyTotalCardsPerBoard ? (
          <FormattedMessage
            id="templates.card_limits_error.too-many-total-cards-per-board"
            defaultMessage="You have too many cards on “{boardName}”. Delete some archived cards to add more."
            description="Error shown when there are too many total cards on the board"
            values={{
              boardName,
            }}
          />
        ) : tooManyOpenCardsPerList ? (
          <FormattedMessage
            id="templates.card_limits_error.too-many-open-cards-per-list"
            defaultMessage="You have too many open cards on “{listName}”. Archive some to add more."
            description="Error shown when there are too many open cards on the list"
            values={{
              listName,
            }}
          />
        ) : tooManyTotalCardsPerList ? (
          <FormattedMessage
            id="templates.card_limits_error.too-many-total-cards-per-list"
            defaultMessage="You have too many cards on “{listName}”. Delete some archived cards to add more."
            description="Error shown when there are too many total cards on the list"
            values={{
              listName,
            }}
          />
        ) : null}
      </p>
      <Button
        onClick={() => {
          closeCardComposer();
        }}
      >
        <FormattedMessage
          id="templates.card_limits_error.close"
          defaultMessage="Close"
          description="Text on button that closes the card composer"
        />
      </Button>
    </div>
  );
};
