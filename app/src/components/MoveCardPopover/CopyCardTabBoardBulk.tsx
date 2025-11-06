import type { FunctionComponent } from 'react';
import { useEffect, useMemo, useRef } from 'react';
import { FormattedMessage } from 'react-intl';

import type { SourceType } from '@trello/analytics-types';
import { Analytics, formatContainers } from '@trello/atlassian-analytics';
import { useBoardId } from '@trello/id-context';

import { BoardListPositionSelectBulk } from './BoardListPositionSelectBulk';

// eslint-disable-next-line @trello/less-matches-component
import * as styles from './CopyCardTabBoard.module.less';

export interface CopyCardTabBoardBulkProps {
  onClose: () => void;
  source?: SourceType;
}

export const CopyCardTabBoardBulk: FunctionComponent<
  CopyCardTabBoardBulkProps
> = ({ onClose, source }) => {
  const boardId = useBoardId();

  const textareaElement = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (textareaElement.current) {
      const timeoutId = setTimeout(() => textareaElement.current!.focus(), 1);
      textareaElement.current!.select();
      return () => clearTimeout(timeoutId);
    }
  }, []);

  const keepOptions = useMemo(() => {
    return {
      checklists: true,
      labels: true,
      members: true,
      attachments: true,
      comments: true,
      customFields: true,
      stickers: true,
    };
  }, []);

  const copyCardInlineDialog = 'copyCardInlineDialog';
  const copyCardSource = source || copyCardInlineDialog;

  useEffect(() => {
    Analytics.sendScreenEvent({
      name: copyCardInlineDialog,
      containers: formatContainers({ boardId }),
      attributes: {
        isModernizedCopyCardPopover: true,
      },
    });
  }, [boardId]);

  return (
    <div className={styles.popoverSection}>
      <h3 className={styles.header}>
        <FormattedMessage
          id="templates.card_copy.copy-to-ellipsis"
          defaultMessage="Copy to…"
          description="Copy to… header on copy card popover"
        />
      </h3>
      <BoardListPositionSelectBulk
        isCopy={true}
        onClose={onClose}
        source={copyCardSource}
        title={''}
        keepOptions={keepOptions}
        boardId={boardId}
      />
    </div>
  );
};
