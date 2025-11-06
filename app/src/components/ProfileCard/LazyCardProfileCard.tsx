import type { FunctionComponent } from 'react';
import { Suspense } from 'react';

import { useLazyComponent } from '@trello/use-lazy-component';

import type { Props } from './CardProfileCard';
import { ProfileCardSkeleton } from './ProfileCardSkeleton';

export const LazyCardProfileCard: FunctionComponent<Props> = (props) => {
  const CardProfileCard = useLazyComponent(
    () =>
      import(/* webpackChunkName: "card-profile-card" */ './CardProfileCard'),
    { namedImport: 'CardProfileCard' },
  );

  return (
    <Suspense fallback={<ProfileCardSkeleton onClose={props.onClose} />}>
      <CardProfileCard {...props} />
    </Suspense>
  );
};
