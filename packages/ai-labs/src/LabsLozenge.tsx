import cx from 'classnames';
import type { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';

import { TrelloIcon } from '@atlaskit/logo';
import { Tooltip } from '@trello/nachos/tooltip';
import type { BadgesTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import * as styles from './LabsLozenge.module.less';

export interface LabsLozengeProps {
  isDisabled?: boolean;
}

export const LabsLozenge: FunctionComponent<LabsLozengeProps> = ({
  isDisabled = false,
}) => {
  return (
    <span className={styles.lozengeWrapper}>
      <Tooltip
        content={
          <FormattedMessage
            id="templates.ai-labs.this-feature-is-still-in-development"
            defaultMessage="This feature is still in development."
            description="Tooltip for labs lozenge"
          />
        }
      >
        <div
          data-testid={getTestId<BadgesTestIds>('labs-lozenge')}
          className={cx({
            [styles.lozenge]: true,
            [styles.isDisabled]: isDisabled,
          })}
        >
          <TrelloIcon size="small" appearance="inverse" />
          <span className={styles.text}>
            <FormattedMessage
              id="templates.ai-labs.labs"
              defaultMessage="Labs"
              description="Labs lozenge text"
            />
          </span>
        </div>
      </Tooltip>
    </span>
  );
};
