import type { FunctionComponent } from 'react';

import * as styles from './IslandNavSeparator.module.less';

export const IslandNavSeparator: FunctionComponent = () => {
  return <span role="separator" className={styles.separator} />;
};
