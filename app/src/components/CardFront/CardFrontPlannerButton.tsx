import type {
  FunctionComponent,
  KeyboardEventHandler,
  MouseEventHandler,
} from 'react';
import { useCallback, useMemo } from 'react';

import { Analytics } from '@trello/atlassian-analytics';
import { intl } from '@trello/i18n';
import { getKey, Key } from '@trello/keybindings';
import { Button } from '@trello/nachos/button';
import {
  useIsPlannerPanelOpen,
  useSplitScreenSharedState,
} from '@trello/split-screen';

import type { CardFrontSource } from './CardFront';

interface CardFrontPlannerButtonProps {
  cardFrontSource?: CardFrontSource;
}

export const CardFrontPlannerButton: FunctionComponent<
  CardFrontPlannerButtonProps
> = ({ cardFrontSource }) => {
  const { togglePlanner } = useSplitScreenSharedState();
  const isPlannerPanelOpen = useIsPlannerPanelOpen();

  const handleAction = useCallback(() => {
    Analytics.sendClickedButtonEvent({
      buttonName: 'cardFrontOpenPlannerButton',
      source: cardFrontSource === 'Planner' ? 'plannerCardFront' : 'cardView',
      attributes: {
        awarenessElement: 'planner',
      },
    });

    togglePlanner();
  }, [cardFrontSource, togglePlanner]);

  const onClick = useCallback<MouseEventHandler>(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      handleAction();
    },
    [handleAction],
  );

  const onKeyDown = useCallback<KeyboardEventHandler<HTMLButtonElement>>(
    (e) => {
      const key = getKey(e);
      if (key === Key.Enter) {
        e.preventDefault();
        e.stopPropagation();
        handleAction();
      }
    },
    [handleAction],
  );

  const openPlannerLabel = useMemo(
    () =>
      intl.formatMessage({
        id: 'templates.card_front.discovery.planner.action',
        defaultMessage: 'Open Planner',
        description: 'Button to open Planner from planner discovery card',
      }),
    [],
  );

  const closePlannerLabel = useMemo(
    () =>
      intl.formatMessage({
        id: 'templates.card_front.discovery.planner.close_planner_action',
        defaultMessage: 'Close Planner',
        description: 'Button to close Planner from planner discovery card',
      }),
    [],
  );

  const plannerLabel = isPlannerPanelOpen
    ? closePlannerLabel
    : openPlannerLabel;

  return (
    <Button type="button" onClick={onClick} onKeyDown={onKeyDown}>
      {plannerLabel}
    </Button>
  );
};
