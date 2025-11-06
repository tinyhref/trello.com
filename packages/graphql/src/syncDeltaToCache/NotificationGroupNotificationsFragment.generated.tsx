import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type NotificationGroupNotificationsFragment = (
  { __typename: 'NotificationGroup' }
  & { notifications: Array<(
    { __typename: 'Notification' }
    & Pick<Types.Notification, 'id'>
  )> }
);

export const NotificationGroupNotificationsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'NotificationGroupNotifications' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'NotificationGroup' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'notifications' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseNotificationGroupNotificationsFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      NotificationGroupNotificationsFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseNotificationGroupNotificationsFragmentResult
  extends Omit<
    Apollo.UseFragmentResult<NotificationGroupNotificationsFragment>,
    'data'
  > {
  data?: NotificationGroupNotificationsFragment;
}

export const useNotificationGroupNotificationsFragment = ({
  from,
  returnPartialData,
  ...options
}: UseNotificationGroupNotificationsFragmentOptions): UseNotificationGroupNotificationsFragmentResult => {
  const result = Apollo.useFragment<NotificationGroupNotificationsFragment>({
    ...options,
    fragment: NotificationGroupNotificationsFragmentDoc,
    fragmentName: 'NotificationGroupNotifications',
    from:
      !from || !(from as Apollo.StoreObject)?.id
        ? null
        : { __typename: 'NotificationGroup', ...from },
  });

  // Ensure that the fragment result is not typed as a DeepPartial.
  if (!result.complete && !returnPartialData) {
    if (process.env.NODE_ENV === 'development') {
      if (
        localStorage.getItem('HIDE_FRAGMENT_WARNINGS') === 'false' ||
        localStorage.getItem('HIDE_FRAGMENT_WARNINGS') === null
      ) {
        console.warn('Fragment data is incomplete.', result);
      }
    }
    return {
      ...result,
      data: undefined,
    };
  }

  return {
    ...result,
    data: result.data as NotificationGroupNotificationsFragment,
  };
};
