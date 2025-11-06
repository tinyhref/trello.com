import type { FunctionComponent } from 'react';

import StatusWarningIcon from '@atlaskit/icon/core/status-warning';
import { forTemplate } from '@trello/legacy-i18n';
import { token } from '@trello/theme';

import * as styles from './ChunkLoadErrorMessage.module.less';

const format = forTemplate('error');

export const ChunkLoadErrorMessage: FunctionComponent = () => {
  return (
    <div className={styles.chunkLoadErrorMessage}>
      <div className={styles.row}>
        <StatusWarningIcon
          color={token('color.icon.danger', '#C9372C')}
          label=""
        />
        <div>
          <p>{format('there-was-an-error-loading')}</p>
          <a href={location.href}>{format('refresh-page')}</a>
        </div>
      </div>
    </div>
  );
};
