import type { FunctionComponent, MouseEventHandler } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import StarStarredIcon from '@atlaskit/icon/core/star-starred';
import StarUnstarredIcon from '@atlaskit/icon/core/star-unstarred';
import { TrelloUserAri } from '@atlassian/ari';
import { Analytics } from '@trello/atlassian-analytics';
import { isMemberLoggedIn, useMemberId } from '@trello/authentication';
import { DynamicButton } from '@trello/dynamic-tokens';
import { intl } from '@trello/i18n';
import { useBoardId } from '@trello/id-context';
import { Tooltip } from '@trello/nachos/tooltip';

import { Util } from 'app/scripts/lib/util';
import { useNativeGraphqlMigrationMilestone3 } from 'app/src/components/App/useNativeGraphqlMigrationMilestone3';
import { useBoardHeaderAddBoardStarMutation } from './BoardHeaderAddBoardStarMutation.generated';
import { useBoardHeaderRemoveBoardStarMutation } from './BoardHeaderRemoveBoardStarMutation.generated';
import { useBoardHeaderStarButtonFragment } from './BoardHeaderStarButtonFragment.generated';
import { useTrelloBoardHeaderAddBoardStarMutation } from './TrelloBoardHeaderAddBoardStarMutation.generated';
import { useTrelloBoardHeaderRemoveBoardStarMutation } from './TrelloBoardHeaderRemoveBoardStarMutation.generated';
import { useTrelloBoardHeaderStarButtonFragment } from './TrelloBoardHeaderStarButtonFragment.generated';

import * as styles from './BoardHeaderStarButton.module.less';

interface Props {
  boardId: string;
  isClosed: boolean;
  isTemplate: boolean;
}

export const BoardHeaderStarButton: FunctionComponent<Props> = ({
  boardId,
  isClosed,
  isTemplate,
}) => {
  const memberId = useMemberId();
  const nativeBoardId = useBoardId(true);
  const [pendingChange, setPendingChange] = useState<
    'none' | 'starring' | 'unstarring'
  >('none');

  const [removeBoardStar] = useBoardHeaderRemoveBoardStarMutation();
  const [addBoardStar] = useBoardHeaderAddBoardStarMutation();
  const [trelloAddBoardStar] = useTrelloBoardHeaderAddBoardStarMutation();
  const [trelloRemoveBoardStar] = useTrelloBoardHeaderRemoveBoardStarMutation();
  const shouldUseNativeGraphQL = useNativeGraphqlMigrationMilestone3();
  const memberAri = TrelloUserAri.create({ userId: memberId }).toString();

  const { data: boardStarsData } = useBoardHeaderStarButtonFragment({
    from: { id: memberId },
  });

  const { data: nativeBoardStarsData } = useTrelloBoardHeaderStarButtonFragment(
    {
      from: { id: memberAri },
    },
  );

  const { nativeBoardStars, nonNativeBoardStars } = useMemo(() => {
    const native = nativeBoardStarsData?.boardStars?.edges ?? [];
    const nonNative = boardStarsData?.boardStars ?? [];
    return { nativeBoardStars: native, nonNativeBoardStars: nonNative };
  }, [boardStarsData?.boardStars, nativeBoardStarsData?.boardStars?.edges]);

  const boardStar = useMemo(
    () =>
      shouldUseNativeGraphQL
        ? nativeBoardStars.find((star) => star.boardObjectId === boardId)
        : nonNativeBoardStars.find((star) => star.idBoard === boardId),
    [boardId, nativeBoardStars, nonNativeBoardStars, shouldUseNativeGraphQL],
  );

  const boardStarPosition = useMemo(
    () =>
      shouldUseNativeGraphQL
        ? nativeBoardStars.map(({ position }) => position)
        : nonNativeBoardStars.map(({ pos }) => pos),
    [nativeBoardStars, nonNativeBoardStars, shouldUseNativeGraphQL],
  );

  useEffect(() => {
    if (
      (pendingChange === 'starring' && boardStar) ||
      (pendingChange === 'unstarring' && !boardStar)
    ) {
      setPendingChange('none');
    }
  }, [boardStar, pendingChange]);

  const onClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    async (e) => {
      const taskName = 'edit-member/boardStars';
      const source = 'boardHeaderStarButton';
      const traceId = Analytics.startTask({
        taskName,
        source,
      });

      if (boardStar) {
        try {
          setPendingChange('unstarring');
          if (shouldUseNativeGraphQL) {
            await trelloRemoveBoardStar({
              variables: {
                input: {
                  boardStarId: boardStar.id,
                  userId: memberAri,
                },
              },
              context: { traceId },
            });
          } else {
            await removeBoardStar({
              variables: {
                traceId,
                boardStarId: boardStar.id,
                memberId,
              },
            });
          }
          Analytics.taskSucceeded({
            attributes: {
              action: 'removed',
            },
            taskName,
            traceId,
            source,
          });
        } catch (error) {
          Analytics.taskFailed({
            attributes: {
              action: 'removed',
            },
            taskName,
            traceId,
            source,
            error,
          });
        }
      } else {
        try {
          setPendingChange('starring');
          const position = Math.max(0, ...boardStarPosition) + Util.spacing;
          if (shouldUseNativeGraphQL) {
            await trelloAddBoardStar({
              variables: {
                input: {
                  boardId: nativeBoardId,
                  position,
                  userId: memberAri,
                },
              },
              context: { traceId },
            });
          } else {
            await addBoardStar({
              variables: {
                traceId,
                boardId,
                memberId,
                pos: position,
              },
            });
          }
          Analytics.taskSucceeded({
            attributes: {
              action: 'added',
            },
            taskName,
            traceId,
            source,
          });
        } catch (error) {
          Analytics.taskFailed({
            attributes: {
              action: 'added',
            },
            taskName,
            traceId,
            source,
            error,
          });
        }
      }
    },
    [
      addBoardStar,
      boardId,
      boardStar,
      boardStarPosition,
      memberAri,
      memberId,
      nativeBoardId,
      removeBoardStar,
      shouldUseNativeGraphQL,
      trelloAddBoardStar,
      trelloRemoveBoardStar,
    ],
  );

  const showFilledIcon =
    pendingChange === 'starring' || (pendingChange === 'none' && boardStar);

  if (!isMemberLoggedIn() || isClosed) {
    return null;
  }

  return (
    <Tooltip
      content={
        isTemplate ? (
          <FormattedMessage
            id="templates.board_header.click-to-star-or-unstar-this-template-starred-templates-show-up-at-the-top-of-your-boards-list"
            defaultMessage="Click to star or unstar this template. Starred templates show up at the top of your boards list."
            description="Tooltip to star or unstar a board when the board is a template"
          />
        ) : (
          <FormattedMessage
            id="templates.board_header.click-to-star-or-unstar-this-board-starred-boards-show-up-at-the-top-of-your-boards-list"
            defaultMessage="Click to star or unstar this board. Starred boards show up at the top of your boards list."
            description="Tooltip to star or unstar a board"
          />
        )
      }
    >
      <DynamicButton
        className={styles.boardStarButton}
        onClick={
          // We don't want to process clicks if we have a change in progress
          // (e.g. we wouldn't know which id we were removing) or if we're still
          // loading data (we wouldn't know if the board was currently starred
          // or what position we should put a newly starred board at)
          pendingChange === 'none' ? onClick : undefined
        }
        aria-label={intl.formatMessage({
          id: 'templates.board_header.star-or-unstar-board',
          defaultMessage: 'Star or unstar board',
          description: 'Label for the star button',
        })}
        iconBefore={
          showFilledIcon ? (
            <StarStarredIcon
              label={intl.formatMessage({
                id: 'templates.board_header.star-or-unstar-board',
                defaultMessage: 'Star or unstar board',
                description: 'Label for the star button',
              })}
              // @ts-expect-error TS(2322)
              color="var(--ds-background-warning-bold)"
            />
          ) : (
            <StarUnstarredIcon
              label={intl.formatMessage({
                id: 'templates.board_header.star-or-unstar-board',
                defaultMessage: 'Star or unstar board',
                description: 'Label for the star button',
              })}
              color="currentColor"
            />
          )
        }
      />
    </Tooltip>
  );
};
