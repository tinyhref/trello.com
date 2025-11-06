import { useMemo } from 'react';

import type { EntrypointId } from './EntrypointId';

export const FEEDBACK_CONTEXT_CF = 'customfield_10047';

export const useAdditionalFields = ({
  contextAttributes,
  contextOverride,
  entrypointId,
}: {
  contextAttributes?: Record<string, string>;
  contextOverride?: string;
  entrypointId?: EntrypointId;
}) => {
  // Currently the only additional field we send is Feedback Context
  const additionalFields = useMemo(() => {
    if (contextOverride) {
      return [{ id: FEEDBACK_CONTEXT_CF, value: contextOverride }];
    }
    return [
      {
        id: FEEDBACK_CONTEXT_CF,
        value: Object.entries(contextAttributes ?? {}).reduce(
          (acc, [key, val]) => `${acc}, ${key}: ${val}`,
          `entrypointId: ${entrypointId}`,
        ),
      },
    ];
  }, [contextAttributes, contextOverride, entrypointId]);
  return additionalFields;
};
