import cx from 'classnames';
import type { FunctionComponent } from 'react';

import { useListId } from '@trello/id-context';
import type { ListTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { useListColor } from 'app/src/components/ListColorPicker';
import { useListLimitsPowerUp } from './useListLimitsPowerUp';

import * as styles from './ListLimitsPowerUpBadge.module.less';

export const ListLimitsPowerUpBadge: FunctionComponent = () => {
  const { cardsCount, isListLimitExceeded, softLimit, isEnabled } =
    useListLimitsPowerUp();

  const listId = useListId();
  const listColor = useListColor(listId);

  if (!isEnabled || softLimit === null) {
    return null;
  }

  return (
    <span
      className={cx({
        [styles.badge]: true,
        [styles[`badge--warning`]]: isListLimitExceeded,
        [styles[`badge--${listColor}`]]: !isListLimitExceeded,
      })}
      data-testid={getTestId<ListTestIds>('list-limits-badge')}
    >
      {cardsCount} / {softLimit}
    </span>
  );
};
