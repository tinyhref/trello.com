import { useState, type FunctionComponent, type ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';

import { Button } from '@trello/nachos/button';

import * as styles from './CopyMoveCardTabs.module.less';

type Tabs = 'board' | 'inbox';

interface CopyMoveCardTabsProps {
  generateInboxTab: () => ReactNode;
  generateBoardTab: () => ReactNode;
}

export const CopyMoveCardTabs: FunctionComponent<CopyMoveCardTabsProps> = ({
  generateInboxTab,
  generateBoardTab,
}) => {
  const [activeTab, setActiveTab] = useState<Tabs>('board');

  return (
    <div>
      <div className={styles.buttons}>
        <Button
          className={styles.button}
          appearance={activeTab === 'inbox' ? 'default' : 'subtle'}
          onClick={() => setActiveTab('inbox')}
        >
          <FormattedMessage
            id="templates.split_screen.inbox"
            defaultMessage="Inbox"
            description="Label for the inbox tab"
          />
        </Button>
        <Button
          className={styles.button}
          appearance={activeTab === 'board' ? 'default' : 'subtle'}
          onClick={() => setActiveTab('board')}
        >
          <FormattedMessage
            id="templates.popover_move_card.board"
            defaultMessage="Board"
            description="Label for the board tab"
          />
        </Button>
      </div>
      {activeTab === 'inbox' ? generateInboxTab() : generateBoardTab()}
    </div>
  );
};
