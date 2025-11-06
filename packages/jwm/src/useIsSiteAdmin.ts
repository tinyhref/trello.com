import { useEffect, useState } from 'react';

import { isSiteAdmin } from './permissions';

export interface IsSiteAdminLoading {
  loading: true;
  isSiteAdmin: undefined;
}

export interface IsSiteAdminResolved {
  loading: false;
  isSiteAdmin: boolean;
}

export const useIsSiteAdmin = (
  idCloud: string | undefined,
): IsSiteAdminLoading | IsSiteAdminResolved => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPermission = async (cloudId: string) => {
      setLoading(true);
      setIsAdmin(await isSiteAdmin(cloudId));
      setLoading(false);
    };

    if (idCloud) {
      loadPermission(idCloud);
    }
  }, [idCloud]);

  if (!idCloud) {
    return { loading: false, isSiteAdmin: false };
  } else if (loading) {
    return { loading, isSiteAdmin: undefined };
  }

  return { loading, isSiteAdmin: isAdmin };
};
