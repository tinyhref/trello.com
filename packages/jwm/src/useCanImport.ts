import { useIsSiteAdmin } from './useIsSiteAdmin';

export const useCanImport = (idCloud: string | undefined) => {
  // Currently the public permissions API does not make it possible
  // to directly check if the user has permission to import into JWM.
  // The permissions logic as of Nov 2023 was that only _site_ admins
  // can import projects into JWM.

  const { isSiteAdmin, loading } = useIsSiteAdmin(idCloud);

  return {
    canImport: isSiteAdmin,
    loading,
  };
};
