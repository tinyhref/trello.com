import { useEffect, type FunctionComponent } from 'react';

import { Analytics, formatContainers } from '@trello/atlassian-analytics';
import { useBoardId, useListId, useWorkspaceId } from '@trello/id-context';
import { token } from '@trello/theme';

import { LazyUpgradeSmartComponent } from 'app/src/components/UpgradePrompts';

interface ListColorPickerUpgradePromptProps {
  onClickCta?: () => void;
}

export const ListColorPickerUpgradePrompt: FunctionComponent<
  ListColorPickerUpgradePromptProps
> = ({ onClickCta }) => {
  const boardId = useBoardId();
  const listId = useListId();
  const workspaceId = useWorkspaceId();

  useEffect(() => {
    Analytics.sendViewedComponentEvent({
      componentName: 'bcUpgradePrompt',
      componentType: 'prompt',
      source: 'listColorPickerInlineDialog',
      containers: formatContainers({ boardId, listId, workspaceId }),
    });
  }, [boardId, listId, workspaceId]);

  return (
    <div style={{ marginTop: token('space.050', '4px') }}>
      <LazyUpgradeSmartComponent
        promptId="listColorPickerPromptFull"
        orgId={workspaceId!}
        additionalProps={{ onClickCta }}
      />
    </div>
  );
};
