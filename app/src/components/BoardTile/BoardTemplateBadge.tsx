import classNames from 'classnames';
import type { FunctionComponent } from 'react';

import { forNamespace } from '@trello/legacy-i18n';
import { TemplateBoardIcon } from '@trello/nachos/icons/template-board';
import type { BoardHeaderTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import * as styles from './BoardTemplateBadge.module.less';

const format = forNamespace('board template badge');

type BadgeAppearances = 'bold' | 'default' | 'transparent';

interface BoardTemplateBadgeProps {
  dangerous_className?: string;
  /** The visible appearance of a template badge.
   *
   * @default 'default'
   */
  appearance?: BadgeAppearances;
  showIcon?: boolean;
}

export const BoardTemplateBadge: FunctionComponent<BoardTemplateBadgeProps> = ({
  dangerous_className,
  appearance = 'default',
  showIcon = false,
}) => {
  return (
    <div
      className={classNames(
        styles.boardTemplateBadge,
        styles[appearance],
        dangerous_className,
      )}
      data-testid={getTestId<BoardHeaderTestIds>('template-badge')}
      title={format('templates are read-only boards for others to copy')}
    >
      {showIcon && <TemplateBoardIcon size="small" />}
      <span>{format('template')}</span>
    </div>
  );
};
