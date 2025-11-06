import { useEffect, useState } from 'react';

import { canInvite, isInstanceMember } from './permissions';

export interface IsCanInviteLoading {
  loading: true;
  canInvite?: never;
  hasDomainRestrictions?: never;
}

export interface IsCanInviteResolved {
  loading: false;
  canInvite: boolean;
  hasDomainRestrictions: boolean;
}

export const useCanInvite = (
  idCloud: string | undefined,
): IsCanInviteLoading | IsCanInviteResolved => {
  const [canInviteToJira, setCanInviteToJira] = useState(false);
  const [loading, setLoading] = useState(true);
  const [domainRestrictions, setDomainRestrictions] = useState(false);

  useEffect(() => {
    const loadPermission = async (cloudId: string) => {
      setLoading(true);

      const instanceMember = await isInstanceMember(cloudId);

      if (instanceMember) {
        const result = await canInvite(cloudId);
        if (result.canInvite) {
          setCanInviteToJira(true);
        }
        if (result.hasDomainRestrictions) {
          setDomainRestrictions(true);
        }

        setLoading(false);
      } else if (!instanceMember) {
        setCanInviteToJira(false);
        setDomainRestrictions(false);
        setLoading(false);
      }
    };
    if (idCloud) {
      loadPermission(idCloud);
    }
  }, [idCloud]);

  if (!idCloud) {
    return { loading: false, canInvite: false, hasDomainRestrictions: false };
  } else if (loading) {
    return { loading };
  }

  return {
    loading,
    canInvite: canInviteToJira,
    hasDomainRestrictions: domainRestrictions,
  };
};
