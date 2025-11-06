import { Suspense } from 'react';

import {
  ChunkLoadErrorBoundary,
  ErrorBoundary,
} from '@trello/error-boundaries';
import { useLazyComponent } from '@trello/use-lazy-component';

export const LazyPersonalProductivitySurveyBanner = () => {
  const PersonalProductivitySurveyBanner = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "personal-productivity-survey-banner" */ './PersonalProductivitySurveyBanner'
      ),
    {
      preload: false,
      namedImport: 'PersonalProductivitySurveyBanner',
    },
  );

  return (
    <Suspense fallback={null}>
      <ErrorBoundary
        tags={{
          ownershipArea: 'trello-ghost',
          feature: 'Personal Productivity Survey',
        }}
      >
        <ChunkLoadErrorBoundary fallback={null}>
          <PersonalProductivitySurveyBanner />
        </ChunkLoadErrorBoundary>
      </ErrorBoundary>
    </Suspense>
  );
};
