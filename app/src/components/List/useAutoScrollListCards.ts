import { useEffect } from 'react';

import { autoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element';
import { unsafeOverflowAutoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/unsafe-overflow/element';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';

type ProvidedHitboxSpacing = ReturnType<
  Parameters<typeof unsafeOverflowAutoScrollForElements>[0]['getOverflow']
>;

// We want lists to overflow scroll beyond the top and bottom edge indefinitely.
// We are choosing `6000px` to represent "forever".
const overflow: ProvidedHitboxSpacing = {
  forTopEdge: { top: 6000, left: 0, right: 0 },
  forBottomEdge: { bottom: 6000, left: 0, right: 0 },
  forLeftEdge: { left: 0 },
  forRightEdge: { right: 0 },
};
// Exported for unit tests, don't rely on this elsewhere.
export const getOverflow = () => overflow;

export function useAutoScrollListCards(
  cardsRef: React.RefObject<HTMLOListElement>,
) {
  useEffect(() => {
    if (!cardsRef.current) {
      return;
    }

    return combine(
      // only auto scrolling for cards (ie not columns)
      autoScrollForElements({
        element: cardsRef.current,
        getAllowedAxis: () => 'vertical',
        canScroll: (args) => {
          return args.source.data.type === 'trello/card';
        },
      }),
      unsafeOverflowAutoScrollForElements({
        element: cardsRef.current,
        getAllowedAxis: () => 'vertical',
        canScroll: ({ source }) => source.data.type === 'trello/card',
        getOverflow,
      }),
    );
  }, [cardsRef]);
}
