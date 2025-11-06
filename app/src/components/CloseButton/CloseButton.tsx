import classNames from 'classnames';
import type {
  ButtonHTMLAttributes,
  CSSProperties,
  EventHandler,
  MouseEvent,
} from 'react';

import { intl } from '@trello/i18n';
import type { TestId } from '@trello/test-ids';
import { token } from '@trello/theme';

import { forwardRefComponent } from 'app/src/forwardRefComponent';

import * as styles from './CloseButton.module.less';

interface CloseButtonProps {
  className?: string;
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
  color?: string;
  quiet?: boolean;
  large?: boolean;
  medium?: boolean;
  closeIcon: JSX.Element;
  onClick: EventHandler<MouseEvent<HTMLElement>>;
  style?: CSSProperties;
  testId?: TestId;
}

export const CloseButton = forwardRefComponent<
  HTMLButtonElement,
  CloseButtonProps
>(
  'CloseButton',
  (
    {
      className,
      type,
      color,
      large = false,
      medium = false,
      onClick,
      quiet = false,
      style,
      testId,
      closeIcon,
    },
    ref,
  ) => (
    <button
      className={classNames(styles.closeButton, className)}
      onClick={onClick}
      style={style}
      ref={ref}
      data-testid={testId}
      type={type}
      aria-label={intl.formatMessage({
        id: 'close',
        defaultMessage: 'Close',
        description: 'Close',
      })}
    >
      <closeIcon.type
        color={
          closeIcon.props.color
            ? closeIcon.props.color
            : quiet
              ? token('color.icon.subtle', '#626F86')
              : color
        }
        size={
          closeIcon.props.size
            ? closeIcon.props.size
            : large
              ? 'large'
              : medium
                ? 'medium'
                : 'small'
        }
      />
    </button>
  ),
);
