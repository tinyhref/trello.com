import classNames from 'classnames';
import type { ReactNode } from 'react';
import { useIntl } from 'react-intl';

import type { IconSize } from '@trello/nachos/icon';
import { CloseIcon } from '@trello/nachos/icons/close';
import { InformationIcon } from '@trello/nachos/icons/information';
import type { TestId } from '@trello/test-ids';
import { token } from '@trello/theme';

import * as styles from './Banner.module.less';

interface BannerProps {
  children: ReactNode;
  inlinePadding?: boolean;
  onDismiss?: () => void;
  bannerColor?: string;
  className?: string;
  textClassName?: string;
  infoUrl?: string;
  useLightText?: boolean;
  alignCloseTop?: boolean;
  shadow?: boolean;
  roundedCorners?: boolean;
  closeBannerIconSize?: IconSize;
  testId?: TestId;
}

const defaultBannerColor = token('color.background.warning', '#FFF7D6');
export const Banner = ({
  children,
  inlinePadding,
  infoUrl,
  onDismiss,
  bannerColor = defaultBannerColor,
  className = '',
  textClassName = '',
  useLightText,
  alignCloseTop,
  shadow,
  roundedCorners,
  closeBannerIconSize = 'large',
  testId,
}: BannerProps) => {
  const intl = useIntl();

  return (
    <div
      className={classNames(
        styles.bannerContainer,
        { [styles.inlinePadding]: inlinePadding },
        { [styles.bannerShadow]: shadow },
        { [styles.roundedCorners]: roundedCorners },
        className,
      )}
      style={{
        backgroundColor: bannerColor,
      }}
      data-testid={testId}
    >
      <div
        className={classNames(
          styles.textContent,
          {
            [styles.lightText]: useLightText,
          },
          textClassName,
        )}
      >
        {children}{' '}
      </div>
      {infoUrl && (
        <a
          className={classNames(styles.actionButton, {
            [styles.alignTop]: alignCloseTop,
          })}
          href={infoUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <InformationIcon dangerous_className={styles.help} />
        </a>
      )}
      {onDismiss && (
        <button
          className={classNames(styles.actionButton, {
            [styles.alignTop]: alignCloseTop,
          })}
          onClick={onDismiss}
          data-testid="bannerCloseButton"
        >
          <CloseIcon
            size={closeBannerIconSize}
            label={intl.formatMessage({
              id: 'templates.enterprise_dashboard_bulk_actions_progress_done.dismiss',
              defaultMessage: 'Dismiss',
              description: 'Dismiss button label',
            })}
            color={
              useLightText
                ? token('color.icon.inverse', '#FFFFFF')
                : token('color.text.accent.gray.bolder', '#091E42')
            }
          />
        </button>
      )}
    </div>
  );
};
