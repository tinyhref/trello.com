import type { FunctionComponent, PropsWithChildren } from 'react';

import * as styles from './PopoverBoundary.module.less';

// trello specific hack so that we can tell the popper API the bounds of where
// want the popovers to render (the area below the header, that includes things
// like banners)
export const POPOVER_BOUNDARY_ELEMENT_ID = 'popover-boundary';

export const PopoverBoundary: FunctionComponent<PropsWithChildren<unknown>> = ({
  children,
}) => (
  <div id={POPOVER_BOUNDARY_ELEMENT_ID} className={styles.popoverBoundary}>
    {children}
  </div>
);
