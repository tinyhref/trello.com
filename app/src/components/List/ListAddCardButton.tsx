import type { FunctionComponent } from 'react';
import { useCallback, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

import { Analytics, formatContainers } from '@trello/atlassian-analytics';
import { intl } from '@trello/i18n';
import { useBoardId, useListId, useWorkspaceId } from '@trello/id-context';
import { Button } from '@trello/nachos/button';
import { AddIcon } from '@trello/nachos/icons/add';
import type { ListTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { openCardComposer } from 'app/src/components/CardComposer';
import { useListNameFragment } from './ListNameFragment.generated';
import { readListVisibleCardsFromCache } from './readListVisibleCardsFromCache';

import * as styles from './ListAddCardButton.module.less';

export const ListAddCardButton: FunctionComponent = () => {
  const boardId = useBoardId();
  const listId = useListId();
  const workspaceId = useWorkspaceId();
  const { data: list } = useListNameFragment({
    from: { id: listId },
    optimistic: true,
  });

  const onClick = useCallback(() => {
    const cards = readListVisibleCardsFromCache({ boardId, listId });
    const lastCard = cards.pop();
    openCardComposer({
      listId,
      position: lastCard?.pos ?? 0,
    });
    Analytics.sendClickedButtonEvent({
      buttonName: 'addAnotherCardButton',
      source: 'listFooter',
      containers: formatContainers({
        idBoard: boardId,
        idList: listId,
        idOrganization: workspaceId,
      }),
    });
  }, [boardId, listId, workspaceId]);

  const cardButtonLabel = useMemo(
    () =>
      intl.formatMessage(
        {
          id: 'templates.list.add-a-card-in',
          defaultMessage: `Add a card in {listName}`,
          description: 'Button to add a card to a list',
        },
        {
          listName: list?.name,
        },
      ),
    [list?.name],
  );
  return (
    <Button
      appearance="subtle"
      size="fullwidth"
      className={styles.listAddCardButton}
      onClick={onClick}
      iconBefore={<AddIcon color="currentColor" size="small" />}
      data-testid={getTestId<ListTestIds>('list-add-card-button')}
      aria-label={cardButtonLabel}
    >
      <FormattedMessage
        id="templates.list.add-a-card"
        defaultMessage="Add a card"
        description="Button text to add a card to a list"
      />
    </Button>
  );
};
