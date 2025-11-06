import classNames from 'classnames';
import type { MouseEventHandler } from 'react';

import { EditIcon } from '@trello/nachos/icons/edit';
import { token } from '@trello/theme';

import { noop } from 'app/src/noop';

import * as styles from './DeprecatedEditCardButton.module.less';

interface DeprecatedEditCardButtonProps {
  onClick: MouseEventHandler<HTMLButtonElement>;
  shouldShow: boolean;
}

/**
 * DEPRECATED - This was used to render the edit button for non-standard card
 * types in a non-React context. In our Board Canvas Modernization rewrite,
 * this logic will be contained within the CardFront component directly.
 * @deprecated
 */
export const DeprecatedEditCardButton = ({
  onClick,
  shouldShow,
}: DeprecatedEditCardButtonProps) => (
  <button
    className={classNames(styles.editCardButton, shouldShow && styles.show)}
    onClick={onClick}
  >
    <EditIcon
      color={token('color.text.accent.gray.bolder', '#091E42')}
      size="small"
    />
  </button>
);

/**
 * DEPRECATED - This was used to provide logic for whether or not to render the
 * DeprecatedEditCardButton. In our Board Canvas Modernization rewrite,
 * this logic will be contained within the CardFront component directly.
 * @deprecated
 */
export const getDeprecatedEditCardButton = () => {
  return {
    showEditCardButton: noop,
    hideEditCardButton: noop,
    shouldShowEditCardButton: false,
  };
};
