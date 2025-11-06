import cx from 'classnames';
import type {
  AriaRole,
  FunctionComponent,
  JSXElementConstructor,
  MouseEventHandler,
  PropsWithChildren,
} from 'react';

import type { IconColor } from '@atlaskit/tokens/css-type-schema';
import { Tooltip } from '@trello/nachos/tooltip';
import type { BadgesTestIds } from '@trello/test-ids';
import { token } from '@trello/theme';

import * as styles from './Badge.module.less';

type IconComponentColor = IconColor | 'currentColor';

export interface BadgeProps {
  Icon?: JSXElementConstructor<{
    dangerous_className: string;
    color: IconComponentColor;

    size: 'large' | 'medium' | 'small';
  }>;
  color?: BadgeColor;
  title?: string;
  isBold?: boolean;
  shouldUseColorBlindPattern?: boolean;
  className?: string;
  testId?: BadgesTestIds;
  isInteractive?: boolean;
  onClick?: MouseEventHandler;
  onMouseEnter?: MouseEventHandler;
  onMouseLeave?: MouseEventHandler;
  role?: AriaRole;
}

export type BadgeColor =
  | 'black'
  | 'blue'
  | 'gray'
  | 'green'
  | 'lime'
  | 'none'
  | 'orange'
  | 'pink'
  | 'purple'
  | 'red'
  | 'sky'
  | 'yellow';

const BadgeIconColorMap: Record<BadgeColor, IconComponentColor> = {
  green: token('color.icon.accent.green', '#22A06B'),
  yellow: token('color.icon.accent.yellow', '#B38600'),
  orange: token('color.icon.accent.orange', '#E56910'),
  red: token('color.icon.accent.red', '#C9372C'),
  purple: token('color.icon.accent.purple', '#8270DB'),
  blue: token('color.icon.accent.blue', '#1D7AFC'),
  sky: token('color.icon.accent.teal', '#2898BD'),
  pink: token('color.icon.accent.magenta', '#CD519D'),
  lime: token('color.icon.accent.lime', '#6A9A23'),
  gray: token('color.icon', '#44546F'),
  black: token('color.icon.accent.gray', '#758195'),
  none: 'currentColor',
};

export const Badge: FunctionComponent<PropsWithChildren<BadgeProps>> = ({
  children,
  Icon,
  color,
  title,
  isBold,
  shouldUseColorBlindPattern,
  className,
  testId,
  onClick,
  isInteractive,
  onMouseEnter,
  onMouseLeave,
  role,
}) => {
  const hasColor = color && color !== 'none';
  const hasColorBlindPattern = shouldUseColorBlindPattern && hasColor;

  return (
    <Tooltip content={title}>
      {({ onClick: onClickTooltip, ...tooltipProps }) => (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <span
          className={cx(
            styles.badge,
            {
              [styles[`badge--${color}`]]: hasColor,
              [styles[`badge--isBold`]]: isBold,
              [styles[`badge--isInteractive`]]: isInteractive,
              [styles['badge--hasColorBlindPattern']]: hasColorBlindPattern,
              [`color-blind-pattern-${color}`]: hasColorBlindPattern,
            },
            className,
          )}
          role={role}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onClick={onClick}
          data-testid={testId}
          {...tooltipProps}
        >
          {Icon ? (
            <Icon
              dangerous_className={styles.badgeIcon}
              color={
                isBold ? 'currentColor' : BadgeIconColorMap[color ?? 'none']
              }
              size="small"
            />
          ) : null}

          {children && <span className={styles.badgeText}>{children}</span>}
        </span>
      )}
    </Tooltip>
  );
};
