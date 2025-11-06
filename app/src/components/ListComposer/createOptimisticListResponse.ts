import type { AddListMutation } from './AddListMutation.generated';

type DeepRequired<T> = {
  [P in keyof T]-?: DeepRequired<T[P]>;
};

type CreatedList = NonNullable<AddListMutation['createList']>;

/**
 * when we can create smart lists on the server
 * we'll add in the datasource and type fields
 * here but we can default them to null for now
 */
export const createOptimisticListResponse = ({
  id,
  idBoard,
  name,
  pos,
}: Pick<CreatedList, 'id' | 'idBoard' | 'name' | 'pos'>): CreatedList => {
  // Enforce completeness here to ensure that our optimistic response fulfills
  // the type Apollo expects, but return it as the regular type for convenience.
  const list: DeepRequired<CreatedList> = {
    id,
    closed: false,
    color: null,
    creationMethod: null,
    idBoard,
    name,
    pos,
    softLimit: null,
    subscribed: false,
    datasource: null,
    type: null,
    limits: {
      cards: {
        openPerList: {
          __typename: 'Limit',
          count: null,
          disableAt: 5000,
          status: 'ok',
          warnAt: 4000,
        },
        totalPerList: {
          __typename: 'Limit',
          count: null,
          disableAt: 10000000,
          status: 'ok',
          warnAt: 800000,
        },
        __typename: 'List_Limits_Cards',
      },
      __typename: 'List_Limits',
    },
    __typename: 'List',
  };

  return list as CreatedList;
};
