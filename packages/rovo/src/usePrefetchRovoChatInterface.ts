import { useLazyComponent } from '@trello/use-lazy-component';

export const usePrefetchRovoChatInterface = () =>
  useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "rovo-chat-interface" */ './RovoChatInterface'
      ),
    { namedImport: 'RovoChatInterface', preload: true },
  );
