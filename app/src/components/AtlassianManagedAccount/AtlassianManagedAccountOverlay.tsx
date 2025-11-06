import type { FunctionComponent } from 'react';
import { useMemo } from 'react';

import { formatContainers } from '@trello/atlassian-analytics';

import { AtlassianManagedAccountDialog } from './AtlassianManagedAccountDialog';
import { useAtlassianManagedAccountOverlay } from './useAtlassianManagedAccountOverlay';

interface AtlassianManagedAccountOverlayProps {
  shouldInterrupt: boolean;
}

export const AtlassianManagedAccountOverlay: FunctionComponent<
  AtlassianManagedAccountOverlayProps
> = ({ shouldInterrupt }) => {
  const { me, hasBoards, shouldRender } = useAtlassianManagedAccountOverlay();

  const { enterprise } = me?.requiresAaOnboarding || {};
  const idEnterprise = enterprise?.id;

  const analyticsContext = useMemo(() => {
    return {
      enterpriseId: idEnterprise,
      v2: true,
    };
  }, [idEnterprise]);

  const analyticsContainers = useMemo(() => {
    return formatContainers({
      idEnterprise,
    });
  }, [idEnterprise]);

  // Ensure we have all the data necessary to render (none of our fields are null)
  if (!shouldRender || !shouldInterrupt) {
    return null;
  }

  return (
    <AtlassianManagedAccountDialog
      id={me?.id || ''}
      orgName={enterprise?.displayName}
      hasBoards={hasBoards}
      analyticsContext={analyticsContext}
      analyticsContainers={analyticsContainers}
    />
  );
};
