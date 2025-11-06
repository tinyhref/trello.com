import type { FunctionComponent } from 'react';
import { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';

import { localizeCount } from '@trello/legacy-i18n';
import { Button } from '@trello/nachos/button';

import * as styles from './MultipleCardsOption.module.less';

interface MultipleCardsOptionProps {
  count: number;
  saveCallback: (saveMultiple: boolean) => Promise<void>;
}

export const MultipleCardsOption: FunctionComponent<
  MultipleCardsOptionProps
> = ({
  count,
  saveCallback,
}: {
  count: number;
  saveCallback: (saveMultiple: boolean) => Promise<void>;
}) => {
  const saveSingleCard = useCallback(() => {
    saveCallback(false);
  }, [saveCallback]);

  const saveMultipleCards = useCallback(() => {
    saveCallback(true);
  }, [saveCallback]);

  return (
    <>
      <p>
        <FormattedMessage
          id="templates.card_composer_inline.create-multiple-cards-prompt"
          description="Description for explaining that multiple cards from each line can be created if the user wants"
          defaultMessage="If you want, we can create a card for every new line ({count}). You can also create one card with a long title."
          values={{ count }}
        />
      </p>
      <div className={styles.buttonContainer}>
        <Button
          appearance={'primary'}
          autoFocus
          size="fullwidth"
          onClick={saveMultipleCards}
        >
          {localizeCount('create-multiple-cards', count)}
        </Button>
        <Button
          appearance={'primary'}
          autoFocus
          size="fullwidth"
          onClick={saveSingleCard}
        >
          <FormattedMessage
            id="templates.card_composer_inline.just-one-card"
            description="Text for button to create just one card for all lines entered"
            defaultMessage="Just one card"
          />
        </Button>
      </div>
    </>
  );
};
