import { useCallback, useMemo, useState, type FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';

import { Button } from '@trello/nachos/button';
import { Select } from '@trello/nachos/select';
import { useMemberInboxIds } from '@trello/personal-workspace';

import { useInboxPositionSelectorQuery } from './InboxPositionSelectorQuery.generated';

// eslint-disable-next-line @trello/less-matches-component
import * as styles from './InboxPositionSelector.module.less';

type Variation = 'copy' | 'move';

interface InboxPositionSelectorBulkProps {
  variation: Variation;
  onAction: (index: number) => Promise<void>;
}

export const InboxPositionSelectorBulk: FunctionComponent<
  InboxPositionSelectorBulkProps
> = ({ variation, onAction }) => {
  const { idBoard: inboxId } = useMemberInboxIds();

  const { data } = useInboxPositionSelectorQuery({
    variables: { inboxId: inboxId ?? '' },
    skip: !inboxId,
    waitOn: [],
  });

  const [selectedPosition, setSelectedPosition] = useState<number | null>(null);

  const inboxCards = (data?.board?.cards ?? []).toSorted(
    (a, b) => a.pos - b.pos,
  );
  const indexInInbox = inboxCards.length;
  const cardInInbox = indexInInbox !== -1;

  const options = useMemo(() => {
    if (!inboxCards || inboxCards.length === 0) {
      return [
        {
          label: '1',
          value: 0,
        },
      ];
    }

    // there is an extra option if moving a card into the inbox
    return [
      ...Array(
        inboxCards.length + (!cardInInbox || variation === 'copy' ? 1 : 0),
      ).keys(),
    ].map((i) => ({
      label: String(i + 1) + (i === indexInInbox ? ' (current)' : ''),
      value: i,
    }));
  }, [cardInInbox, inboxCards, indexInInbox, variation]);

  const defaultValue = useMemo(() => {
    if (!inboxCards || inboxCards.length === 0) {
      return {
        label: '1',
        value: 0,
      };
    }

    if (!cardInInbox) {
      // selected card to move is not in the inbox, so default to the end
      return {
        label: String(inboxCards.length + (!cardInInbox ? 1 : 0)),
        value: inboxCards.length - (!cardInInbox ? 0 : -1),
      };
    } else {
      return { label: String(indexInInbox + 1), value: indexInInbox };
    }
  }, [cardInInbox, inboxCards, indexInInbox]);

  const onPositionSelect = useCallback(
    (option: { label: string; value: number } | null) => {
      if (option === null) {
        return;
      }

      setSelectedPosition(option.value);
    },
    [],
  );

  return (
    <div className={styles.inboxPositionSelector}>
      <span>
        <FormattedMessage
          id="view title.select position"
          defaultMessage="Select position"
          description="Move card select label on move card popover"
        />
      </span>
      <Select
        options={options ? options : []}
        value={
          options !== null && selectedPosition !== null
            ? options?.[selectedPosition]
            : defaultValue
        }
        onChange={onPositionSelect}
      />
      <Button
        className={styles.button}
        appearance="primary"
        onClick={() => onAction(selectedPosition ?? defaultValue!.value)}
      >
        {variation === 'copy' ? (
          <FormattedMessage
            id="templates.card-templates.create-card"
            defaultMessage="Create card"
            description="Text on button for creating a card from a template"
          />
        ) : (
          <FormattedMessage
            id="templates.popover_move_card.move"
            defaultMessage="Move"
            description="Move card button text on move card popover"
          />
        )}
      </Button>
    </div>
  );
};
