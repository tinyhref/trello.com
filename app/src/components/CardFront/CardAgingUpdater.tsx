import type { FunctionComponent } from 'react';
import {
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useBoardId, useCardId } from '@trello/id-context';
import { getMilliseconds } from '@trello/time';

import { LegacyPowerUps } from 'app/scripts/data/legacy-power-ups';
import type { BoardCardAgingPrefsFragment } from './BoardCardAgingPrefsFragment.generated';
import { useBoardCardAgingPrefsFragment } from './BoardCardAgingPrefsFragment.generated';
import { CardFrontContext } from './CardFrontContext';
import { useCardLastActivityFragment } from './CardLastActivityFragment.generated';

import * as styles from './CardAgingUpdater.module.less';

interface Plugin {
  id: string;
  idPlugin: string;
}

const ONE_WEEK_IN_MS = getMilliseconds({ days: 7 });
const TWO_WEEKS_IN_MS = ONE_WEEK_IN_MS * 2;
const ONE_MONTH_IN_MS = ONE_WEEK_IN_MS * 4;

type CardAgingPref = NonNullable<
  NonNullable<NonNullable<BoardCardAgingPrefsFragment>>['prefs']
>['cardAging'];

const calculateAgingStyle = (
  cardAgingPref: CardAgingPref | undefined,
  lastActivity: string | undefined,
  cardId: string,
) => {
  if (!cardAgingPref || !lastActivity) {
    return null;
  }

  const timeInactive = Date.now().valueOf() - new Date(lastActivity).getTime();

  if (timeInactive > ONE_MONTH_IN_MS) {
    // If we're in pirate mode, and the card hasn't had activity in a while,
    // we want to pseudo-randomly, but stably add a little easter egg.
    // Picked "6" because it's known to be load bearing.
    if (cardAgingPref === 'pirate' && parseInt(cardId, 16) % 50 === 6) {
      return styles[`aging-pirate-level-3-treasure`];
    }
    return styles[`aging-${cardAgingPref}-level-3`];
  } else if (timeInactive > TWO_WEEKS_IN_MS) {
    return styles[`aging-${cardAgingPref}-level-2`];
  } else if (timeInactive > ONE_WEEK_IN_MS) {
    return styles[`aging-${cardAgingPref}-level-1`];
  }

  return null;
};

export const CardAgingUpdater: FunctionComponent = () => {
  const boardId = useBoardId();
  const cardId = useCardId();

  const { cardFrontRef } = useContext(CardFrontContext);

  const { data: boardCardAgingPrefData } = useBoardCardAgingPrefsFragment({
    from: { id: boardId },
    optimistic: true,
  });

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

  const { data: cardAgingPrefData } = useCardLastActivityFragment({
    from: { id: cardId },
    optimistic: true,
  });

  const cardAgingPref = boardCardAgingPrefData?.prefs?.cardAging;
  const isTemplate = cardAgingPrefData?.isTemplate || false;
  const dateLastActivity = cardAgingPrefData?.dateLastActivity;

  const isEvergreenModeEnabled = useMemo(() => {
    const cardAgingPluginData = cardAgingPrefData?.pluginData?.find(
      ({ idPlugin }) => idPlugin === LegacyPowerUps.cardAging,
    );
    if (cardAgingPluginData?.value) {
      const parsedData = JSON.parse(cardAgingPluginData.value);
      return parsedData.evergreen ?? false;
    }
    return false;
  }, [cardAgingPrefData?.pluginData]);
  const previousClassName = useRef<string | null>(null);

  const [element, setElement] = useState<HTMLElement | null>(null);
  useEffect(() => {
    setElement(cardFrontRef.current);
  }, [cardFrontRef]);

  useLayoutEffect(() => {
    if (!element) {
      return;
    }

    let className: string | null = null;

    if (isCardAgingEnabled && !isTemplate && !isEvergreenModeEnabled) {
      className = calculateAgingStyle(cardAgingPref, dateLastActivity, cardId);
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
    cardAgingPref,
    cardFrontRef,
    cardId,
    dateLastActivity,
    element,
    isCardAgingEnabled,
    isEvergreenModeEnabled,
    isTemplate,
  ]);

  return null;
};
