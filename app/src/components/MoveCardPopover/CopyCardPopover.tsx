import type { FunctionComponent } from 'react';

import type { SourceType } from '@trello/analytics-types';

import { CopyCardTabBoard } from './CopyCardTabBoard';
import { CopyCardTabBoardBulk } from './CopyCardTabBoardBulk';
import { CopyCardTabInbox } from './CopyCardTabInbox';
import { CopyCardTabInboxBulk } from './CopyCardTabInboxBulk';
import { CopyMoveCardTabs } from './CopyMoveCardTabs';

export interface CopyCardPopoverProps {
  onClose: () => void;
  source?: SourceType;
  isBulk?: boolean;
}

export const CopyCardPopover: FunctionComponent<CopyCardPopoverProps> = ({
  onClose,
  source,
  isBulk = false,
}) => {
  if (isBulk) {
    return (
      <CopyMoveCardTabs
        generateBoardTab={() => (
          <CopyCardTabBoardBulk onClose={onClose} source={source} />
        )}
        generateInboxTab={() => (
          <CopyCardTabInboxBulk onClose={onClose} source={source} />
        )}
      />
    );
  }

  return (
    <CopyMoveCardTabs
      generateBoardTab={() => (
        <CopyCardTabBoard onClose={onClose} source={source} />
      )}
      generateInboxTab={() => (
        <CopyCardTabInbox onClose={onClose} source={source} />
      )}
    />
  );
};
