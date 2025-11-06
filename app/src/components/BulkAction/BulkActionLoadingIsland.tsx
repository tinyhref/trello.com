import { Spinner } from '@trello/nachos/spinner';

import { IslandNav } from 'app/src/components/IslandNav';

import * as styles from './BulkActionLoadingIsland.module.less';

export const BulkActionLoadingIsland = () => {
  return (
    <IslandNav
      buttonGroupClassName={styles.buttonGroup}
      className={styles.bulkActionLoadingIsland}
    >
      <Spinner isAi />
    </IslandNav>
  );
};
