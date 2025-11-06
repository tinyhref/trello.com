import { getMyEnterprise } from '@trello/business-logic/member';

import type { MyEnterpriseQuery } from './MyEnterpriseQuery.generated';
import { useMyEnterpriseQuery } from './MyEnterpriseQuery.generated';

type Enterprise = NonNullable<
  MyEnterpriseQuery['member']
>['enterprises'][number];

export const useMyEnterprise = (
  idMember?: string | null,
): Enterprise | null => {
  const { data } = useMyEnterpriseQuery({
    variables: {
      id: idMember || '',
    },
    skip: !idMember,
    waitOn: ['MemberHeader'],
  });

  if (!data?.member) {
    return null;
  }

  return getMyEnterprise(data?.member) as Enterprise | null;
};
