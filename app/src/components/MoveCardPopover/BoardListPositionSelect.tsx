import type { FunctionComponent } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import type { SourceType } from '@trello/analytics-types';
import { intl } from '@trello/i18n';
import { useBoardId, useCardId, useListId } from '@trello/id-context';
import { Button } from '@trello/nachos/button';
import { Select } from '@trello/nachos/select';
import { useSharedStateSelector } from '@trello/shared-state';
import type { MoveCardPopoverTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { legacyBoardModelsSharedState } from 'app/src/components/Board/legacyBoardModelsSharedState';
import { useIsInboxBoard } from 'app/src/components/Inbox';
import { readListVisibleCardsFromCache } from 'app/src/components/List/readListVisibleCardsFromCache';
import { getNonSmartLists } from 'app/src/components/SmartList/getNonSmartLists';
import { useCurrentCardAttributesFragment } from './CurrentCardFragment.generated';
import { useMoveCardCurrentBoardFragment } from './MoveCardCurrentBoardFragment.generated';
import { useMoveCardCurrentListFragment } from './MoveCardCurrentListFragment.generated';
import { MoveCardPopoverLimitExceededMessage } from './MoveCardPopoverLimitExceededMessage';
import { useMoveCardPopoverQuery } from './MoveCardPopoverQuery.generated';
import { useBoardOptionsSelect } from './useBoardOptionsSelect';
import { useCardLimits } from './useCardLimits';
import type { OptionalKeepFromSource } from './useSubmitCopy';
import { useSubmitCopy } from './useSubmitCopy';
import { useSubmitMove } from './useSubmitMove';

import * as styles from './BoardListPositionSelect.module.less';

interface DropdownOption {
  label: string;
  value: string;
  meta?: string;
}

interface IndexDropdownOption {
  label: string;
  value: number;
  meta?: string;
}
export interface MoveCardProps {
  isMove: true;
  isCopy?: false;
  source: SourceType;
  onClose: () => void;
}

export interface CopyCardProps {
  isCopy: true;
  isMove?: false;
  source: SourceType;
  onClose: () => void;
  title: string;
  keepOptions?: OptionalKeepFromSource;
}

export type BoardListPositionSelectProps = CopyCardProps | MoveCardProps;

export const BoardListPositionSelect: FunctionComponent<
  BoardListPositionSelectProps
> = (props) => {
  const { isMove, isCopy, onClose, source } = props;
  const keepOptions = (props as CopyCardProps).keepOptions;

  const isInbox = useIsInboxBoard();

  const board = useSharedStateSelector(
    legacyBoardModelsSharedState,
    useCallback((state) => state.board, []),
  );

  const cardId = useCardId();
  const contextBoardId = useBoardId();
  const contextListId = useListId();

  const modelCacheBoardId = board?.model?.attributes?.id;
  const modelCacheListId = board?.model?.listList?.models?.[0]?.id;

  const defaultBoardId =
    (isMove || isCopy) && modelCacheBoardId && isInbox
      ? modelCacheBoardId
      : contextBoardId;
  const defaultListId =
    (isMove || isCopy) && modelCacheListId && isInbox
      ? modelCacheListId
      : contextListId;

  const currentListCards = readListVisibleCardsFromCache({
    boardId: defaultBoardId,
    listId: defaultListId,
  });
  const currentIndex = currentListCards.findIndex((card) => card.id === cardId);

  const [selectedBoardId, setSelectedBoardId] = useState(defaultBoardId);
  const [selectedListId, setSelectedListId] = useState(defaultListId);
  const [selectedIndex, setSelectedIndex] = useState<number>(currentIndex);

  const { data: currentBoardData } = useMoveCardCurrentBoardFragment({
    from: { id: defaultBoardId },
  });

  const { data: currentListData } = useMoveCardCurrentListFragment({
    from: { id: defaultListId },
  });

  const { data: currentCardData } = useCurrentCardAttributesFragment({
    from: { id: cardId },
    optimistic: true,
  });

  const defaultListName = currentListData?.name;
  const isEnterpriseOwned = currentBoardData?.enterpriseOwned;
  const enterpriseName =
    currentBoardData?.organization?.enterprise?.displayName;
  const cardIsClosed = !!currentCardData?.closed;

  const { data, loading } = useMoveCardPopoverQuery({
    variables: {
      boardId: selectedBoardId,
    },
    waitOn: ['None'],
  });
  const movingWithinSameList = !isInbox && selectedListId === defaultListId;
  const movingWithinSameBoard = !isInbox && selectedBoardId === defaultBoardId;

  const currentString = intl.formatMessage({
    id: 'templates.popover_move_card.current',
    defaultMessage: '(current)',
    description:
      '(current) label on Select dropdown options on move card popover',
  });

  const boardOptions = useBoardOptionsSelect();

  // TODO: update the default board and list for mirror card popover
  const defaultBoardName = currentBoardData?.name;

  // if we don't have data yet, fallback to the list the card is currently on
  const listOptions: DropdownOption[] = useMemo(() => {
    if (!data?.board) {
      return [
        {
          label: defaultListName || '',
          value: defaultListId,
          meta: currentString,
        },
      ];
    }

    const nonSmartLists = getNonSmartLists(data?.board?.lists || []);
    return nonSmartLists.map((list) => ({
      label: list.name,
      value: list.id,
      meta: !isInbox && defaultListId === list.id ? currentString : undefined,
    }));
  }, [data?.board, defaultListName, defaultListId, currentString, isInbox]);

  // if the user has selected a value, use that list value
  // if there's no selected value, use the default as the first list in the
  // board or the current list if the current board is selected
  const currentListOption = useMemo(
    () =>
      listOptions?.find(({ value }) => {
        return value === defaultListId;
      }),
    [listOptions, defaultListId],
  );

  const defaultListOption =
    movingWithinSameBoard && currentListOption
      ? currentListOption
      : listOptions[0];

  let selectedListOption =
    listOptions?.find(({ value }) => {
      return value === selectedListId;
    }) || defaultListOption;

  const numCardsInTargetList = data?.board?.cards
    ? data.board.cards.filter(({ idList }) => idList === selectedListId).length
    : 0;
  let maxIndex = numCardsInTargetList + 1;
  if (isMove && movingWithinSameList && !cardIsClosed) {
    maxIndex = currentListCards.length;
  }

  const indexOptions: IndexDropdownOption[] = useMemo(() => {
    return [...Array(maxIndex).keys()].map((x) => {
      return {
        label: String(x + 1),
        value: x,
        meta:
          selectedListId === defaultListId && currentIndex === x
            ? currentString
            : undefined,
      };
    });
  }, [maxIndex, currentIndex, selectedListId, defaultListId, currentString]);

  let selectedIndexOption = indexOptions[selectedIndex];

  // if there are no lists in the board, render a string for "no lists" and
  // position as "n/a"
  if (!listOptions.length) {
    selectedListOption = {
      label: intl.formatMessage({
        id: 'templates.popover_move_card.no-lists',
        defaultMessage: 'No Lists',
        description: 'no lists label on list Select',
      }),
      value: '',
    };
    selectedIndexOption = {
      label: intl.formatMessage({
        id: 'templates.popover_move_card.n-a',
        defaultMessage: 'N/A',
        description: 'n/a label on position Select when there are no lists',
      }),
      value: -1,
    };
  }

  // if the list value is updated, set the position value to the
  // last position in the selected list or to the current index
  // if the current list is selected
  const defaultIndexOption =
    movingWithinSameList && !cardIsClosed
      ? indexOptions[currentIndex]
      : indexOptions[indexOptions.length - 1];

  useEffect(() => {
    if (!loading) {
      if (selectedListOption) {
        setSelectedListId(selectedListOption.value);
      }
      if (defaultIndexOption) {
        setSelectedIndex(defaultIndexOption.value);
      }
    }
  }, [selectedListOption, defaultIndexOption, loading]);

  const { isOverLimits } = useCardLimits({ cardId, listId: defaultListId });

  const limitsError = isOverLimits(
    selectedBoardId,
    selectedListId,
    isMove,
    keepOptions,
  );

  const { submitCopy } = useSubmitCopy();
  const { submitMove } = useSubmitMove();

  const submitDisabled = !listOptions.length || !!limitsError || loading;

  const onSubmit = useCallback(async () => {
    if (submitDisabled) {
      return;
    }

    if (onClose) {
      onClose();
    }

    if (isMove) {
      await submitMove(
        selectedBoardId,
        selectedListId,
        selectedIndex,
        currentIndex,
        source,
      );
    } else if (isCopy) {
      const { title } = props as CopyCardProps;
      submitCopy(
        selectedBoardId,
        selectedListId,
        selectedIndex,
        title,
        source,
        keepOptions,
      );
    }
  }, [
    submitDisabled,
    onClose,
    isMove,
    isCopy,
    selectedIndex,
    selectedBoardId,
    selectedListId,
    source,
    submitMove,
    currentIndex,
    props,
    keepOptions,
    submitCopy,
  ]);

  const onChangeBoardSelect = useCallback(
    (boardSelectOption: DropdownOption | null) => {
      if (boardSelectOption === null) {
        return;
      }

      setSelectedBoardId(boardSelectOption.value);
    },
    [],
  );

  const onChangeListSelect = useCallback(
    (listSelectOption: DropdownOption | null) => {
      if (listSelectOption === null) {
        return;
      }

      setSelectedListId(listSelectOption.value);
    },
    [],
  );

  const onChangePositionSelect = useCallback(
    (positionSelectOption: IndexDropdownOption | null) => {
      if (positionSelectOption === null) {
        return;
      }

      setSelectedIndex(positionSelectOption.value);
    },
    [],
  );

  return (
    <>
      <div className={styles.formGridSelectContainer}>
        <div className={styles.boardSelectContainer}>
          {!boardOptions.length ? (
            <>
              <h3 className={styles.selectLabel}>
                {intl.formatMessage({
                  id: 'templates.popover_move_card.board',
                  defaultMessage: 'Board',
                  description:
                    'Board label on move card popover when no board options',
                })}
              </h3>
              <p>{defaultBoardName}</p>
            </>
          ) : (
            <>
              <label
                htmlFor="move-card-board-select"
                className={styles.selectLabel}
              >
                <FormattedMessage
                  id="templates.popover_move_card.board"
                  defaultMessage="Board"
                  description="Board Select label on move card popover"
                />
              </label>
              <Select
                inputId="move-card-board-select"
                options={boardOptions}
                defaultValue={{
                  label: defaultBoardName || '',
                  value: defaultBoardId,
                }}
                onChange={onChangeBoardSelect}
                isSearchable
                testId={getTestId<MoveCardPopoverTestIds>(
                  'move-card-popover-select-board-destination',
                )}
                descriptionId={
                  isEnterpriseOwned && enterpriseName
                    ? 'enterprise-board-message'
                    : undefined
                }
              />
            </>
          )}
          {isEnterpriseOwned && enterpriseName && (
            <div
              className={styles.enterpriseBoardMessage}
              id="enterprise-board-message"
            >
              {isMove && (
                <FormattedMessage
                  id="templates.popover_move_card.card-can-only-be-moved-to-orgs-within-ent"
                  defaultMessage="This card can only be moved to Workspaces within {enterpriseName}."
                  description="Move card enterprise message on move card popover"
                  values={{
                    enterpriseName,
                  }}
                />
              )}
              {isCopy && (
                <FormattedMessage
                  id="templates.card_copy.card-can-only-be-copied-to-orgs-within-ent"
                  defaultMessage="This card can only be copied to Workspaces within {enterpriseName}."
                  description="Copy card enterprise message on move card popover"
                  values={{
                    enterpriseName,
                  }}
                />
              )}
            </div>
          )}
        </div>
        <div className={styles.listSelectContainer}>
          <label htmlFor="move-card-list-select" className={styles.selectLabel}>
            <FormattedMessage
              id="templates.popover_move_card.list"
              defaultMessage="List"
              description="List Select label on move card popover"
            />
          </label>
          <Select
            inputId="move-card-list-select"
            options={listOptions}
            value={selectedListOption}
            onChange={onChangeListSelect}
            isSearchable
            isDisabled={!listOptions.length}
            testId={getTestId<MoveCardPopoverTestIds>(
              'move-card-popover-select-list-destination',
            )}
            defaultValue={{
              label: defaultListName || '',
              value: defaultListId,
            }}
          />
        </div>
        <div className={styles.positionSelectContainer}>
          <label
            htmlFor="move-card-board-list-position-select"
            className={styles.selectLabel}
          >
            <FormattedMessage
              id="templates.popover_move_card.position"
              defaultMessage="Position"
              description="Position Select label on move card popover"
            />
          </label>
          <Select
            inputId="move-card-board-list-position-select"
            options={indexOptions}
            value={selectedIndexOption}
            onChange={onChangePositionSelect}
            isSearchable
            isDisabled={!listOptions.length}
            testId={getTestId<MoveCardPopoverTestIds>(
              'move-card-popover-select-position',
            )}
            defaultValue={{
              label: String(currentIndex + 1),
              value: currentIndex,
            }}
          />
        </div>
      </div>
      <Button
        appearance={'primary'}
        size="wide"
        isDisabled={submitDisabled}
        isLoading={loading}
        onClick={onSubmit}
        className={styles.button}
        testId={getTestId<MoveCardPopoverTestIds>(
          'move-card-popover-move-button',
        )}
      >
        {isMove ? (
          <FormattedMessage
            id="templates.popover_move_card.move"
            defaultMessage="Move"
            description="Move card button text on move card popover"
          />
        ) : (
          <FormattedMessage
            id="templates.card_copy.create-card"
            defaultMessage="Create card"
            description="Create card button text on move card popover"
          />
        )}
      </Button>
      {limitsError && !loading && (
        <MoveCardPopoverLimitExceededMessage
          cardId={cardId}
          errorMessage={limitsError}
          source={source}
        />
      )}
    </>
  );
};
