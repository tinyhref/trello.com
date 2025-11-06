import { useCallback, useMemo, type FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';

import { Analytics } from '@trello/atlassian-analytics';
import { isMemberLoggedIn } from '@trello/authentication';
import { Button } from '@trello/nachos/button';
import { WarningIcon } from '@trello/nachos/icons/warning';
import { token } from '@trello/theme';
import { parseTrelloUrl } from '@trello/urls';

import { CardFrontBoardHintUnconnected } from 'app/src/components/CardFront/CardFrontBoardHint';
import { useMirrorCardAccessRequestQuery } from './MirrorCardAccessRequestQuery.generated';
import { MirrorCardAccessRequestSubmitted } from './MirrorCardAccessRequestSubmitted';
import { useMirrorCardSendAccessRequest } from './useMirrorCardSendAccessRequest';

import * as styles from './MirrorCardAccessRestricted.module.less';

interface MirrorCardAccessRestrictedProps {
  sourceCardUrl: string;
  isAttachmentOnCardBack?: boolean;
}
export const MirrorCardAccessRestricted: FunctionComponent<
  MirrorCardAccessRestrictedProps
> = ({ sourceCardUrl, isAttachmentOnCardBack }) => {
  const modelId = parseTrelloUrl(sourceCardUrl)?.shortLink ?? '';
  const { sendAccessRequest, status } = useMirrorCardSendAccessRequest({
    modelId,
  });
  const handleRequestAccessClick = useCallback(() => {
    sendAccessRequest();
    Analytics.sendClickedButtonEvent({
      buttonName: isAttachmentOnCardBack
        ? 'trelloCardRequestAccessButton'
        : 'mirrorCardRequestAccessButton',
      source: 'cardView',
    });
  }, [sendAccessRequest, isAttachmentOnCardBack]);

  const { data: requestAccessData } = useMirrorCardAccessRequestQuery({
    variables: {
      modelId,
      modelType: 'card',
    },
    waitOn: ['None'],
  });

  const hasAlreadyRequestedAccess =
    !requestAccessData?.accessRequest.allowed &&
    requestAccessData?.accessRequest.reason ===
      'REQUEST_ACCESS_MEMBER_LIMIT_EXCEEDED';

  const cardHintBackgroundColor = useMemo(
    () =>
      hasAlreadyRequestedAccess || status === 'access-requested'
        ? token('color.icon.subtle', '#626F86')
        : token('color.text.accent.red', '#AE2E24'),
    [hasAlreadyRequestedAccess, status],
  );

  const cardContent = useMemo(() => {
    return hasAlreadyRequestedAccess || status === 'access-requested' ? (
      <MirrorCardAccessRequestSubmitted />
    ) : (
      <div
        className={styles.mirrorCardAccessRestricted}
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
      >
        <WarningIcon color={token('color.icon.accent.red', '#C9372C')} />
        <div className={styles.message}>
          <p className={styles.content}>
            {isAttachmentOnCardBack ? (
              <FormattedMessage
                id="templates.canonical_card.unauthorized card error"
                description="Message for the restricted access message on a card"
                defaultMessage="Sorry, you need access to this card."
              />
            ) : (
              <FormattedMessage
                id="templates.mirror_card.restricted-access-description"
                description="Message for the restricted access message on a mirror card"
                defaultMessage="This card is mirrored from a board you can't access."
              />
            )}
          </p>
          {isMemberLoggedIn() && (
            <Button
              onClick={handleRequestAccessClick}
              className={styles.requestAccessButton}
            >
              <FormattedMessage
                id="templates.mirror_card.request-access"
                description="Request access button"
                defaultMessage="Request Access"
              />
            </Button>
          )}
        </div>
      </div>
    );
  }, [
    handleRequestAccessClick,
    hasAlreadyRequestedAccess,
    status,
    isAttachmentOnCardBack,
  ]);
  return (
    <>
      {cardContent}
      {!isAttachmentOnCardBack && (
        <CardFrontBoardHintUnconnected
          backgroundColor={cardHintBackgroundColor}
        />
      )}
    </>
  );
};
