import cx from 'classnames';
import type { FunctionComponent, MouseEventHandler } from 'react';
import { useCallback, useContext, useEffect } from 'react';

import PremiumIcon from '@atlaskit/icon/core/premium';
import { Analytics } from '@trello/atlassian-analytics';
import { isDesktop } from '@trello/browser';
import { intl } from '@trello/i18n';
import { Button } from '@trello/nachos/button';
import { usePopover } from '@trello/nachos/popover';
import { Tooltip } from '@trello/nachos/tooltip';
import { token } from '@trello/theme';

import { CardFrontContext } from 'app/src/components/CardFront/CardFrontContext';
import { LazyMirrorCardFreeBadgePopover } from 'app/src/components/MirrorCardPopover/LazyMirrorCardFreeBadgePopover';
import { useGetMirrorCardPaidStatus } from './useGetMirrorCardPaidStatus';

import * as styles from './MirrorCardFreeBadge.module.less';

export const MirrorCardFreeBadge: FunctionComponent = () => {
  const { popoverProps, hide, toggle, targetRef, triggerRef } = usePopover();
  const { cardFrontRef } = useContext(CardFrontContext);
  const isPremiumMirrorCard = useGetMirrorCardPaidStatus();

  useEffect(() => {
    if (cardFrontRef.current) {
      targetRef(cardFrontRef.current);
      triggerRef(cardFrontRef.current);
    }
  }, [cardFrontRef, targetRef, triggerRef]);

  const onClick = useCallback<MouseEventHandler>(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      Analytics.sendClickedButtonEvent({
        buttonName: 'mirrorCardFreeBadgeButton',
        source: 'cardView',
      });
      toggle();
    },
    [toggle],
  );

  if (isDesktop() || isPremiumMirrorCard) {
    return null;
  }

  return (
    <>
      <Tooltip
        isScreenReaderAnnouncementDisabled
        content={intl.formatMessage({
          id: 'templates.mirror_card.free-badge-tooltip',
          defaultMessage: 'Convert this link card into a Mirror card',
          description: 'Tooltip content for the free mirror card badge',
        })}
      >
        <Button
          aria-label={intl.formatMessage({
            id: 'templates.mirror_card.free-badge-tooltip',
            defaultMessage: 'Convert this link card into a Mirror card',
            description: 'Tooltip content for the free mirror card badge',
          })}
          className={cx(
            popoverProps.isVisible && styles['mirrorCardFreeBadge--selected'],
            styles.mirrorCardFreeBadge,
          )}
          onClick={onClick}
          iconBefore={
            <div
              style={{
                height: '14px',
                width: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <PremiumIcon
                color={token('color.text.accent.purple', '#635394')}
                size="small"
                label=""
              />
            </div>
          }
        />
      </Tooltip>
      {popoverProps.isVisible && (
        <LazyMirrorCardFreeBadgePopover
          popoverProps={popoverProps}
          hide={hide}
        />
      )}
    </>
  );
};
