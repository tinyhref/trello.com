import classNames from 'classnames';
import type { ComponentProps, FunctionComponent } from 'react';

import type { PositionType } from '@atlaskit/tooltip';
import { Tooltip } from '@trello/nachos/tooltip';

import * as styles from './ShortcutTooltip.module.less';

interface ShortcutTooltipProps
  extends Omit<ComponentProps<typeof Tooltip>, 'content'> {
  shortcutText: string;
  shortcutKey: string;
  // Some screen readers won't read symbols ("[", "`", "?", etc), so this prop can be used
  // to provide a description of the key to announce instead
  shortcutKeyDescription?: string;
  position?: PositionType;
}

export const ShortcutTooltip: FunctionComponent<ShortcutTooltipProps> = ({
  children,
  shortcutText,
  shortcutKey,
  shortcutKeyDescription,
  position,
  ...rest
}) => (
  <Tooltip
    content={
      <span className={styles.tooltip}>
        {shortcutText}
        <span
          aria-label={shortcutKeyDescription}
          className={classNames(styles.tooltipShortcut)}
        >
          {shortcutKey}
        </span>
      </span>
    }
    position={position}
    hideTooltipOnClick
    {...rest}
  >
    {children}
  </Tooltip>
);
