import type { FunctionComponent, MouseEvent } from 'react';
import { useCallback, useMemo } from 'react';

import { Analytics, formatContainers } from '@trello/atlassian-analytics';
import { useCardId } from '@trello/id-context';
import { CompactCardLabel, showLabelsState, sortLabels } from '@trello/labels';
import { useAreLabelsAvailable } from '@trello/personal-workspace';
import { useSharedState } from '@trello/shared-state';

import { stopPropagationAndPreventDefault } from 'app/src/stopPropagationAndPreventDefault';
import type { CardFrontLabelsFragment } from './CardFrontLabelsFragment.generated';
import { useCardFrontLabelsFragment } from './CardFrontLabelsFragment.generated';

import * as styles from './CardFrontLabels.module.less';

type Label = CardFrontLabelsFragment['labels'][number];

interface ColoredLabel extends Omit<Label, 'color'> {
  color: NonNullable<Label>['color'];
}

export const CardFrontLabels: FunctionComponent = () => {
  const showLabels = useAreLabelsAvailable();
  const cardId = useCardId();

  const { data } = useCardFrontLabelsFragment({
    from: { id: cardId },
    optimistic: true,
  });

  const { idBoard, idList, labels } = data ?? {};

  const sortedLabels = useMemo(
    () => sortLabels(labels).filter((l): l is ColoredLabel => !!l.color),
    [labels],
  );

  const [{ showText }, setShowText] = useSharedState(showLabelsState);

  const onClick = useCallback(
    (e: MouseEvent) => {
      if (e.ctrlKey || e.metaKey || e.shiftKey) {
        return;
      }
      stopPropagationAndPreventDefault(e);
      setShowText((state) => ({ showText: !state.showText }));
      Analytics.sendTrackEvent({
        action: 'toggled',
        actionSubject: 'labelText',
        source: 'cardView',
        containers: formatContainers({ idCard: cardId, idBoard, idList }),
        attributes: { visibility: showText },
      });
    },
    [cardId, idBoard, idList, showText, setShowText],
  );

  // Even if there are labels on the card, don't show them on the front if the card isn't eligible
  if (!showLabels) {
    return null;
  }

  if (!sortedLabels.length) {
    return null;
  }

  return (
    <div className={styles.labels}>
      {sortedLabels.map((label) => (
        <div key={label.id} className={styles.labelWrapper}>
          <CompactCardLabel
            className={styles.label}
            label={label}
            onClick={onClick}
            tabIndex={-1}
          />
        </div>
      ))}
    </div>
  );
};
