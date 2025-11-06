import { Board } from './Board';
import { ProportionalBoardLists } from './ProportionalLists';

import * as styles from './Board.module.less';

export const PlaceholderBoardTile = ({
  numLists,
  className,
}: {
  className?: string;
  numLists: number;
}) => (
  <Board
    className={className}
    // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
    bgColor={'#091E424F'}
    loading
    numLists={numLists}
  >
    <span className={styles.placeholderTopBar} />

    <ProportionalBoardLists
      lists={[
        { id: '1', size: 2 },
        { id: '2', size: 3 },
        { id: '3', size: 1 },
        { id: '4', size: 2 },
        { id: '5', size: 2 },
        { id: '6', size: 1 },
      ]}
      numLists={numLists}
    />
  </Board>
);
