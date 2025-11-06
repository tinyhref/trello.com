import type { FunctionComponent } from 'react';

import { Spinner } from '@trello/nachos/spinner';
import type { CardBackTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import * as styles from './CardBackLoading.module.less';

export const CardBackLoading: FunctionComponent = () => {
  return (
    <div
      className={styles.cardDetailLoading}
      data-testid={getTestId<CardBackTestIds>('card-back-loading')}
    >
      <Spinner centered={true} />
    </div>
  );
};
