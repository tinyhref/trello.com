import { PersistentSharedState } from '@trello/shared-state';

export type DynamicConfigClientSharedState = {
  timeStamp: number;
  config: string | undefined;
  isFetching: boolean;
};
/**
 * Shared state for the dynamic config client.
 *
 * This is used to track whether the dynamic config client has been initialized.
 */
export const dynamicConfigClientSharedState =
  new PersistentSharedState<DynamicConfigClientSharedState>(
    {
      timeStamp: 0,
      config: undefined,
      isFetching: false,
    },
    {
      storageKey: 'dynamicConfigClient',
    },
  );
