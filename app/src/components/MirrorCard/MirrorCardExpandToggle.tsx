import {
  useCallback,
  type FunctionComponent,
  type MouseEventHandler,
} from 'react';

import { Analytics } from '@trello/atlassian-analytics';
import { intl } from '@trello/i18n';
import { useBoardId } from '@trello/id-context';
import { Button } from '@trello/nachos/button';
import { CollapseToggleIcon } from '@trello/nachos/icons/collapse-toggle';
import { ExpandToggleIcon } from '@trello/nachos/icons/expand-toggle';
import { Tooltip } from '@trello/nachos/tooltip';
import { token } from '@trello/theme';

import { stopPropagationAndPreventDefault } from 'app/src/stopPropagationAndPreventDefault';
import type { MirrorCardBoardInfoFragment } from './MirrorCardBoardInfoFragment.generated';
import {
  MirrorCardBoardInfoFragmentDoc,
  useMirrorCardBoardInfoFragment,
} from './MirrorCardBoardInfoFragment.generated';
import { useMirrorCardToggleExpandMutation } from './MirrorCardToggleExpandMutation.generated';
import { useGetMirrorCardPaidStatus } from './useGetMirrorCardPaidStatus';

import * as styles from './MirrorCardExpandToggle.module.less';

export const MirrorCardExpandToggle: FunctionComponent = () => {
  const boardId = useBoardId();

  const { data } = useMirrorCardBoardInfoFragment({ from: { id: boardId } });

  const [updateMirrorCardToggleExpanded] = useMirrorCardToggleExpandMutation();

  const isPaid = useGetMirrorCardPaidStatus();

  const toggleExpandedMirrorCards = useCallback<MouseEventHandler>(
    (event) => {
      stopPropagationAndPreventDefault(event);
      const newValue = !data?.myPrefs.showCompactMirrorCards;
      updateMirrorCardToggleExpanded({
        variables: {
          boardId,
          value: newValue ? 'true' : 'false',
          pref: 'showCompactMirrorCards',
        },
        optimisticResponse: {
          __typename: 'Mutation',
          updateBoardMyPrefs: {
            showCompactMirrorCards: newValue,
            __typename: 'MyPrefs',
          },
        },
        /**
         * Updating the cache manually since we don't get socket updates for myPrefs
         */
        update: (cache, result) => {
          cache.writeFragment<MirrorCardBoardInfoFragment>({
            id: `Board:${boardId}`,
            fragment: MirrorCardBoardInfoFragmentDoc,
            data: {
              ...data,
              __typename: 'Board',
              id: boardId,
              myPrefs: {
                ...data?.myPrefs,
                showCompactMirrorCards:
                  result.data?.updateBoardMyPrefs?.showCompactMirrorCards,
                __typename: 'MyPrefs',
              },
            },
          });
        },
      });

      Analytics.sendClickedButtonEvent({
        buttonName: newValue
          ? 'mirrorCardCollapseButton'
          : 'mirrorCardExpandButton',
        source: 'cardView',
        attributes: {
          paidOrFreeWorkspace: isPaid ? 'paid' : 'free',
          compactOrExpanded: 'compact',
        },
      });
    },
    [boardId, data, isPaid, updateMirrorCardToggleExpanded],
  );

  const isExpanded = !data?.myPrefs.showCompactMirrorCards;

  const getTooltipContent = useCallback(() => {
    if (isExpanded) {
      return intl.formatMessage({
        id: 'templates.mirror_card.collapse-all-mirror-cards',
        defaultMessage: 'Collapse all mirror cards',
        description: 'Collapse card tooltip',
      });
    }
    return intl.formatMessage({
      id: 'templates.mirror_card.expand-all-mirror-cards',
      defaultMessage: 'Expand all mirror cards',
      description: 'Expand card tooltip',
    });
  }, [isExpanded]);

  if (!isPaid) {
    return;
  }

  return (
    <Tooltip content={getTooltipContent()}>
      <Button
        aria-label={'Toggle expand'}
        className={styles.mirrorCardExpandToggle}
        iconBefore={
          isExpanded ? (
            <CollapseToggleIcon
              size="small"
              color={token('color.icon', '#44546F')}
            />
          ) : (
            <ExpandToggleIcon
              size="small"
              color={token('color.icon', '#44546F')}
            />
          )
        }
        onClick={toggleExpandedMirrorCards}
      />
    </Tooltip>
  );
};
