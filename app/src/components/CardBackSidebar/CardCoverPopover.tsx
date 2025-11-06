import { Suspense, useMemo, type FunctionComponent } from 'react';

import { ChunkLoadErrorBoundary } from '@trello/error-boundaries';
import { Popover, type PopoverProps } from '@trello/nachos/popover';
import { useLazyComponent } from '@trello/use-lazy-component';

import { CardCoverScreens as Screens } from './CardCoverScreens';

export interface CardCoverPopoverProps {
  pop: () => void;
  popoverProps: PopoverProps<HTMLButtonElement, HTMLElement>;
  push: (screen: number) => void;
}

export const CardCoverPopover: FunctionComponent<CardCoverPopoverProps> = ({
  pop,
  popoverProps,
  push,
}) => {
  const CardCoverPopoverContent = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "card-cover-popover-content" */ './CardCoverPopoverContent'
      ),
    { namedImport: 'CardCoverPopoverContent' },
  );

  const labelledBy = useMemo(() => {
    switch (popoverProps.currentScreen) {
      case Screens.AddCover:
        return 'card-cover-photo-search-popover';
      case Screens.SelectCover:
        return 'card-cover-popover';
      default:
        return undefined;
    }
  }, [popoverProps.currentScreen]);

  return (
    <Popover {...popoverProps} size="medium" labelledBy={labelledBy}>
      <Suspense fallback={null}>
        <ChunkLoadErrorBoundary fallback={null}>
          <CardCoverPopoverContent push={push} pop={pop} />
        </ChunkLoadErrorBoundary>
      </Suspense>
    </Popover>
  );
};
