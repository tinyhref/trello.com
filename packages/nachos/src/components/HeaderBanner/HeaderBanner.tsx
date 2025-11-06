import classNames from 'classnames';
import type {
  FunctionComponent,
  MouseEventHandler,
  PropsWithChildren,
} from 'react';
import { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';

import { VisuallyHidden } from '@trello/a11y';
import { Button } from '@trello/nachos/button';
import { CloseIcon } from '@trello/nachos/icons/close';

import * as styles from './HeaderBanner.module.less';

export interface HeaderBannerProps {
  /**
   * A string of classnames to be applied
   **/
  className?: string;
  /**
   * Determines the appearance of the text field
   **/
  appearance?: 'discovery' | 'info' | 'neutral-bold' | 'warning';
  /**
   * A function to be called when the user clicks on the close button
   **/
  onDismiss?: () => void;
}

export const HeaderBanner: FunctionComponent<
  PropsWithChildren<HeaderBannerProps>
> = ({ children, appearance, className = '', onDismiss }) => {
  const dismissHandler: MouseEventHandler<HTMLButtonElement> =
    useCallback(() => {
      onDismiss?.();
    }, [onDismiss]);

  return (
    <div
      className={classNames(styles.headerBanner, {
        [styles.warning]: appearance === 'warning',
        [styles.info]: appearance === 'info',
        [styles.discovery]: appearance === 'discovery',
        [styles.neutralBold]: appearance === 'neutral-bold',
        [styles.hasCloseButton]: !!onDismiss,
        [className]: !!className,
      })}
    >
      {children}
      {onDismiss && (
        <Button
          appearance="subtle"
          className={styles.closeButton}
          onClick={dismissHandler}
          iconBefore={
            <CloseIcon
              size="large"
              block
              color="currentColor"
              dangerous_className={styles.closeIcon}
            />
          }
        >
          <VisuallyHidden>
            <FormattedMessage
              id="templates.header_banner.close"
              defaultMessage="Close"
              description="A button shown in banners that allows the user to dismiss the banner"
            />
          </VisuallyHidden>
        </Button>
      )}
    </div>
  );
};
