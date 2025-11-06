import { type FunctionComponent, type PropsWithChildren } from 'react';

import * as styles from './ValidationError.module.less';

interface ValidationErrorProps {
  id: string;
}

export const ValidationError: FunctionComponent<
  PropsWithChildren<ValidationErrorProps>
> = ({ children, id }) => {
  return (
    <div
      className={styles.validationError}
      role="alert"
      id={id}
      data-testid={id}
    >
      {children}
    </div>
  );
};
