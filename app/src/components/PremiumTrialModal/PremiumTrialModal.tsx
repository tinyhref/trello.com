import cx from 'classnames';
import { useCallback, useEffect, type FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';

import { Analytics, formatContainers } from '@trello/atlassian-analytics';
import { dontUpsell } from '@trello/browser';
import { Button } from '@trello/nachos/button';
import type { OnboardingIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { PremiumLozenge } from 'app/src/components/FreeTrial';
import modalWelcomeImageSrc from './premium-trial-modal-welcome-image.png';

import * as styles from './PremiumTrialModal.module.less';

export interface PremiumTrialModalProps {
  onTrialExtensionClick: () => void;
  onCtaClick: () => void;
  isAdmin: boolean;
  ctaLeadsToBoard?: boolean;
  titleId?: string;
  workspaceId: string | null;
}

export const PremiumTrialModal: FunctionComponent<PremiumTrialModalProps> = ({
  onTrialExtensionClick,
  onCtaClick,
  isAdmin,
  ctaLeadsToBoard = true,
  titleId = 'premium-trial-modal-title',
  workspaceId,
}) => {
  const _onCtaClick = useCallback(() => {
    onCtaClick();
    Analytics.sendClickedButtonEvent({
      buttonName: 'acceptReverseTrialModalButton',
      source: 'announceReverseTrialModalScreen',
      containers: formatContainers({
        organizationId: workspaceId,
      }),
    });
  }, [onCtaClick, workspaceId]);

  const _onTrialExtensionClick = useCallback(() => {
    onTrialExtensionClick();
    Analytics.sendClickedButtonEvent({
      buttonName: 'extendReverseTrialModalButton',
      source: 'announceReverseTrialModalScreen',
      containers: formatContainers({
        organizationId: workspaceId,
      }),
    });
  }, [onTrialExtensionClick, workspaceId]);

  useEffect(() => {
    Analytics.sendScreenEvent({
      name: 'announceReverseTrialModalScreen',
      attributes: {
        userViewedFrom: ctaLeadsToBoard ? 'boardScreen' : 'workspaceHome',
      },
      containers: formatContainers({
        organizationId: workspaceId,
      }),
    });
  }, [ctaLeadsToBoard, workspaceId]);

  return (
    <div className={styles.ReverseTrialModal}>
      <img
        className={cx(styles.image, styles.gaImage)}
        src={modalWelcomeImageSrc}
        alt=""
        data-testid="image"
      />
      <div className={styles.contentContainer}>
        <PremiumLozenge />
        <h1 className={styles.title} id={titleId}>
          <FormattedMessage
            id="templates.premium_trial.modal-title"
            defaultMessage="You're starting with Trello Premium!"
            description="modal title"
          />
        </h1>
        <p>
          <FormattedMessage
            id="templates.premium_trial.modal-description-line-1"
            defaultMessage="Free for 14 days - with no credit card required."
            description="modal description"
          />
        </p>
        <p className={styles.description}>
          <FormattedMessage
            id="templates.premium_trial.modal-description-line-2"
            defaultMessage="Enjoy productivity boosting features like Planner, AI, collapsible lists, list colors, card mirroring, unlimited boards, unlimited automation, and more."
            description="modal description"
          />
        </p>
        {!dontUpsell() && isAdmin && (
          <button
            className={styles.trialExtension}
            onClick={_onTrialExtensionClick}
            data-testid={getTestId<OnboardingIds>('trial-extension')}
          >
            <FormattedMessage
              id="templates.premium_trial.modal-trial-extension"
              defaultMessage="Extend your trial to 30 days by adding a payment method"
              description="modal trial extension cta"
            />
          </button>
        )}
        <Button
          className={styles.ctaButton}
          appearance="primary"
          onClick={_onCtaClick}
        >
          {ctaLeadsToBoard ? (
            <FormattedMessage
              id="templates.premium_trial.modal-board-cta"
              defaultMessage="Go to your first board"
              description="modal cta to board"
            />
          ) : (
            <>
              <FormattedMessage
                id="templates.premium_trial.modal-generic-cta"
                defaultMessage="You're all set up"
                description="modal cta to board"
              />
              <>{' 🎉'}</>
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
