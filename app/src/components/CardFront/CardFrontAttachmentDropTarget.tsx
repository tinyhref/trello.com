import type { FunctionComponent } from 'react';
import { useCallback, useMemo, useRef } from 'react';

import { intl } from '@trello/i18n';
import { useCardId } from '@trello/id-context';
import { useSharedStateSelector } from '@trello/shared-state';

import { dragFileSharedState } from './dragFileSharedState';
import { useCardDropFiles } from './useCardDropFiles';
import { useCardDropText } from './useCardDropText';

import * as styles from './CardFrontAttachmentDropTarget.module.less';

export const CardFrontAttachmentDropTarget: FunctionComponent = () => {
  const cardId = useCardId();
  const dropTargetRef = useRef<HTMLDivElement>(null);

  const fileState = useSharedStateSelector(
    dragFileSharedState,
    useCallback(
      (value) => {
        return value.cardId === cardId ? value.fileState : null;
      },
      [cardId],
    ),
  );

  const dropTargetMessage = useMemo(() => {
    if (fileState === 'restricted') {
      return intl.formatMessage({
        id: 'templates.clipboard.attachments-restricted',
        defaultMessage: 'Not allowed by your enterprise.',
        description: 'Enterprise restricts attachments error',
      });
    } else if (fileState === 'limited') {
      return intl.formatMessage({
        id: 'templates.clipboard.too-many-attachments',
        defaultMessage: 'Too many attachments.',
        description: 'Too many attachments error',
      });
    }
    return intl.formatMessage({
      id: 'templates.clipboard.drop-files-to-upload',
      defaultMessage: 'Drop files to upload.',
      description: 'Drop files to upload message',
    });
  }, [fileState]);

  useCardDropText({ dropTargetRef });
  useCardDropFiles();

  if (!fileState) {
    return null;
  }

  return (
    <div ref={dropTargetRef} className={styles.hoverFiles}>
      {dropTargetMessage}
    </div>
  );
};
