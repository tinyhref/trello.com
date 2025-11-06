import { memo } from 'react';

import * as styles from './DesktopPlaceholder.module.less';

export const DesktopPlaceholder = memo(() => (
  <div className={styles.desktopPlaceholder} data-placeholder="desktop" />
));
