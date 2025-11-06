import cx from 'classnames';
import { useCallback, useEffect, useRef, type FunctionComponent } from 'react';

import ExpandIcon from '@atlaskit/icon/core/grow-horizontal';
import CollapseIcon from '@atlaskit/icon/core/shrink-horizontal';
import { Analytics, formatContainers } from '@trello/atlassian-analytics';
import { intl } from '@trello/i18n';
import { useBoardId, useListId, useWorkspaceId } from '@trello/id-context';
import type { ListTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import {
  collapseList,
  expandList,
  useIsCollapsibleListsEnabled,
} from 'app/src/components/CollapsedListsState';
import { ShortcutTooltip } from 'app/src/components/ShortcutTooltip';
import { useIsListCollapsed } from './useListContext';

import * as styles from './CollapseListButton.module.less';

export const CollapseListButton: FunctionComponent = () => {
  const workspaceId = useWorkspaceId() ?? '';
  const boardId = useBoardId();
  const listId = useListId();
  const isListCollapsed = useIsListCollapsed();
  const isCollapsible = useIsCollapsibleListsEnabled(boardId);

  const hideTooltipRef = useRef<() => void>();
  const onClick = useCallback(() => {
    hideTooltipRef.current?.();

    if (isListCollapsed) {
      expandList(listId);

      Analytics.sendClickedButtonEvent({
        buttonName: 'expandListButton',
        source: 'boardScreen',
        containers: formatContainers({ boardId, listId, workspaceId }),
      });
    } else {
      collapseList(listId);

      Analytics.sendClickedButtonEvent({
        buttonName: 'collapseListButton',
        source: 'boardScreen',
        containers: formatContainers({ boardId, listId, workspaceId }),
      });
    }
  }, [isListCollapsed, listId, boardId, workspaceId]);

  // Niche, but if a user presses the keyboard shortcut to collapse or expand
  // the list while the tooltip is visible, automatically dismiss the tooltip.
  useEffect(() => {
    hideTooltipRef.current?.();
  }, [isListCollapsed]);

  const shortcutText = isListCollapsed
    ? intl.formatMessage({
        id: 'templates.list.expand-list',
        defaultMessage: 'Expand list',
        description: 'Expand list',
      })
    : intl.formatMessage({
        id: 'templates.list.collapse-list',
        defaultMessage: 'Collapse list',
        description: 'Collapse list',
      });

  if (!isCollapsible) {
    return null;
  }

  return (
    <ShortcutTooltip
      shortcutText={shortcutText}
      isScreenReaderAnnouncementDisabled
      shortcutKey="\"
    >
      {({ onClick: onClickTooltip, ...tooltipProps }) => {
        hideTooltipRef.current = onClickTooltip as () => void;
        const Icon = isListCollapsed ? ExpandIcon : CollapseIcon;

        return (
          <button
            aria-labelledby={`list-${listId}`}
            {...tooltipProps}
            className={cx({
              [styles.expandListButton]: isListCollapsed,
              [styles.collapseListButton]: !isListCollapsed,
            })}
            onClick={onClick}
            data-testid={getTestId<ListTestIds>('list-collapse-button')}
          >
            <Icon label={shortcutText} />
          </button>
        );
      }}
    </ShortcutTooltip>
  );
};
