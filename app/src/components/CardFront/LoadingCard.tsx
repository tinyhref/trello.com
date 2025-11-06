import type { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';

import Spinner from '@atlaskit/spinner';

import { CardFrontName } from './CardFrontName';

import * as styles from './LoadingCard.module.less';

export interface LoadingCardProps {
  name: string;
  url: string;
}

export const LoadingCard: FunctionComponent<LoadingCardProps> = ({
  name,
  url,
}) => {
  return (
    <div className={styles.details}>
      <CardFrontName name={name} url={url} truncate={true} />
      <div className={styles.aiInProgress}>
        <span className={styles.spinner}>
          <Spinner size="small" />
        </span>
        <span className={styles.aiInProgressText}>
          <FormattedMessage
            id="templates.card_front.ai-is-working-on-your-card"
            defaultMessage="AI is working on your card"
            description="Message to inform the user that AI is working on their card"
          />
        </span>
      </div>
    </div>
  );
};
