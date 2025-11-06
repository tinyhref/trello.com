import type {
  FunctionComponent,
  HTMLAttributes,
  PropsWithChildren,
  ReactNode,
} from 'react';

import type { TestId } from '@trello/test-ids';

import * as styles from './VisuallyHidden.module.less';

/**
 * A composable element to apply a visually hidden effect to children.
 * Useful for accessibility compliance.
 *
 * @example
 * ```jsx
 * import { VisuallyHidden } from '@trello/a11y';
 *
 * export Example = () => (
 *   <div style={{ border: '1px solid black' }}>
 *      There is text hidden between the brackets [
 *      <VisuallyHidden>Can't see me!</VisuallyHidden>]
 *   </div>
 * );
 * ```
 */
export const VisuallyHidden: FunctionComponent<
  PropsWithChildren<{
    children: ReactNode;
    testId?: TestId;
    role?: HTMLAttributes<HTMLSpanElement>['role'];
    id?: HTMLAttributes<HTMLSpanElement>['id'];
  }>
> = ({ children, testId, role, id }) => {
  return (
    <span
      id={id}
      data-testid={testId}
      role={role}
      className={styles.visuallyHidden}
    >
      {children}
    </span>
  );
};
