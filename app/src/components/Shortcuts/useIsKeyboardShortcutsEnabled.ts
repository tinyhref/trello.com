import { TrelloUserAri } from '@atlassian/ari';
import { useMemberId } from '@trello/authentication';
import { useFeatureGate } from '@trello/feature-gate-client';

import { useMemberKeyboardShortcutsPrefFragment } from './MemberKeyboardShortcutsPrefFragment.generated';
import { useTrelloUpdateKeyboardShortcutsPrefMutation } from './TrelloUpdateKeyboardShortcutsPrefMutation.generated';

export const useIsKeyboardShortcutsEnabled = () => {
  const { value: isKeyboardShortcutsPrefEnabled } = useFeatureGate(
    'goo_allow_disabling_keyboard_shortcuts',
  );

  const { data: member } = useMemberKeyboardShortcutsPrefFragment({
    from: { id: useMemberId() },
  });

  // If feature gate is not enabled, user has shortcuts by default so return true
  // Otherwise, defer to user's preference but return true as the fallback
  return (
    (!isKeyboardShortcutsPrefEnabled ||
      member?.prefs?.keyboardShortcutsEnabled) ??
    true
  );
};

export const useUpdateKeyboardShortcutsPref = () => {
  const memberId = useMemberId();
  const isKeyboardShortcutsEnabled = useIsKeyboardShortcutsEnabled();

  const [updateKeyboardShortcutsPref] =
    useTrelloUpdateKeyboardShortcutsPrefMutation({
      variables: {
        memberAri: TrelloUserAri.create({ userId: memberId }).toString(),
        value: !isKeyboardShortcutsEnabled,
      },
      // TODO: consider adding traceId to the context
      optimisticResponse: {
        __typename: 'Mutation',
        trello: {
          __typename: 'TrelloMutationApi',
          updateKeyboardShortcutsPref: {
            __typename: 'TrelloUpdateKeyboardShortcutsPrefPayload',
            errors: null,
            success: true,
          },
        },
      },
      update: (cache, { data }) => {
        if (data?.trello?.updateKeyboardShortcutsPref?.success) {
          cache.modify({
            id: cache.identify({
              __typename: 'Member',
              id: memberId,
            }),
            fields: {
              prefs: (cachedPrefs) => ({
                ...cachedPrefs,
                keyboardShortcutsEnabled: !isKeyboardShortcutsEnabled,
              }),
            },
          });
        }
      },
    });

  return updateKeyboardShortcutsPref;
};
