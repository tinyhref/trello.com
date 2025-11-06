import { type FunctionComponent } from 'react';

import { useCardId } from '@trello/id-context';
import type { CardFrontTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { MirrorCardMemberAvatar } from './MirrorCardMemberAvatar';
import { useMirrorCardMembersFragment } from './MirrorCardMembersFragment.generated';

import * as styles from './MirrorCardMembers.module.less';

export const MirrorCardMembers: FunctionComponent = () => {
  const cardId = useCardId();
  const { data } = useMirrorCardMembersFragment({
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
        <MirrorCardMemberAvatar
          key={memberId}
          memberId={memberId}
          testId={getTestId<CardFrontTestIds>('mirror-card-member')}
        />
      ))}
    </div>
  );
};
