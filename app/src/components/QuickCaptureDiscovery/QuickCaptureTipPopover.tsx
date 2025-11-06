import cx from 'classnames';
import { useCallback, useEffect, type ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';

import DeviceMobileIcon from '@atlaskit/icon/core/device-mobile';
import EmailIcon from '@atlaskit/icon/core/email';
import { Analytics } from '@trello/atlassian-analytics';
import { useOneTimeMessagesDismissed } from '@trello/business-logic-react/member';
import { intl } from '@trello/i18n';
import { Button } from '@trello/nachos/button';
import {
  Popover,
  PopoverPlacement,
  usePopover,
  type HideReasonType,
  type UsePopoverResult,
} from '@trello/nachos/popover';
import { useSplitScreenSharedState } from '@trello/split-screen';
import { token } from '@trello/theme';

import { SlackColorIcon } from 'app/src/components/CardFrontBadges/SlackColorIcon';
import { MicrosoftTeamsIcon } from 'app/src/components/Planner/EventDetailPopover/ConferencingIcons/MicrosoftTeamsIcon';
import { useInboxActiveButtonSharedState } from './useInboxActiveButtonSharedState';

import * as styles from './QuickCaptureTipPopover.module.less';

export const TRELLO_UI_QUICK_CAPTURE_INTERACT_TIP =
  'quick-capture-discovery-interact-tip';
export const TRELLO_UI_QUICK_CAPTURE_DISMISS_TIP =
  'quick-capture-discovery-dismiss-tip';

interface PopoverRenderProps {
  triggerRef: UsePopoverResult<HTMLButtonElement>['triggerRef'];
  toggle: () => void;
}

export const QuickCaptureTipPopover = ({
  children,
  onPopoverVisibilityChange,
}: {
  children: (props: PopoverRenderProps) => ReactNode;
  onPopoverVisibilityChange: (isVisible: boolean) => void;
}) => {
  const { dismissOneTimeMessage, isOneTimeMessageDismissed } =
    useOneTimeMessagesDismissed();

  const hasTipInteracted = isOneTimeMessageDismissed(
    TRELLO_UI_QUICK_CAPTURE_INTERACT_TIP,
  );
  const hasTipIsDismissed = isOneTimeMessageDismissed(
    TRELLO_UI_QUICK_CAPTURE_DISMISS_TIP,
  );

  const { toggleInbox, panels } = useSplitScreenSharedState();
  const [, setInboxActiveButton] = useInboxActiveButtonSharedState();

  const onHide = useCallback(
    (hideReason?: HideReasonType | undefined) => {
      if (hideReason) {
        Analytics.sendClickedButtonEvent({
          buttonName: 'quickCaptureTipButtonClose',
          source: 'quickCaptureTipDialog',
          attributes: {
            hideReason,
            firstInteraction: !hasTipInteracted,
          },
        });
      }
      if (!hasTipInteracted) {
        dismissOneTimeMessage(TRELLO_UI_QUICK_CAPTURE_INTERACT_TIP);
      }
    },
    [hasTipInteracted, dismissOneTimeMessage],
  );

  const { popoverProps, toggle, triggerRef, hide } =
    usePopover<HTMLButtonElement>({
      placement: PopoverPlacement.RIGHT_START,
      onHide,
    });

  const onPopoverCtaClick = () => {
    if (!panels.inbox) {
      toggleInbox();
    }
    setInboxActiveButton({ activeButton: 'email' });
    dismissOneTimeMessage(TRELLO_UI_QUICK_CAPTURE_DISMISS_TIP);

    Analytics.sendClickedButtonEvent({
      buttonName: 'tryItQuickCaptureTipButton',
      source: 'quickCaptureTipDialog',
      attributes: {
        firstInteraction: !hasTipInteracted,
      },
    });
    hide();
  };

  const onPopoverDismiss = () => {
    dismissOneTimeMessage(TRELLO_UI_QUICK_CAPTURE_DISMISS_TIP);
    Analytics.sendClickedButtonEvent({
      buttonName: 'dismissQuickCaptureTipButton',
      source: 'quickCaptureTipDialog',
      attributes: {
        firstInteraction: !hasTipInteracted,
      },
    });
    hide();
  };

  useEffect(() => {
    onPopoverVisibilityChange(popoverProps.isVisible);
  }, [onPopoverVisibilityChange, popoverProps.isVisible]);

  const onTogglePopover = () => {
    if (!popoverProps.isVisible) {
      Analytics.sendClickedButtonEvent({
        buttonName: 'quickCaptureTipButtonCta',
        source: 'inlineCardComposerInlineDialog',
        attributes: {
          firstInteraction: !hasTipInteracted,
        },
      });

      Analytics.sendViewedComponentEvent({
        componentType: 'inlineDialog',
        componentName: 'inlineCardComposerInlineDialog',
        source: 'inlineCardComposerInlineDialog',
        attributes: {
          firstInteraction: !hasTipInteracted,
        },
      });
    }
    toggle();
  };

  return (
    <>
      {!hasTipIsDismissed &&
        children({
          triggerRef,
          toggle: onTogglePopover,
        })}
      <Popover
        {...popoverProps}
        title={intl.formatMessage({
          id: 'templates.quick_capture_discovery_tip.popover-title',
          defaultMessage: 'Capture from everywhere, fast',
          description:
            'Title for a popover that introduces users to quick capture, explaining that they can quickly save content from any location.',
        })}
      >
        <div className={styles.qcMethodIcons}>
          <span
            role="img"
            className={styles.qcMethodIcon}
            aria-label={intl.formatMessage({
              id: 'templates.quick_capture_discovery_tip.quick-capture-slack-icon',
              defaultMessage: 'Available in Slack',
              description:
                'Icon indicating that quick capture is available in Slack.',
            })}
          >
            <SlackColorIcon width={36} height={36} />
          </span>
          <span className={cx(styles.qcMethodIcon, styles.qcMethodIconEmail)}>
            <EmailIcon
              label={intl.formatMessage({
                id: 'templates.quick_capture_discovery_tip.quick-capture-email-icon',
                defaultMessage: 'Available in email',
                description:
                  'Icon indicating that quick capture is available in email applications',
              })}
              color={token('color.icon.accent.blue', '#1D7AFC')}
            />
          </span>
          <span
            role="img"
            className={styles.qcMethodIcon}
            aria-label={intl.formatMessage({
              id: 'templates.quick_capture_discovery_tip.quick-capture-microsoft-teams-icon',
              defaultMessage: 'Available in Microsoft Teams',
              description:
                'Icon indicating that quick capture is available in Microsoft Teams.',
            })}
          >
            <MicrosoftTeamsIcon width={28} height={28} />
          </span>
          <span className={cx(styles.qcMethodIcon, styles.qcMethodIconMobile)}>
            <DeviceMobileIcon
              size="medium"
              label={intl.formatMessage({
                id: 'templates.quick_capture_discovery_tip.quick-capture-mobile-icon',
                defaultMessage: 'Available on mobile',
                description:
                  'Icon indicating that quick capture feature is available for mobile device',
              })}
            />
          </span>
        </div>
        <p>
          <FormattedMessage
            id="templates.quick_capture_discovery_tip.popover-body"
            defaultMessage="No copy-paste, no switching tabs. Drop them straight into Trello, organize it when you're ready."
            description="Body text for the quick capture discovery popover that explains the benefits and workflow of the feature, emphasizing efficiency and convenience."
          />
        </p>
        <div className={styles.footer}>
          <Button
            onClick={onPopoverDismiss}
            appearance="subtle"
            aria-label={intl.formatMessage({
              id: 'templates.quick_capture_discovery_tip.popover-dismiss-label',
              defaultMessage: 'Dismiss Quick Capture message',
              description: 'Dismiss Quick Capture button',
            })}
          >
            <FormattedMessage
              id="templates.quick_capture_discovery_tip.popover-dismiss"
              defaultMessage="Dismiss"
              description="Button text to close or dismiss the quick capture discovery popover without taking action."
            />
          </Button>
          <Button
            onClick={onPopoverCtaClick}
            appearance="primary"
            aria-label={intl.formatMessage({
              id: 'templates.quick_capture_discovery_tip.popover-cta-label',
              defaultMessage: 'Try Quick Capture',
              description: 'Try Quick Capture button',
            })}
          >
            <FormattedMessage
              id="templates.quick_capture_discovery_tip.popover-cta"
              defaultMessage="Try it"
              description="Call-to-action button text in the quick capture discovery popover that encourages users to test the feature."
            />
          </Button>
        </div>
      </Popover>
    </>
  );
};
