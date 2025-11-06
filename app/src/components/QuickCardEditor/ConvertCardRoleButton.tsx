import { useCallback, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';

import { Analytics } from '@trello/atlassian-analytics';
import type { CardRole } from '@trello/card-roles';
import { useCardId } from '@trello/id-context';
import { LeaveBoardIcon } from '@trello/nachos/icons/leave-board';
import type { QuickCardEditorTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { useGetMirrorCardPaidStatus } from 'app/src/components/MirrorCard';
import { useChangeCardRoleMutation } from './ChangeCardRoleMutation.generated';
import { useConvertCardRoleButtonFragment } from './ConvertCardRoleButtonFragment.generated';
import { QuickCardEditorButton } from './QuickCardEditorButton';
import { useRefetchConvertCardRoleButtonQuery } from './useRefetchConvertCardRoleButtonQuery';

interface ConvertCardRoleButtonProps {
  onLoad?: () => void;
  onClose?: () => void;
  analyticsContainers?: Parameters<
    typeof Analytics.sendClickedButtonEvent
  >[0]['containers'];
  isLegacyView?: boolean;
}

export const ConvertCardRoleButton = ({
  onLoad,
  onClose,
  analyticsContainers,
  isLegacyView = false,
}: ConvertCardRoleButtonProps) => {
  const cardId = useCardId();

  const [changeCardRole] = useChangeCardRoleMutation();

  const isPremiumMirrorCardsEnabled = useGetMirrorCardPaidStatus();

  // Waiting for the query to resolve results in this button rendering after
  // all other quick edit buttons, pushing down the Archive button when the
  // user could be trying to click it, resulting in accidental clicks of this
  // button when it pops in.
  const { data: cardFragmentData } = useConvertCardRoleButtonFragment({
    from: { id: cardId },
    optimistic: true,
  });

  // Because fetching possibleCardRole is done on a separate
  // endpoint from other fields on the card, we must refetch
  // the value whenever the card model is changed in order to
  // ensure that we don't have stale data.
  const { data } = useRefetchConvertCardRoleButtonQuery(cardId);

  // This is used to recalculate the height of the quick edit
  // menu after the button gets rendered. This will likely
  // need to be here until the quick edit menu gets rewritten
  // in the new stack, since as of now, this button gets rendered
  // *after* the menu is opened. Without this code, there is
  // a chance that the ConvertCardRoleButton will be off screen
  // and unable to be seen or clicked on
  useEffect(() => {
    onLoad?.();
  }, [onLoad, data]);

  const cardRole = data?.card?.cardRole || cardFragmentData?.cardRole;
  const possibleCardRole = data?.card?.possibleCardRole;

  const canBeSeparatorCard = possibleCardRole === 'separator';
  const canBeBoardCard = possibleCardRole === 'board';
  const canBeLinkCard = possibleCardRole === 'link';
  const canBeMirrorCard = possibleCardRole === 'mirror';

  const trackClick = useCallback(() => {
    Analytics.sendClickedButtonEvent({
      buttonName: 'convertCardButton',
      source: 'quickCardEditorInlineDialog',
      attributes: {
        fromCardRole: cardRole,
        toCardRole: cardRole ? null : possibleCardRole,
      },
      containers: analyticsContainers,
    });
  }, [analyticsContainers, cardRole, possibleCardRole]);

  const trackConversion = useCallback(
    (fromCardRole: CardRole, toCardRole: CardRole) => {
      Analytics.sendTrackEvent({
        action: 'converted',
        actionSubject: 'card',
        source: 'quickCardEditorInlineDialog',
        attributes: {
          fromCardRole,
          toCardRole,
        },
        containers: analyticsContainers,
      });
    },
    [analyticsContainers],
  );

  const convertCard = useCallback(async () => {
    trackClick();

    if (cardRole) {
      await changeCardRole({
        variables: {
          cardId,
          cardRole: null,
        },
      });
      trackConversion(cardRole, null);
    } else if (canBeBoardCard) {
      await changeCardRole({
        variables: {
          cardId,
          cardRole: 'board',
        },
      });
      trackConversion(null, 'board');
    } else if (canBeSeparatorCard) {
      await changeCardRole({
        variables: {
          cardId,
          cardRole: 'separator',
        },
      }).then(() => trackConversion(null, 'separator'));
    } else if (canBeMirrorCard) {
      changeCardRole({
        variables: {
          cardId,
          cardRole: 'mirror',
        },
      }).then(() => trackConversion(null, 'mirror'));
    } else if (canBeLinkCard) {
      await changeCardRole({
        variables: {
          cardId,
          cardRole: 'link',
        },
      });
      trackConversion(null, 'link');
    }
  }, [
    canBeBoardCard,
    canBeLinkCard,
    canBeMirrorCard,
    canBeSeparatorCard,
    cardId,
    cardRole,
    changeCardRole,
    trackClick,
    trackConversion,
  ]);

  if (!cardRole && !possibleCardRole) {
    return null;
  }

  return (
    <QuickCardEditorButton
      icon={<LeaveBoardIcon color="currentColor" size="small" />}
      onClick={convertCard}
      testId={getTestId<QuickCardEditorTestIds>(
        'quick-card-editor-convert-role',
      )}
      isLegacyView={isLegacyView}
    >
      {!!cardRole && (
        <FormattedMessage
          id="templates.quick_card_editor.convert-to-regular-card"
          defaultMessage="Convert to regular card"
          description="Convert to regular card button"
        />
      )}
      {!cardRole && canBeBoardCard && (
        <FormattedMessage
          id="templates.quick_card_editor.convert-to-board-card"
          defaultMessage="Convert to board card"
          description="Convert to board card button"
        />
      )}
      {!cardRole && canBeSeparatorCard && (
        <FormattedMessage
          id="templates.quick_card_editor.convert-to-separator-card"
          defaultMessage="Convert to separator card"
          description="Convert to separator card button"
        />
      )}
      {!cardRole && canBeLinkCard && (
        <FormattedMessage
          id="templates.quick_card_editor.convert-to-link-card"
          defaultMessage="Convert to link card"
          description="Convert to link card button"
        />
      )}
      {!cardRole &&
        canBeMirrorCard &&
        (isPremiumMirrorCardsEnabled ? (
          <FormattedMessage
            id="templates.quick_card_editor.convert-to-mirror-card"
            defaultMessage="Convert to mirror card"
            description="Convert to mirror card button"
          />
        ) : (
          <FormattedMessage
            id="templates.quick_card_editor.convert-to-link-card"
            defaultMessage="Convert to link card"
            description="Convert to link card button"
          />
        ))}
    </QuickCardEditorButton>
  );
};
