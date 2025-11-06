import type { FunctionComponent } from 'react';

import { useListId } from '@trello/id-context';
import { SubscribeIcon } from '@trello/nachos/icons/subscribe';

import { useListHeaderFragment } from './ListHeaderFragment.generated';

import * as styles from './ListSubscribedIcon.module.less';

export const ListSubscribedIcon: FunctionComponent = () => {
  const listId = useListId();

  const { data: list } = useListHeaderFragment({
    from: { id: listId },
    optimistic: true,
  });

  if (!list?.subscribed) {
    return null;
  }

  return (
    <SubscribeIcon
      color="currentColor"
      size="small"
      block={true}
      dangerous_className={styles.listSubscribeIcon}
    />
  );
};
