import type { FunctionComponent } from 'react';
import { Suspense } from 'react';

import { ChunkLoadErrorBoundary } from '@trello/error-boundaries';
import { useLazyComponent } from '@trello/use-lazy-component';

import type { InviteTeamMembersFormProps } from './InviteTeamMembersForm';

export const LazyInviteTeamMembersForm: FunctionComponent<
  InviteTeamMembersFormProps
> = (props) => {
  const InviteTeamMembersForm = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "invite-team-members-form" */ './InviteTeamMembersForm'
      ),
    { namedImport: 'InviteTeamMembersForm' },
  );

  return (
    <ChunkLoadErrorBoundary fallback={null}>
      <Suspense fallback={null}>
        <InviteTeamMembersForm {...props} />
      </Suspense>
    </ChunkLoadErrorBoundary>
  );
};
