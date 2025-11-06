import cx from 'classnames';
import { useContext, type FunctionComponent } from 'react';

import type { IconColor, TextColor } from '@atlaskit/tokens/css-type-schema';
import { useIsTemplateCard } from '@trello/business-logic-react/card';
import { useBoardId, useCardId } from '@trello/id-context';

import { CardDoneState } from 'app/src/components/CardDoneState';
import { useBoardShowCompleteStatusPref } from 'app/src/components/CardDoneState/useBoardShowCompleteStatusPref';
import { useIsCardMarkedComplete } from 'app/src/components/CardDoneState/useIsCardMarkedComplete';
import { CardFrontContext } from './CardFrontContext';
import type { CardFrontNameProps } from './CardFrontName';
import { CardFrontName } from './CardFrontName';

import * as styles from './CardFrontNameWithStatusControl.module.less';

type CardFrontNameWithStatusControlProps = CardFrontNameProps & {
  animateFromExternal?: boolean;
  doneStateContainerClassName?: string;
  doneStateChildrenClassName?: string;
  buttonClassName?: string;
  successIconColor?: Exclude<TextColor, 'transparent'> | IconColor;
  uncheckedIconColor?:
    | Exclude<TextColor, 'transparent'>
    | IconColor
    | 'currentColor';
};

export const CardFrontNameWithStatusControl: FunctionComponent<
  CardFrontNameWithStatusControlProps
> = ({
  animateFromExternal = true,
  doneStateContainerClassName,
  doneStateChildrenClassName,
  buttonClassName,
  successIconColor,
  uncheckedIconColor,
  ...props
}) => {
  const cardId = useCardId();
  const boardId = useBoardId();
  const isTemplateCard = useIsTemplateCard(cardId);
  const isComplete = useIsCardMarkedComplete(cardId);
  const { cardFrontSource } = useContext(CardFrontContext);

  const showCompletedStatusOnCardFront = useBoardShowCompleteStatusPref({
    boardId,
  });
  const isCardDoneStateVisible =
    !isTemplateCard && (showCompletedStatusOnCardFront || isComplete);

  if (!isCardDoneStateVisible) {
    return <CardFrontName {...props} />;
  }

  return (
    <CardDoneState
      animateFromExternal={animateFromExternal}
      buttonClassName={cx(buttonClassName, styles.doneStateButton)}
      cardSource={cardFrontSource}
      containerClassName={doneStateContainerClassName}
      childrenClassName={doneStateChildrenClassName}
      successIconColor={successIconColor}
      uncheckedIconColor={uncheckedIconColor}
      readOnlyContainerClassName={doneStateContainerClassName}
    >
      <CardFrontName
        className={cx(props.className, {
          [styles.cardIsComplete]: isComplete,
        })}
        {...props}
      />
    </CardDoneState>
  );
};
