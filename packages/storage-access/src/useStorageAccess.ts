import { useEffect, useState } from 'react';

/**
 * Some browsers restrict embedded, cross-origin content from accessing first-party
 * storage (e.g. cookies)
 * This hook sets a boolean "hasAccess" that reflects the current context's access
 * to browser storage
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/Storage_Access_API}
 */
export function useStorageAccess() {
  const [hasAccess, setHasAccess] = useState(false);

  const fetchStorageAccess = async () => {
    if (typeof document.hasStorageAccess !== 'function') {
      setHasAccess(true);
    } else {
      const hasStorageAccess = await document.hasStorageAccess();
      setHasAccess(hasStorageAccess);
    }
  };

  useEffect(() => {
    fetchStorageAccess();
  }, []);

  return hasAccess;
}
