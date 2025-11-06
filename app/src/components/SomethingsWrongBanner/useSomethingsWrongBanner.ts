import { useDynamicConfig } from '@trello/dynamic-config';

export function useSomethingsWrongBanner() {
  const flagEnabled = useDynamicConfig('trello_web_somethings_wrong');

  return {
    wouldRender: flagEnabled,
  };
}
