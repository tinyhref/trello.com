import { useMemberId } from '@trello/authentication';
import { useDynamicConfig } from '@trello/dynamic-config';

import { useMyEnterprise } from '../member/useMyEnterprise';

export const useCanShowMirrorButton = () => {
  const memberId = useMemberId();

  const enterprise = useMyEnterprise(memberId);

  const mirrorCardEnterpriseBlocklist = useDynamicConfig(
    'mirror_cards_ent_blocklist',
  );

  if (!enterprise) {
    return true;
  }
  if (
    Array.isArray(mirrorCardEnterpriseBlocklist) &&
    mirrorCardEnterpriseBlocklist.every((id) => typeof id === 'string')
  ) {
    return !mirrorCardEnterpriseBlocklist.includes(enterprise.id);
  }
  return true;
};
