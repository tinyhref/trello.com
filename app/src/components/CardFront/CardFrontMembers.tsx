import { type FunctionComponent } from 'react';

import { useCardId, useListId } from '@trello/id-context';
import type { CardFrontTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { MemberAvatarWithProfileCard } from 'app/src/components/ProfileCard';
import { useCardFrontMembersFragment } from './CardFrontMembersFragment.generated';
import {
  disableFocusManagement,
  restoreFocusManagement,
} from './useSetActiveCardOnHoverOrFocus';

import * as styles from './CardFrontMembers.module.less';

export const CardFrontMembers: FunctionComponent = () => {
  const cardId = useCardId();
  const listId = useListId();
  const { data } = useCardFrontMembersFragment({
    from: { id: cardId },
    optimistic: true,
  });
  const idMembers = data?.idMembers;

  if (!idMembers?.length) {
    return null;
  }

  return (
    <div className={styles.members}>
      {idMembers.map((memberId) => (
        <MemberAvatarWithProfileCard
          key={memberId}
          memberId={memberId}
          onHide={restoreFocusManagement}
          onShow={disableFocusManagement}
          size={24}
          testId={getTestId<CardFrontTestIds>('card-front-member')}
          cardId={cardId}
          listId={listId}
        />
      ))}
    </div>
  );
};
