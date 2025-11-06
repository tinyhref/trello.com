/* eslint-disable formatjs/enforce-description */
import type { FunctionComponent } from 'react';
import { useCallback, useEffect, useState } from 'react';

import { Analytics } from '@trello/atlassian-analytics';
import { intl } from '@trello/i18n';
import { Button } from '@trello/nachos/button';

import type { ClosedBoardsViewProps } from './ClosedBoardsView/ClosedBoardsView';
import { ClosedBoardsView } from './ClosedBoardsView/ClosedBoardsView';

import * as styles from './BoardLimitView.module.less';

export type { ClosedBoard } from './ClosedBoardsView/ClosedBoardsView';

interface BoardLimitViewProps {
  /**
   * Controls whether or not to render the view contents.
   * When calling `onClose`, the caller must change this value to `false`.
   */
  isOpen: boolean;
  /**
   * Is called when the modal coordinator is transitioning away from the view.
   */
  onClose?: () => void;
  /**
   * When one of the CTA buttons is clicked, this callback will be invoked
   * with that button's name, and can perform ad-hoc operations.
   */
  onButtonClick?: (name: 'choose-plan' | 'continue-with-free') => void;
}

export const BoardLimitView: FunctionComponent<
  BoardLimitViewProps & ClosedBoardsViewProps
> = ({
  isOpen,
  boards,
  workspaceName,
  onClose = () => {},
  onButtonClick = () => {},
}) => {
  const [hasShown, setHasShown] = useState<boolean>(false);

  useEffect(() => {
    setHasShown(false);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && !hasShown) {
      setHasShown(true);

      Analytics.sendScreenEvent({
        name: 'endOfTrialBoardsCloseModal',
        containers: {},
        attributes: { boardsCount: boards.length },
      });
    }
  }, [isOpen, hasShown, boards.length]);

  const text = {
    continueWithFree: intl.formatMessage({
      id: 'templates.choose_plan.continue-with-free',
      defaultMessage: 'Continue with free',
    }),
    chooseAPlan: intl.formatMessage({
      id: 'templates.choose_plan.choose-a-plan',
      defaultMessage: 'Choose a plan',
    }),
  };

  const hide = useCallback(() => {
    onClose();
  }, [onClose]);

  const onContinueWithFree = useCallback(() => {
    Analytics.sendClickedButtonEvent({
      buttonName: 'continueWithFreeButton',
      source: 'endOfTrialBoardsCloseModal',
    });

    onButtonClick('continue-with-free');

    hide();
  }, [hide, onButtonClick]);

  const onChoosePlan = useCallback(() => {
    Analytics.sendClickedButtonEvent({
      buttonName: 'choosePlanButton',
      source: 'endOfTrialBoardsCloseModal',
    });

    onButtonClick('choose-plan');

    hide();
  }, [hide, onButtonClick]);

  return (
    isOpen && (
      <div className={styles.container}>
        <ClosedBoardsView boards={boards} workspaceName={workspaceName} />
        <div className={styles.buttons}>
          <Button onClick={onContinueWithFree}>{text.continueWithFree}</Button>

          <Button appearance="primary" onClick={onChoosePlan}>
            {text.chooseAPlan}
          </Button>
        </div>
      </div>
    )
  );
};
