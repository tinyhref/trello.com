import {
  type FunctionComponent,
  type PropsWithChildren,
  type ReactNode,
} from 'react';

import * as styles from './Label.module.less';

interface LabelProps {
  iconAfter?: ReactNode;
  id?: string;
  htmlFor?: string;
  isRequired?: boolean;
}

export const Label: FunctionComponent<PropsWithChildren<LabelProps>> = ({
  children,
  iconAfter,
  id,
  isRequired,
  htmlFor,
}) => {
  return (
    <label className={styles.label} htmlFor={htmlFor} id={id} data-testid={id}>
      {children}
      {isRequired && <span className={styles.required}>*</span>}
      {iconAfter && <>{iconAfter}</>}
    </label>
  );
};
