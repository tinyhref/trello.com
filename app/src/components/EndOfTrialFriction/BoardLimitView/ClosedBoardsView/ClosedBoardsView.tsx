/* eslint-disable formatjs/enforce-description */
import { useCallback, useState, type FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';

import { intl } from '@trello/i18n';
import type { Preview as PreviewType } from '@trello/image-previews';

import { Preview } from 'app/src/components/BillingDetails/BillingCancelAccount/Preview';
import { ClosedBoardRow } from './ClosedBoardRow';

import * as styles from './ClosedBoardsView.module.less';

export interface ClosedBoard {
  id: string;
  name: string;
  backgroundColor?: string;
  scaledBackgroundImages?: PreviewType[];
  dateClosed: string;
}

export interface ClosedBoardsViewProps {
  workspaceName: string;
  boards: ClosedBoard[];
}

interface BoardListProps {
  boards: ClosedBoard[];
}

const BoardList: FunctionComponent<BoardListProps> = ({ boards }) => {
  const boardItems = boards.map((board) => (
    <ClosedBoardRow
      key={board.id}
      scaledBackgroundImages={board.scaledBackgroundImages}
      backgroundColor={board.backgroundColor}
      name={board.name}
      dateClosed={board.dateClosed}
    />
  ));

  return <div className={styles.boardList}>{boardItems}</div>;
};

export const ClosedBoardsView: FunctionComponent<ClosedBoardsViewProps> = ({
  workspaceName,
  boards,
}) => {
  const text = {
    header: intl.formatMessage(
      {
        id: 'closed boards dialog.closed-boards-header',
        defaultMessage: 'Some boards in {workspaceName} have closed',
      },
      {
        workspaceName,
      },
    ),
    summary: intl.formatMessage({
      id: 'closed boards dialog.closed-boards-summary',
      defaultMessage:
        'The Premium free trial for this Workspace has ended and you are now on the free plan. Free Workspaces can only have 10 open boards at a time. Closed boards are not deleted and can be reopened when there is space available. You can also create a new Workspace to move boards into.',
    }),
    closedBoards: intl.formatMessage({
      id: 'closed boards dialog.closed-boards',
      defaultMessage: 'Closed boards',
    }),
    showAll: intl.formatMessage({
      id: 'billing cancel.show all',
      defaultMessage: 'Show all',
    }),
  };

  const [hideFull, setHideFull] = useState<boolean>(boards.length >= 4);
  const handleShow = useCallback(() => {
    setHideFull(false);
  }, []);

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.headerTitle}>{text.header}</h1>
        <div className={styles.subtitle}>
          {text.summary}{' '}
          <a
            href="https://help.trello.com/article/752-changing-the-workspace-to-which-a-board-belongs"
            target="_blank"
            className={styles.learnHow}
          >
            <FormattedMessage
              id="billing cancel.learn-how"
              defaultMessage="Learn how"
            />
          </a>
        </div>
      </div>

      <div className={styles.boardListContainer}>
        <h4
          className={styles.boardListTitle}
        >{`${text.closedBoards} (${boards.length})`}</h4>
        <Preview
          hideFull={hideFull}
          text={text.showAll}
          height={220}
          onShow={handleShow}
        >
          <BoardList boards={boards} />
        </Preview>
      </div>
    </div>
  );
};
