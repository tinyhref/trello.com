import { useCallback, type FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';

import type { PopoverProps } from '@trello/nachos/popover';
import { Popover } from '@trello/nachos/popover';
import { PopoverMenu } from '@trello/nachos/popover-menu';

import { openCreateJiraListModal } from './jiraIssueModalState';
import { JiraListPopoverMenuButton } from './JiraListPopoverMenuButton';

import * as styles from './ListSourcesPopover.module.less';

export interface ListSourcesPopoverProps {
  popoverProps: PopoverProps<HTMLButtonElement>;
  hide: () => void;
  popoverId?: string;
}

export const ListSourcesPopover: FunctionComponent<ListSourcesPopoverProps> = ({
  popoverProps,
  hide,
  popoverId,
}) => {
  const onClickJiraOption = useCallback(() => {
    openCreateJiraListModal();
    hide();
  }, [hide]);

  return (
    <Popover {...popoverProps} size={'small'} id={popoverId}>
      <h2 className={styles.header}>
        <FormattedMessage
          id="templates.smart_lists.add-a-list-from"
          defaultMessage="Add a list from:"
          description="Popover header for product list creation options"
        />
      </h2>
      <PopoverMenu>
        <JiraListPopoverMenuButton onClick={onClickJiraOption} />
      </PopoverMenu>
    </Popover>
  );
};
