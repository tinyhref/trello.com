import type { FunctionComponent } from 'react';
import { useEffect, useState } from 'react';

import Lozenge from '@atlaskit/lozenge';
import type { SourceType } from '@trello/analytics-types';
import { Analytics } from '@trello/atlassian-analytics';
import { forNamespace } from '@trello/legacy-i18n';
import type { TestId } from '@trello/test-ids';

import type { NewFeature } from './FeatureRolloutConfig';
import { useNewFeature } from './useNewFeature';

const format = forNamespace('new feature');

interface NewPillProps {
  featureId: NewFeature;
  source: SourceType;
  /**
   * Whether to fire a oneTimeMessagesDismissed indicating that the new feature
   * has been seen when this component renders.
   * @default true
   */
  markViewed?: boolean;
  testId?: TestId;
}

export const NewPill: FunctionComponent<NewPillProps> = ({
  featureId,
  source,
  markViewed = true,
  testId,
}) => {
  const { isNewFeature, acknowledgeNewFeature } = useNewFeature(featureId);
  const [shouldMarkViewed, setShouldMarkViewed] = useState(markViewed);

  useEffect(() => {
    if (shouldMarkViewed && isNewFeature) {
      acknowledgeNewFeature({ source });
      setShouldMarkViewed(false);
      Analytics.sendViewedComponentEvent({
        componentType: 'pill',
        componentName: 'newFeaturePill',
        source,
        attributes: { featureId },
      });
    }
  }, [
    featureId,
    isNewFeature,
    acknowledgeNewFeature,
    shouldMarkViewed,
    source,
  ]);

  if (!isNewFeature) {
    return null;
  }

  return (
    <Lozenge appearance="new" testId={testId}>
      {format('new')}
    </Lozenge>
  );
};
