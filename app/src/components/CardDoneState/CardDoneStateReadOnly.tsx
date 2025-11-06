import cx from 'classnames';
import type { FunctionComponent } from 'react';
import { useIntl } from 'react-intl';

import SuccessIcon from '@atlaskit/icon/core/status-success';
import type { CardTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';
import { token } from '@trello/theme';

import type { CardDoneStateProps } from './CardDoneState';

// eslint-disable-next-line @trello/less-matches-component
import * as styles from './CardDoneState.module.less';

interface CardDoneStateReadOnlyProps {
  isComplete?: boolean;
}
export const CardDoneStateReadOnly: FunctionComponent<
  CardDoneStateProps & CardDoneStateReadOnlyProps
> = ({
  children,
  buttonClassName,
  containerClassName,
  readOnlyContainerClassName,
  isComplete,
  isSmall,
  cardSource,
  readOnlyCustomIcon,
}) => {
  const intl = useIntl();
  const isPlannerCard = cardSource === 'Planner';

  return (
    <div
      data-testid={getTestId<CardTestIds>('card-done-state-read-only')}
      className={cx(readOnlyContainerClassName, {
        [styles.cardDoneState]: true,
        [styles.iconContainerSmall]: isSmall,
      })}
    >
      {isComplete && !isPlannerCard && (
        <span
          className={cx(buttonClassName, {
            [styles.checkmarkButton]: true,
          })}
        >
          <SuccessIcon
            label={intl.formatMessage({
              id: 'templates.card-done-state.complete',
              defaultMessage: 'Complete',
              description: 'Label for displaying a card as complete',
            })}
            color={token('color.icon.success', '#4bce97')}
          />
        </span>
      )}

      {(isPlannerCard && readOnlyCustomIcon) ||
        (!isComplete && readOnlyCustomIcon && readOnlyCustomIcon)}

      {children && (
        <span
          className={cx({
            [styles.cardTitle]: true,
            [styles.isComplete]: isComplete,
          })}
        >
          {children}
        </span>
      )}
    </div>
  );
};
