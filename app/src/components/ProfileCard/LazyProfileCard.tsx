import type { FunctionComponent } from 'react';
import { Suspense } from 'react';

import { useLazyComponent } from '@trello/use-lazy-component';

import type { Props } from './ProfileCard';
import { ProfileCardSkeleton } from './ProfileCardSkeleton';

export const LazyProfileCard: FunctionComponent<Props> = (props) => {
  const ProfileCard = useLazyComponent(
    () => import(/* webpackChunkName: "profile-card" */ './ProfileCard'),
    { namedImport: 'ProfileCard' },
  );

  return (
    <Suspense fallback={<ProfileCardSkeleton onClose={props.onClose} />}>
      <ProfileCard {...props} />
    </Suspense>
  );
};
