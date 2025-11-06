import type { FunctionComponent } from 'react';
import { useEffect } from 'react';

import StatusErrorIcon from '@atlaskit/icon/core/status-error';
import type { SourceType } from '@trello/analytics-types';
import { Analytics, formatContainers } from '@trello/atlassian-analytics';
import { useBoardId, useListId } from '@trello/id-context';
import { token } from '@trello/theme';

import * as styles from './MoveCardPopoverLimitExceededMessage.module.less';

export const MoveCardPopoverLimitExceededMessage: FunctionComponent<{
  cardId?: string;
  errorMessage: string;
  source: SourceType;
}> = ({ cardId, errorMessage, source }) => {
  const boardId = useBoardId();
  const listId = useListId();

  useEffect(() => {
    Analytics.sendViewedComponentEvent({
      componentType: 'section',
      componentName: 'moveCardLimitExceededSection',
      source,
      containers: formatContainers({ boardId, cardId, listId }),
      attributes: {
        limitExceededMessageWarning: errorMessage,
      },
    });
  }, [boardId, cardId, listId, errorMessage, source]);

  return (
    <div className={styles.wrapper}>
      <StatusErrorIcon
        color={token('color.icon.danger', '#C9372C')}
        label={''}
      />
      <span className={styles.message}>{errorMessage}</span>
    </div>
  );
};
