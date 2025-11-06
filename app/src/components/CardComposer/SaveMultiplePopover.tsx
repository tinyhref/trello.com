import type { FunctionComponent } from 'react';
import { useRef } from 'react';

import { MultipleCardsOption } from './MultipleCardsOption';
import { TooManyCardsScreen } from './TooManyCardsScreen';

export const MAX_CARDS = 100;

interface SaveMultiplePopoverProps {
  count: number;
  saveCallback: (saveMultiple: boolean) => Promise<void>;
  closeCallback: () => void;
}

export const SaveMultiplePopover: FunctionComponent<
  SaveMultiplePopoverProps
> = ({ count, saveCallback, closeCallback }: SaveMultiplePopoverProps) => {
  const divRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={divRef}>
      {count > MAX_CARDS ? (
        <TooManyCardsScreen count={count} closeCallback={closeCallback} />
      ) : (
        <MultipleCardsOption count={count} saveCallback={saveCallback} />
      )}
    </div>
  );
};
