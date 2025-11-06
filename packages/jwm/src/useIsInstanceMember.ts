import { useEffect, useState } from 'react';

import { isInstanceMember } from './permissions';

interface IsInstanceMemberLoading {
  loading: true;
  isInstanceMember: undefined;
}

interface IsInstanceMemberResolved {
  loading: false;
  isInstanceMember: boolean;
}

export const useIsInstanceMember = (
  idCloud: string | undefined,
): IsInstanceMemberLoading | IsInstanceMemberResolved => {
  const [isMember, setIsMember] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPermission = async (cloudId: string) => {
      setLoading(true);
      setIsMember(await isInstanceMember(cloudId));
      setLoading(false);
    };

    if (idCloud) {
      loadPermission(idCloud);
    }
  }, [idCloud]);

  if (!idCloud) {
    return { loading: false, isInstanceMember: false };
  } else if (loading) {
    return { loading, isInstanceMember: undefined };
  }

  return { loading, isInstanceMember: isMember };
};
