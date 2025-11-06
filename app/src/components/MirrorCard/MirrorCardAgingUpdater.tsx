import type { FunctionComponent } from 'react';
import { useContext, useLayoutEffect, useMemo, useRef } from 'react';

import { optimisticIdManager } from '@trello/graphql';
import { useBoardId, useCardId } from '@trello/id-context';
import { getMilliseconds } from '@trello/time';

import { LegacyPowerUps } from 'app/scripts/data/legacy-power-ups';
// eslint-disable-next-line @trello/less-matches-component, @trello/assets-alongside-implementation
import * as styles from 'app/src/components/CardFront/CardAgingUpdater.module.less';
import { CardFrontContext } from 'app/src/components/CardFront/CardFrontContext';
import type { MirrorBoardCardAgingPrefsFragment } from './MirrorBoardCardAgingPrefsFragment.generated';
import { useMirrorBoardCardAgingPrefsFragment } from './MirrorBoardCardAgingPrefsFragment.generated';
import { useMirrorCardLastActivityFragment } from './MirrorCardLastActivityFragment.generated';

interface Plugin {
  id: string;
  idPlugin: string;
}

type CardAgingPref = NonNullable<
  NonNullable<NonNullable<MirrorBoardCardAgingPrefsFragment>>['prefs']
>['cardAging'];

const calculateAgingStyle = (
  cardAgingPref: CardAgingPref | undefined,
  lastActivity: string | undefined,
  cardId: string,
) => {
  if (!cardAgingPref || !lastActivity) {
    return null;
  }

  const ONE_WEEK_IN_MS = getMilliseconds({ days: 7 });
  const TWO_WEEKS_IN_MS = ONE_WEEK_IN_MS * 2;
  const ONE_MONTH_IN_MS = ONE_WEEK_IN_MS * 4;

  const timeInactive = Date.now().valueOf() - new Date(lastActivity).getTime();

  if (timeInactive > ONE_MONTH_IN_MS) {
    // If we're in pirate mode, and the card hasn't had activity in a while,
    // we want to pseudo-randomly, but stably add a little easter egg.
    // Picked "6" because it's known to be load bearing.
    if (cardAgingPref === 'pirate' && parseInt(cardId, 16) % 50 === 6) {
      return styles['aging-pirate-level-3-treasure'];
    }
    return styles[`aging-${cardAgingPref}-level-3`];
  } else if (timeInactive > TWO_WEEKS_IN_MS) {
    return styles[`aging-${cardAgingPref}-level-2`];
  } else if (timeInactive > ONE_WEEK_IN_MS) {
    return styles[`aging-${cardAgingPref}-level-1`];
  }

  return null;
};

interface MirrorCardAgingUpdaterProps {
  mirrorCardId: string;
}

/**
 * Similar to CardAgingUpdater, but it factors in activity from both the source card
 * and the mirror card. The aging status would be based on the most recent
 * dateLastActivity and would ignore the evergreen status from the source card
 * since the power-up is hidden from the mirror card popover.
 */
export const MirrorCardAgingUpdater: FunctionComponent<
  MirrorCardAgingUpdaterProps
> = ({ mirrorCardId }) => {
  const boardId = useBoardId();
  const sourceCardId = useCardId();
  const { cardFrontRef } = useContext(CardFrontContext);

  const { data: boardCardAgingPrefData } = useMirrorBoardCardAgingPrefsFragment(
    {
      from: { id: boardId },
      optimistic: true,
    },
  );

  const isCardAgingEnabled = useMemo(() => {
    if (!boardCardAgingPrefData) return false;

    return (
      boardCardAgingPrefData.boardPlugins?.some(
        (plugin: Plugin) => plugin.idPlugin === LegacyPowerUps.cardAging,
      ) ||
      boardCardAgingPrefData.powerUps?.some(
        (powerUp: string) => powerUp === 'cardAging',
      )
    );
  }, [boardCardAgingPrefData]);

  const { data: sourceCardAgingPrefData } = useMirrorCardLastActivityFragment({
    from: { id: sourceCardId },
    optimistic: true,
  });

  const { data: mirrorCardAgingPrefData } = useMirrorCardLastActivityFragment({
    from: { id: mirrorCardId },
    optimistic: true,
  });

  const boardCardAgingPref = boardCardAgingPrefData?.prefs?.cardAging;
  const isTemplate = sourceCardAgingPrefData?.isTemplate || false;
  const dateLastActivity = useMemo(() => {
    if (
      mirrorCardAgingPrefData?.id &&
      optimisticIdManager.isOptimisticId(mirrorCardAgingPrefData.id)
    ) {
      return undefined;
    }
    if (
      mirrorCardAgingPrefData?.dateLastActivity &&
      sourceCardAgingPrefData?.dateLastActivity
    ) {
      const destinationCardTimeInactive =
        Date.now().valueOf() -
        new Date(mirrorCardAgingPrefData.dateLastActivity).getTime();
      const sourceCardTimeInactive =
        Date.now().valueOf() -
        new Date(sourceCardAgingPrefData.dateLastActivity).getTime();
      return destinationCardTimeInactive < sourceCardTimeInactive
        ? mirrorCardAgingPrefData.dateLastActivity
        : sourceCardAgingPrefData.dateLastActivity;
    }
    return sourceCardAgingPrefData?.dateLastActivity;
  }, [
    mirrorCardAgingPrefData?.dateLastActivity,
    mirrorCardAgingPrefData?.id,
    sourceCardAgingPrefData?.dateLastActivity,
  ]);
  const previousClassName = useRef<string | null>(null);

  useLayoutEffect(() => {
    const element = cardFrontRef.current;

    if (!element) {
      return;
    }

    let className: string | null = null;

    if (isCardAgingEnabled && !isTemplate) {
      className = calculateAgingStyle(
        boardCardAgingPref,
        dateLastActivity,
        mirrorCardId,
      );
    }

    if (className === previousClassName.current) {
      return;
    }

    if (previousClassName.current) {
      element.classList.remove(previousClassName.current);
    }

    if (className) {
      element.classList.add(className);
    }

    previousClassName.current = className;
  }, [
    boardCardAgingPref,
    cardFrontRef,
    sourceCardId,
    mirrorCardId,
    dateLastActivity,
    isCardAgingEnabled,
    isTemplate,
  ]);

  return null;
};
