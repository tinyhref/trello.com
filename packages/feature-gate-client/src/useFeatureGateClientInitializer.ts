import { useCallback, useEffect, useRef } from 'react';

import type { CustomAttributes } from '@atlaskit/feature-gate-js-client';
import { deepEqual } from '@trello/objects';
import { useSharedState } from '@trello/shared-state';
import { workspaceState } from '@trello/workspace-state';

import { initFeatureGatesClient } from './initFeatureGatesClient';
import { refreshFeatureGatesClient } from './refreshFeatureGatesClient';
import { useFeatureGatesClientRefresher } from './useFeatureGatesClientRefresher';

export const useFeatureGateClientInitializer = (
  customAttributes: CustomAttributes,
) => {
  const [workspaceStateValue] = useSharedState(workspaceState);

  const prevCustomAttributes = useRef<CustomAttributes>({});
  const prevWorkspaceId = useRef<string | null>(null);

  /**
   * We need to re-initialize the feature gates client whenever the custom attributes or workspaceId change.
   *
   * Previously we were not re-initializing the client when the workspaceId changed,
   * which created a bug where the workspace members page would not load due
   * to a race condition where the workspaceId wasn't being sent to the feature gates client
   * (see HOT-112731).
   *
   * The workspaceId is initially loaded via the useWorkspaceStateUpdater hook, and we access it
   * via featureGateClientInitializationState.value.identifiers.trelloWorkspaceId.  Since the
   * workspaceId was not being updated here we could not update the feature gate client with the
   * new feature gate values since the workspaceKey was undefined.
   *
   * This bug surfaced on the workspace members page since it was undergoing a modernization and
   * the feature gate client was being used in the controller layer to determine which components to render.
   */

  useEffect(() => {
    if (
      !deepEqual(prevCustomAttributes.current, customAttributes) ||
      prevWorkspaceId.current !== workspaceStateValue.workspaceId
    ) {
      prevCustomAttributes.current = customAttributes;
      prevWorkspaceId.current = workspaceStateValue.workspaceId;
      initFeatureGatesClient({
        customAttributes,
        workspaceId: workspaceStateValue.workspaceId,
      });
    }
  }, [customAttributes, workspaceStateValue.workspaceId]);

  useFeatureGatesClientRefresher(
    useCallback(
      () =>
        refreshFeatureGatesClient({
          customAttributes,
          workspaceId: workspaceStateValue.workspaceId,
        }),
      [customAttributes, workspaceStateValue.workspaceId],
    ),
  );
};
