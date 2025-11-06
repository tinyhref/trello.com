import cx from 'classnames';
import type { FunctionComponent } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { Analytics } from '@trello/atlassian-analytics';
import { dontUpsell } from '@trello/browser';
import { mergeRefs } from '@trello/dom-hooks';
import { DynamicButton } from '@trello/dynamic-tokens';
import { DownIcon } from '@trello/nachos/icons/down';
import { Popover, PopoverScreen, usePopover } from '@trello/nachos/popover';
import { Tooltip } from '@trello/nachos/tooltip';
import type { BoardHeaderTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { MaybePremiumBanner } from 'app/src/components/FreeTrial';
import { LazyArrangeViewButtonsPopoverScreen } from './LazyArrangeViewButtonsPopoverScreen';
import type {
  SwitcherView,
  SwitcherViewViewType,
  ViewOption,
} from './ViewSwitcher';

// eslint-disable-next-line @trello/less-matches-component
import * as styles from './ViewSwitcher.module.less';

interface ViewSwitcherButtonProps {
  idBoard: string;
  currentView: SwitcherViewViewType | null;
  viewOptions: { [key in SwitcherViewViewType]: ViewOption };
  switcherViews: SwitcherView[];
  hasViewsFeature: boolean;
  memberCanEditBoard: boolean;
  analyticsContainers?: Parameters<
    typeof Analytics.sendClickedButtonEvent
  >[0]['containers'];
  isCollapsed?: boolean;
}

const emptyObj = {};
export const ViewSwitcherButtons: FunctionComponent<
  ViewSwitcherButtonProps
> = ({
  idBoard,
  currentView,
  viewOptions,
  switcherViews,
  hasViewsFeature,
  memberCanEditBoard,
  analyticsContainers = emptyObj,
  isCollapsed,
}) => {
  const intl = useIntl();
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);
  const onShow = useCallback(() => {
    Analytics.sendClickedButtonEvent({
      buttonName: 'boardViewSwitcherMoreButton',
      source: 'boardScreen',
      containers: analyticsContainers,
    });
    setIsPopoverOpen(true);
  }, [analyticsContainers]);

  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const { triggerRef, hide, toggle, popoverProps } =
    usePopover<HTMLButtonElement>({
      onShow,
    });

  // Because the popover is anchored to a dummy div instead of the button, this
  // ensures that closing out of the popover returns focus to the button.
  const onPopoverHide = useCallback(() => {
    hide();
    setIsPopoverOpen(false);
  }, [hide]);

  const onToggle = useCallback(() => {
    toggle();
  }, [toggle]);

  useEffect(() => {
    if (popoverProps?.isVisible) {
      // if the popover is already open, don't change the state
      return;
    }
  }, [popoverProps?.isVisible]);

  // The buttonRef is used to persist the location the popover was opened from,
  // the triggerRef is supplied from the popover to make sure clicking the
  // button isn't registered as an outsideClick.
  const combinedButtonRefs = mergeRefs(buttonRef, triggerRef);

  const ViewIcon = viewOptions[currentView || 'Board'].icon;

  const popoverTitle = useMemo(() => {
    if (hasViewsFeature) {
      return (
        <FormattedMessage
          id="templates.view_switcher.views"
          defaultMessage="Views"
          description="Popover title for views"
        />
      );
    }
    return dontUpsell() ? (
      <FormattedMessage
        id="templates.view_switcher.views"
        defaultMessage="Views"
        description="Popover title for views"
      />
    ) : (
      <FormattedMessage
        id="templates.view_switcher.upgrade-for-views"
        defaultMessage="Upgrade for Views"
        description="Popover title for upgrade for views"
      />
    );
  }, [hasViewsFeature]);

  return (
    <>
      <div className={styles.switcherButtonsContainer}>
        <Tooltip
          content={
            <FormattedMessage
              id="templates.view_switcher.views"
              defaultMessage="Views"
              description="Tooltip content for views"
            />
          }
        >
          <DynamicButton
            className={cx({
              [styles.overflowButton]: true,
              [styles.highlighted]: isPopoverOpen,
              [styles.overflowButtonLarge]: false,
            })}
            aria-label={intl.formatMessage({
              id: 'templates.view_switcher.views',
              defaultMessage: 'Views',
              description: 'Button label for views',
            })}
            iconBefore={
              <ViewIcon
                size={'medium'}
                dangerous_className={styles.viewSwitcherIcon}
                label={''}
              />
            }
            iconAfter={
              <DownIcon size={'small'} dangerous_className={styles.downIcon} />
            }
            ref={combinedButtonRefs}
            onClick={onToggle}
            data-testid={getTestId<BoardHeaderTestIds>(
              'view-switcher-button-more',
            )}
          ></DynamicButton>
        </Tooltip>
      </div>
      <Popover {...popoverProps} onHide={onPopoverHide} title={popoverTitle}>
        <PopoverScreen id={0}>
          <MaybePremiumBanner
            title={
              <FormattedMessage
                id="templates.premium_trial.views-title"
                defaultMessage="See your work in a new way"
                description="Premium banner title for views"
              />
            }
            description={
              <FormattedMessage
                id="templates.premium_trial.views-description"
                defaultMessage="Views are only available to Premium Workspaces."
                description="Premium banner description for views"
              />
            }
            className={styles.premiumBanner}
          />
          <LazyArrangeViewButtonsPopoverScreen
            idBoard={idBoard}
            viewOptions={viewOptions}
            switcherViews={switcherViews}
            hasViewsFeature={hasViewsFeature}
            memberCanEditBoard={memberCanEditBoard}
            analyticsContainers={analyticsContainers}
          />
        </PopoverScreen>
      </Popover>
    </>
  );
};
