import { useCallback } from 'react';

import { Analytics } from '@trello/atlassian-analytics';
import { client } from '@trello/graphql';
import type { List, List_DataSource } from '@trello/model-types';
import { convertToUGCString } from '@trello/privacy';

import type { SmartListFragment } from './SmartListFragment.generated';
import { SmartListFragmentDoc } from './SmartListFragment.generated';
import { useUpdateListDatasourceFilterMutation } from './UpdateListDatasourceFilterMutation.generated';

type ToggleFilterArgs = {
  idList: string;
};

export function useToggleSmartListFilter() {
  const [updateListDatasourceFilter] = useUpdateListDatasourceFilterMutation();

  const toggleFilter = useCallback(
    async ({ idList }: ToggleFilterArgs) => {
      const list = client.readFragment<SmartListFragment>(
        {
          id: client.cache.identify({
            id: idList,
            __typename: 'List',
          }),
          fragment: SmartListFragmentDoc,
        },
        true,
      );

      const newFilterValue = !list?.datasource?.filter;

      const traceId = Analytics.startTask({
        taskName: 'edit-list/filter',
        source: 'boardScreen',
      });

      try {
        await updateListDatasourceFilter({
          variables: {
            listId: idList,
            value: newFilterValue,
            traceId,
          },
          optimisticResponse: {
            __typename: 'Mutation',
            updateListDatasourceFilter: {
              id: idList,
              datasource: {
                __typename: 'List_DataSource',
                filter: newFilterValue,
              },
              __typename: 'List',
            },
          },
          update(cache) {
            cache.modify<List>({
              id: cache.identify({
                id: idList,
                __typename: 'List',
              }),
              fields: {
                datasource(datasource) {
                  return {
                    __typename: 'List_DataSource',
                    handler: (datasource as List_DataSource)?.handler,
                    filter: newFilterValue,
                    link: list?.datasource?.link ?? convertToUGCString(''),
                  };
                },
              },
            });
          },
        });

        Analytics.taskSucceeded({
          taskName: 'edit-list/filter',
          source: 'boardScreen',
          traceId,
        });
      } catch (error) {
        Analytics.taskFailed({
          taskName: 'edit-list/filter',
          source: 'boardScreen',
          traceId,
          error,
        });
      }
    },
    [updateListDatasourceFilter],
  );

  return { toggleFilter };
}
