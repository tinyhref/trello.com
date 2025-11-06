import type { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';

import * as styles from './MirrorCardNotFound.module.less';

export const MirrorCardNotFound: FunctionComponent = () => {
  return (
    <div
      className={styles.mirrorCardNotFound}
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={0}
    >
      <p>
        <FormattedMessage
          id="templates.mirror_card.card-not-found"
          description="Message for when a card is not found"
          defaultMessage="Card not found. It was probably deleted."
        />
      </p>
    </div>
  );
};
