import cx from 'classnames';
import {
  useCallback,
  useEffect,
  useState,
  type FunctionComponent,
} from 'react';

import { environment } from '@trello/config';
import { useIsActiveRoute } from '@trello/router';
import { RouteId } from '@trello/router/routes';
import {
  LazyRovoChatInterface,
  ROVO_SITE_ID_STORAGE_KEY,
  SitePickerScreen,
  useIsRovoDragAndDropToContextEnabled,
  useIsRovoIslandEnabled,
  usePrefetchRovoChatInterface,
} from '@trello/rovo';
import { useSharedStateSelector } from '@trello/shared-state';
import { TrelloStorage } from '@trello/storage';
import type { WorkspaceNavigationTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { IslandNav } from 'app/src/components/IslandNav';
import { cardDragAndDropState } from 'app/src/components/List/cardDragAndDropState';
import { RovoButton } from 'app/src/components/RovoButton';
import { RovoButtonDropTarget } from 'app/src/components/RovoButton/RovoButtonDropTarget';

import * as styles from './RovoIsland.module.less';

interface ChatInterfaceProps {
  selectedSiteId: string | null;
  toggleChat: () => void;
  workspaceId: string;
  onConfirmSite: (siteId: string | null) => void;
}

const ChatInterface: FunctionComponent<ChatInterfaceProps> = ({
  selectedSiteId,
  toggleChat,
  workspaceId,
  onConfirmSite,
}) => {
  if (selectedSiteId) {
    return (
      <LazyRovoChatInterface
        closeChat={toggleChat}
        selectedSiteId={selectedSiteId}
        workspaceId={workspaceId}
        onConfirmSite={onConfirmSite}
        source="rovoIsland"
      />
    );
  }

  return <SitePickerScreen onConfirmSite={onConfirmSite} />;
};

interface IslandContentProps {
  isChatOpen: boolean;
  selectedSiteId: string | null;
  isCardDragActive: boolean;
  isRovoDragAndDropToContextEnabled: boolean;
  toggleChat: () => void;
  workspaceId: string;
  onConfirmSite: (siteId: string | null) => void;
}

const IslandContent: FunctionComponent<IslandContentProps> = ({
  isChatOpen,
  selectedSiteId,
  isCardDragActive,
  isRovoDragAndDropToContextEnabled,
  toggleChat,
  workspaceId,
  onConfirmSite,
}) => {
  if (isChatOpen) {
    return (
      <div
        className={cx(styles.chatContainer, {
          [styles.chatContainerWithSite]: selectedSiteId,
        })}
      >
        <ChatInterface
          selectedSiteId={selectedSiteId}
          toggleChat={toggleChat}
          workspaceId={workspaceId}
          onConfirmSite={onConfirmSite}
        />
      </div>
    );
  }

  if (isCardDragActive && isRovoDragAndDropToContextEnabled) {
    return <RovoButtonDropTarget />;
  }

  return (
    <RovoButton
      isActive={isChatOpen}
      onClick={toggleChat}
      source="rovoIsland"
    />
  );
};

interface RovoIslandProps {
  workspaceId: string;
}

export const RovoIsland: FunctionComponent<RovoIslandProps> = ({
  workspaceId,
}) => {
  usePrefetchRovoChatInterface();
  const isCardRoute = useIsActiveRoute(RouteId.CARD);
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const isRovoIslandEnabled = useIsRovoIslandEnabled();
  const isRovoDragAndDropToContextEnabled =
    useIsRovoDragAndDropToContextEnabled();
  const isCardDragActive = useSharedStateSelector(
    cardDragAndDropState,
    (state) => state.cardId !== null,
  );

  const isProd = environment === 'prod';

  const toggleChat = useCallback(() => {
    setIsChatOpen((prev) => !prev);
  }, []);

  const onConfirmSite = useCallback((siteId: string | null) => {
    if (!siteId) {
      setIsChatOpen(false);
      return;
    }

    setSelectedSiteId(siteId);
    TrelloStorage.set(ROVO_SITE_ID_STORAGE_KEY, siteId);
  }, []);

  useEffect(() => {
    if (isCardRoute) {
      setIsChatOpen(false);
    }
  }, [isCardRoute]);

  useEffect(() => {
    const savedSiteId = TrelloStorage.get(ROVO_SITE_ID_STORAGE_KEY);

    if (!savedSiteId && isProd) {
      setSelectedSiteId('a436116f-02ce-4520-8fbb-7301462a1674');
    } else if (savedSiteId) {
      setSelectedSiteId(savedSiteId);
    }
  }, [isProd]);

  if (!isRovoIslandEnabled || !workspaceId) {
    return null;
  }

  return (
    <IslandNav
      buttonGroupClassName={styles.buttonGroup}
      className={cx({
        [styles.container]: true,
        [styles.chatOpen]: isChatOpen,
      })}
      data-testid={getTestId<WorkspaceNavigationTestIds>('rovo-island')}
    >
      <IslandContent
        isChatOpen={isChatOpen}
        selectedSiteId={selectedSiteId}
        isCardDragActive={isCardDragActive}
        isRovoDragAndDropToContextEnabled={isRovoDragAndDropToContextEnabled}
        toggleChat={toggleChat}
        workspaceId={workspaceId}
        onConfirmSite={onConfirmSite}
      />
    </IslandNav>
  );
};
