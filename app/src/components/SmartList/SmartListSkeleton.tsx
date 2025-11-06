import cx from 'classnames';
import { FormattedMessage } from 'react-intl';

import ExpandIcon from '@atlaskit/icon/core/grow-horizontal';
import RefreshIcon from '@atlaskit/icon/core/refresh';
import { JiraIcon } from '@atlaskit/logo';
import { intl } from '@trello/i18n';
import { useListId } from '@trello/id-context';
import { Button } from '@trello/nachos/button';
import { ExternalLinkIcon } from '@trello/nachos/icons/external-link';
import { token } from '@trello/theme';

import { useIsListCollapsed } from 'app/src/components/List/useListContext';
import { useSmartListFragment } from './SmartListFragment.generated';
import { SmartListJiraCardSkeleton } from './SmartListJiraCardSkeleton';

import * as styles from './SmartListSkeleton.module.less';

export const SmartListSkeleton = () => {
  const listId = useListId();
  const isCollapsed = useIsListCollapsed();
  const { data: list } = useSmartListFragment({
    from: { id: listId },
    optimistic: true,
  });

  return (
    <div
      className={cx({
        [styles.skeletonWrapper]: true,
        [styles.collapsed]: isCollapsed,
      })}
    >
      <div className={styles.skeletonJiraHeader}>
        <div className={styles.skeletonJiraIconWrapper}>
          <JiraIcon appearance="brand" size="small" />
        </div>
        {!isCollapsed && (
          <>
            <div className={styles.skeletonSyncedFrom}>
              <FormattedMessage
                id="templates.smart_lists.synced-from-jira"
                defaultMessage="Synced from Jira"
                description="Heading for messaging describing the drag and drop behavior for smart list cards"
              />
            </div>
            <ExternalLinkIcon
              color={token('color.icon.inverse', '#FFFFFF')}
              size="medium"
            />
          </>
        )}
      </div>
      <div
        className={cx({
          [styles.skeletonList]: true,
          [styles.collapsed]: isCollapsed,
        })}
      >
        {isCollapsed && (
          <ExpandIcon
            label={intl.formatMessage({
              id: 'templates.list.expand-list',
              defaultMessage: 'Expand list',
              description: 'Expand list',
            })}
          />
        )}
        <div
          className={cx({
            [styles.skeletonListName]: true,
            [styles.collapsed]: isCollapsed,
          })}
        >
          {list?.name}
        </div>
        {!isCollapsed && (
          <>
            <div className={styles.skeletonSyncButton}>
              <Button
                appearance="subtle"
                className={styles.skeletonRefreshIcon}
                iconBefore={
                  <RefreshIcon
                    label={intl.formatMessage({
                      id: 'templates.smart_lists.sync-list',
                      defaultMessage: 'Sync list',
                      description:
                        'Tooltip description of smart list sync button',
                    })}
                    spacing="spacious"
                  />
                }
              />
              <FormattedMessage
                id="templates.smart_lists.loading"
                defaultMessage="Loading…"
                description="Loading messaging for smart list"
              />
            </div>
            <div className={styles.skeletonCards}>
              <SmartListJiraCardSkeleton />
              <SmartListJiraCardSkeleton />
              <SmartListJiraCardSkeleton />
              <SmartListJiraCardSkeleton />
              <SmartListJiraCardSkeleton />
              <SmartListJiraCardSkeleton />
              <SmartListJiraCardSkeleton />
              <SmartListJiraCardSkeleton />
              <SmartListJiraCardSkeleton />
              <SmartListJiraCardSkeleton />
              <SmartListJiraCardSkeleton />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
