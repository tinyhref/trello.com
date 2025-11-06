import type { FunctionComponent } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import type { SourceType } from '@trello/analytics-types';
import { Analytics } from '@trello/atlassian-analytics';
import { client } from '@trello/graphql';
import type { BoardListsContextCardFragment } from '@trello/graphql/fragments';
import { BoardListsContextCardFragmentDoc } from '@trello/graphql/fragments';
import { intl } from '@trello/i18n';
import { Button } from '@trello/nachos/button';
import { showFlag } from '@trello/nachos/experimental-flags';
import { Select } from '@trello/nachos/select';
import { useSharedStateSelector } from '@trello/shared-state';
import type { MoveCardPopoverTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { legacyBoardModelsSharedState } from 'app/src/components/Board/legacyBoardModelsSharedState';
import { bulkActionSelectedCardsSharedState } from 'app/src/components/BulkAction/bulkActionSelectedCardsSharedState';
import { useIsInboxBoard } from 'app/src/components/Inbox';
import { getNonSmartLists } from 'app/src/components/SmartList/getNonSmartLists';
import { useMoveCardCurrentBoardFragment } from './MoveCardCurrentBoardFragment.generated';
import { useMoveCardPopoverQuery } from './MoveCardPopoverQuery.generated';
import { useBoardOptionsSelect } from './useBoardOptionsSelect';
import { useBulkCardCopy } from './useBulkCardCopy';
import { useBulkCardMove } from './useBulkCardMove';
import type { OptionalKeepFromSource } from './useSubmitCopy';

// eslint-disable-next-line @trello/less-matches-component
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
  boardId: string;
}

export interface CopyCardProps {
  isCopy: true;
  isMove?: false;
  source: SourceType;
  onClose: () => void;
  title: string;
  keepOptions?: OptionalKeepFromSource;
  boardId: string;
}

export type BoardListPositionSelectBulkProps = CopyCardProps | MoveCardProps;

export const BoardListPositionSelectBulk: FunctionComponent<
  BoardListPositionSelectBulkProps
> = (props) => {
  const { isMove, isCopy, onClose, source, boardId } = props;
  const keepOptions = (props as CopyCardProps).keepOptions;

  const isInbox = useIsInboxBoard();

  const board = useSharedStateSelector(
    legacyBoardModelsSharedState,
    useCallback((state) => state.board, []),
  );

  const modelCacheBoardId = board?.model?.attributes?.id;

  const defaultBoardId =
    (isMove || isCopy) && modelCacheBoardId && isInbox
      ? modelCacheBoardId
      : boardId;

  const [selectedBoardId, setSelectedBoardId] = useState(defaultBoardId);
  const [selectedListId, setSelectedListId] = useState('');
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const { data: currentBoardData } = useMoveCardCurrentBoardFragment({
    from: { id: defaultBoardId },
  });

  const isEnterpriseOwned = currentBoardData?.enterpriseOwned;
  const enterpriseName =
    currentBoardData?.organization?.enterprise?.displayName;

  const { data, loading } = useMoveCardPopoverQuery({
    variables: {
      boardId: selectedBoardId,
    },
    waitOn: ['None'],
  });

  const boardOptions = useBoardOptionsSelect();

  // TODO: update the default board and list for mirror card popover
  const defaultBoardName = currentBoardData?.name;

  // if we don't have data yet, fallback to the list the card is currently on
  const listOptions: DropdownOption[] = useMemo(() => {
    if (!data?.board) {
      return [
        {
          label: '',
          value: '',
        },
      ];
    }

    const nonSmartLists = getNonSmartLists(data?.board?.lists || []);
    return nonSmartLists.map((list) => ({
      label: list.name,
      value: list.id,
    }));
  }, [data?.board]);

  const defaultListOption = {
    label: '',
    value: '',
  };

  let selectedListOption =
    listOptions?.find(({ value }) => {
      return value === selectedListId;
    }) || defaultListOption;

  const numCardsInTargetList = data?.board?.cards
    ? data.board.cards.filter(({ idList }) => idList === selectedListId).length
    : 0;
  const maxIndex = numCardsInTargetList + 1;

  const indexOptions: IndexDropdownOption[] = useMemo(() => {
    return [...Array(maxIndex).keys()].map((x) => {
      return {
        label: String(x + 1),
        value: x,
      };
    });
  }, [maxIndex]);

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
  const defaultIndexOption = indexOptions[indexOptions.length - 1];

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

  // TODO: figure out the best way to handle limits for a selection of cards

  const { bulkMoveCards } = useBulkCardMove();
  const { bulkCopyCards } = useBulkCardCopy();

  const bulkActionSelectedCards = useSharedStateSelector(
    bulkActionSelectedCardsSharedState,
    useCallback(
      (state) => {
        return Object.keys(state.selectedCards[boardId] ?? {});
      },
      [boardId],
    ),
  );

  const submitDisabled = !listOptions.length || loading;

  const onSubmit = useCallback(async () => {
    if (submitDisabled) {
      return;
    }

    if (onClose) {
      onClose();
    }

    if (isMove) {
      if (bulkActionSelectedCards.length > 0) {
        Analytics.sendClickedButtonEvent({
          buttonName: 'bulkMoveToBoard',
          source: 'inboxBulkMoveModal',
        });
        try {
          const firstCard = client.readFragment<BoardListsContextCardFragment>(
            {
              id: `Card:${bulkActionSelectedCards[0]}`,
              fragment: BoardListsContextCardFragmentDoc,
            },
            true,
          );

          await bulkMoveCards({
            cardIds: bulkActionSelectedCards,
            idBoard: boardId,
            listId: firstCard?.idList,
            posIndex: selectedIndex,
            targetBoardId: selectedBoardId,
            targetListId: selectedListId,
            source,
          });
        } catch (error) {
          console.error('Bulk move failed:', error);
          showFlag({
            id: 'card-move-popover-move-submit',
            title: intl.formatMessage({
              id: 'templates.popover_move_card.could-not-move-card',
              defaultMessage: 'Moving card failed',
              description: 'Moving card failed error flag message',
            }),
            appearance: 'error',
            isAutoDismiss: true,
          });
        }
      }
    } else if (isCopy) {
      if (bulkActionSelectedCards.length > 0) {
        Analytics.sendClickedButtonEvent({
          buttonName: 'bulkCopyToBoard',
          source: 'inboxBulkCopyModal',
          attributes: {
            numSelectedCards: bulkActionSelectedCards.length,
          },
        });
        bulkActionSelectedCardsSharedState.setValue((prevState) => ({
          ...prevState,
          isLoading: true,
        }));
        try {
          await bulkCopyCards({
            cardIds: bulkActionSelectedCards,
            idBoard: boardId,
            posIndex: selectedIndex,
            targetBoardId: selectedBoardId,
            targetListId: selectedListId,
            source,
            title: (props as CopyCardProps).title,
            keepOptions,
          });
          // This need to be an updater function because of how shared state for objects is handled
          bulkActionSelectedCardsSharedState.setValue(() => ({
            selectedCards: {},
            isLoading: false,
          }));
        } catch (error) {
          console.error('Bulk copy failed:', error);
          showFlag({
            id: 'card-copy-popover-copy-submit',
            title: intl.formatMessage({
              id: 'templates.card_copy.copy-card-error',
              defaultMessage: 'Unable to copy card',
              description: 'Copying card failed error flag message',
            }),
            appearance: 'error',
            isAutoDismiss: true,
          });
          bulkActionSelectedCardsSharedState.setValue((prevState) => ({
            ...prevState,
            isLoading: false,
          }));
        }
      }
    }
  }, [
    submitDisabled,
    onClose,
    isMove,
    isCopy,
    bulkActionSelectedCards,
    bulkMoveCards,
    boardId,
    selectedIndex,
    selectedBoardId,
    selectedListId,
    source,
    bulkCopyCards,
    props,
    keepOptions,
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
            // defaultValue={{
            //   label: '',
            //   value: '',
            // }}
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
            // defaultValue={{
            //   label: String(currentIndex + 1),
            //   value: currentIndex,
            // }}
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
    </>
  );
};
