import type { FunctionComponent } from 'react';
import { Suspense } from 'react';

import {
  ChunkLoadErrorBoundary,
  ErrorBoundary,
} from '@trello/error-boundaries';
import { useLazyComponent } from '@trello/use-lazy-component';

import type { SmartListJiraIssueModalProps } from './SmartListJiraIssueModal';

export const LazySmartListJiraIssueModal: FunctionComponent<
  SmartListJiraIssueModalProps
> = (props) => {
  const SmartListJiraIssueModal = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "smart-list-jira-issue-modal" */ './SmartListJiraIssueModal'
      ),
    { namedImport: 'SmartListJiraIssueModal', preload: false },
  );
  return (
    <Suspense fallback={null}>
      <ErrorBoundary
        tags={{
          ownershipArea: 'trello-enterprise',
          feature: 'Smart List',
        }}
      >
        <ChunkLoadErrorBoundary fallback={null}>
          <SmartListJiraIssueModal {...props} />
        </ChunkLoadErrorBoundary>
      </ErrorBoundary>
    </Suspense>
  );
};
