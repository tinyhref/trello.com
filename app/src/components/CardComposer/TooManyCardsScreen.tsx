import type { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';

import { Button } from '@trello/nachos/button';

interface TooManyCardsScreenProps {
  count: number;
  closeCallback: () => void;
}

export const TooManyCardsScreen: FunctionComponent<TooManyCardsScreenProps> = ({
  count,
  closeCallback,
}: TooManyCardsScreenProps) => {
  return (
    <div>
      <p>
        <FormattedMessage
          id="templates.card_composer_inline.too-many-cards"
          description="Description for explaining that too many cards would be added so the action is not allowed"
          defaultMessage="That's going to create a card for every new line ({count}). You can't add over a hundred cards to a board at once."
          values={{ count }}
        />
      </p>
      <Button
        appearance={'primary'}
        autoFocus
        size="fullwidth"
        onClick={closeCallback}
      >
        <FormattedMessage
          id="templates.card_composer_inline.too-many-cards-cancel"
          description="Text for cancel button"
          defaultMessage="Okay..."
        />
      </Button>
    </div>
  );
};
