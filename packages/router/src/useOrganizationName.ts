import { useEffect, useState } from 'react';

import { getOrganizationNameFromPathname } from './getOrganizationNameFromPathname';
import { routerState } from './routerState';

export function useOrganizationName() {
  const [organizationName, setOrganizationName] = useState(() =>
    getOrganizationNameFromPathname(routerState.value.location.pathname),
  );

  useEffect(() => {
    const unsubscribe = routerState.subscribe((state) => {
      const nextOrganizationName = getOrganizationNameFromPathname(
        state.location.pathname,
      );

      if (nextOrganizationName !== organizationName) {
        setOrganizationName(nextOrganizationName);
      }
    });

    return () => unsubscribe();
  }, [organizationName]);

  return organizationName;
}
