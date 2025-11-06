import { useLazyComponent } from '@trello/use-lazy-component';

export const useLazyFeedbackCollector = ({ preload }: { preload: boolean }) =>
  useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "feedback-collector" */ './FeedbackCollector'
      ),
    { namedImport: 'FeedbackCollector', preload },
  );
