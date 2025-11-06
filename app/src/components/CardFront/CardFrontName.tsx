import cx from 'classnames';
import type { FunctionComponent, MouseEvent } from 'react';
import { useCallback } from 'react';

import type { CardFrontTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { isModifierKeyPressed } from 'app/src/isModifierKeyPressed';

import * as styles from './CardFrontName.module.less';

// Minimal cards with undefined names should still render a non-breaking
// space character, for a baseline estimate of height.
const NON_BREAKING_SPACE_CHARACTER = '\u00A0';

export interface CardFrontNameProps {
  name?: string;
  url?: string;
  className?: string;
  truncate?: boolean;
}

export const CardFrontName: FunctionComponent<CardFrontNameProps> = ({
  name = NON_BREAKING_SPACE_CHARACTER,
  url = '',
  className,
  truncate = false,
}) => {
  /**
   * The card name is rendered as an anchor tag for accessibility, but we don't
   * actually want to rely on it. When it's clicked, just prevent default, and
   * let the click callback for the card container component handle navigation.
   */
  const onClickName = useCallback((e: MouseEvent) => {
    if (!isModifierKeyPressed(e)) {
      e.preventDefault();
    }
  }, []);

  return (
    <a
      draggable="false"
      className={cx(styles.name, className, {
        [styles.truncate]: truncate,
      })}
      dir="auto"
      href={url}
      onClick={onClickName}
      data-testid={getTestId<CardFrontTestIds>('card-name')}
    >
      {name}
    </a>
  );
};
