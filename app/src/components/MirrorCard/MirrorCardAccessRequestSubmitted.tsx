import type { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';

import { InformationIcon } from '@trello/nachos/icons/information';
import { token } from '@trello/theme';

import * as styles from './MirrorCardAccessRequestSubmitted.module.less';

export const MirrorCardAccessRequestSubmitted: FunctionComponent = () => {
  return (
    <div
      className={styles.mirrorCardAccessRequestSubmitted}
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={0}
    >
      <InformationIcon color={token('color.icon.subtle', '#626F86')} />
      <p className={styles.content}>
        <FormattedMessage
          id="templates.mirror_card.request-access-submitted-description"
          description="Message for the access request submitted message on a mirror card"
          defaultMessage="Request submitted. You can view this card when someone approves your access to the board."
        />
      </p>
    </div>
  );
};
