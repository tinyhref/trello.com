import cx from 'classnames';
import { useCallback, type FunctionComponent } from 'react';

import CloseIcon from '@atlaskit/icon/core/cross';
import { RovoIcon } from '@atlaskit/logo';
import { Analytics } from '@trello/atlassian-analytics';
import { Button } from '@trello/nachos/button';
import { token } from '@trello/theme';

import * as styles from './RovoButton.module.less';

interface RovoButtonProps {
  isActive: boolean;
  onClick: () => void;
  source: 'cardDetailScreen' | 'rovoIsland';
  isCardBackButton?: boolean;
}

// TODO: i18n for the component
export const RovoButton: FunctionComponent<RovoButtonProps> = ({
  isActive,
  onClick,
  source,
  isCardBackButton = false,
}) => {
  const handleClick = useCallback(() => {
    Analytics.sendClickedButtonEvent({
      buttonName: 'rovoChatButton',
      source,
      attributes: {
        action: isActive ? 'close' : 'open',
      },
    });

    onClick();
  }, [onClick, source, isActive]);

  return (
    <Button
      className={cx({
        [styles.rovoButton]: true,
        [styles.cardBackButton]: isCardBackButton,
      })}
      onClick={handleClick}
      aria-label={isActive ? 'Close Rovo' : 'Open Rovo'}
    >
      {!isActive ? (
        <RovoIcon label="Rovo" appearance="inverse" size="small" />
      ) : (
        <CloseIcon
          label="Close"
          color={token('color.icon.inverse', '#ffffff')}
        />
      )}
    </Button>
  );
};
