import { useCallback, useEffect, useRef, useState } from 'react';

import type { FlagId } from '@trello/analytics-types';
import { isMemberLoggedIn } from '@trello/authentication';
import { useFeatureGate } from '@trello/feature-gate-client';
import { intl } from '@trello/i18n';
import { internetConnectionState } from '@trello/internet-connection-state';
import { monitorStatus } from '@trello/monitor';
import { dismissFlag, showFlag } from '@trello/nachos/experimental-flags';
import { CheckCircleIcon } from '@trello/nachos/icons/check-circle';
import { CrossCircleIcon } from '@trello/nachos/icons/cross-circle';
import { WarningIcon } from '@trello/nachos/icons/warning';
import { pollingState as pollingSharedState } from '@trello/realtime-updater';
import { useSharedState } from '@trello/shared-state';
import { token } from '@trello/theme';
import { graphqlWebsocketState, webSocketState } from '@trello/web-sockets';

type ThrottledFlags = Extract<
  FlagId,
  | 'connectionDisconnected'
  | 'connectionForceDisconnected'
  | 'connectionTooFarBehind'
  | 'internetConnectionOffline'
  | 'internetConnectionOnline'
  | 'redboxViaPolling'
  | 'redboxViaSocket'
>;

type FlagArgs = Parameters<typeof showFlag>[0];

// Returns a random integer between min and max (inclusive)
// e.g. randomNumberBetween(1, 10) returns a number from 1 to 10
const randomNumberBetween = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const disconnectedFlag: Omit<FlagArgs, 'id'> = {
  // eslint-disable-next-line formatjs/enforce-description
  title: intl.formatMessage({
    id: 'templates.connectivity_flags.force-disconnected-title',
    defaultMessage: 'You have been disconnected from Trello.',
  }),
  appearance: 'error',
  isUndismissable: true,
  icon: (
    <CrossCircleIcon
      label="Disconnected"
      color={token('color.icon.accent.red', '#C9372C')}
    />
  ),
  actions: [
    {
      // eslint-disable-next-line formatjs/enforce-description
      content: intl.formatMessage({
        id: 'templates.connectivity_flags.reload',
        defaultMessage: 'Reload',
      }),
      type: 'button',
      onClick: () => window.location.reload(),
    },
  ],
};

const FlagIdToArgs: Record<ThrottledFlags, FlagArgs> = {
  internetConnectionOnline: {
    id: 'internetConnectionOnline',
    icon: (
      <CheckCircleIcon
        label="Online"
        color={token('color.icon.accent.green', '#22A06B')}
      />
    ),
    // eslint-disable-next-line formatjs/enforce-description
    title: intl.formatMessage({
      id: 'templates.connectivity_flags.you-are-back-online',
      defaultMessage: "You're back online.",
    }),
    appearance: 'success',
    msTimeout: 3000,
    isAutoDismiss: true,
  },
  internetConnectionOffline: {
    id: 'internetConnectionOffline',
    icon: (
      <WarningIcon
        label="Offline"
        color={token('color.icon.accent.yellow', '#B38600')}
      />
    ),
    // eslint-disable-next-line formatjs/enforce-description
    title: intl.formatMessage({
      id: 'templates.connectivity_flags.you-are-offline',
      defaultMessage: 'You are offline.',
    }),
    // eslint-disable-next-line formatjs/enforce-description
    description: intl.formatMessage({
      id: 'templates.connectivity_flags.failed-to-connect-description',
      defaultMessage: 'Changes made now will not be saved.',
    }),
    appearance: 'warning',
    isUndismissable: true,
  },
  connectionDisconnected: {
    id: 'connectionDisconnected',
    icon: (
      <WarningIcon
        label="Offline"
        color={token('color.icon.accent.yellow', '#B38600')}
      />
    ),
    // eslint-disable-next-line formatjs/enforce-description
    title: intl.formatMessage({
      id: 'templates.connectivity_flags.you-are-disconnected',
      defaultMessage: 'You are disconnected from Trello.',
    }),
    // eslint-disable-next-line formatjs/enforce-description
    description: intl.formatMessage({
      id: 'templates.connectivity_flags.you-are-disconnected-description',
      defaultMessage:
        'You may be slow to receive updates. We are trying to reconnect...',
    }),
    appearance: 'warning',
    isUndismissable: true,
  },
  connectionForceDisconnected: {
    id: 'connectionForceDisconnected',
    ...disconnectedFlag,
  },
  redboxViaSocket: {
    id: 'redboxViaSocket',
    ...disconnectedFlag,
  },
  redboxViaPolling: {
    id: 'redboxViaPolling',
    ...disconnectedFlag,
  },
  connectionTooFarBehind: {
    id: 'connectionTooFarBehind',
    ...disconnectedFlag,
  },
};

export const useConnectivityFlags = () => {
  const [monitorState] = useSharedState(monitorStatus);
  const [connectionState] = useSharedState(webSocketState);
  const [graphqlConnectionState] = useSharedState(graphqlWebsocketState);
  const [pollingState] = useSharedState(pollingSharedState);
  const [internetConnection] = useSharedState(internetConnectionState);
  const hasConnectedRef = useRef(false);
  const hasSeenDisconnectedFlagRef = useRef(false);
  const currentFlagRef = useRef<FlagId>('internetConnectionOnline');
  const flagTimeoutRef = useRef<number | undefined>();
  const [flagIdToShowWhenActive, setFlagIdToShowWhenActive] = useState<
    ThrottledFlags | undefined
  >();

  const { value: showGraphQLConnectivityFlags } = useFeatureGate(
    'goo_graphql_connectivity_flags',
  );

  const dismissCurrentFlag = useCallback(() => {
    if (currentFlagRef.current) {
      dismissFlag({ id: currentFlagRef.current });
    }
  }, []);

  const isOffline = internetConnection === 'unhealthy';

  /**
   * These relate to the legacy realtime updates system of
   * websockets and polling.
   */
  const isLegacyRealtimeUpdatesConnected =
    connectionState === 'connected' || pollingState === 'connected';
  const isSocketConnecting = connectionState === 'connecting';
  const isLegacyRealtimeUpdatesDisconnected =
    connectionState !== 'connected' && pollingState !== 'connected';

  /**
   * These are for the new graphql-ws websocket connection
   * for native graphql subscriptions.
   */
  const isGraphqlSubscriptionsConnected =
    graphqlConnectionState === 'connected';
  const isGraphqlSubscriptionsConnecting =
    graphqlConnectionState === 'connecting';

  /**
   * We only initialize a graphql connection if the user is on a
   * board route, and the socket is automatically closed if we navigate
   * away from that route.  We want to ensure that we don't interpret
   * the graphql connection as disconnected if the user navigates away
   * from the board or has not yet visited a board to initialize the
   * connection.
   */
  const isGraphqlSubscriptionsDisconnected =
    graphqlConnectionState !== 'not_initialized' &&
    graphqlConnectionState !== 'closed' &&
    graphqlConnectionState !== 'connected';

  /**
   * Not the most ideal way to handle this in my opinion, but if the
   * feature gate is enabled then we want to check both the legacy
   * realtime updates and the graphql subscriptions to decide if we should
   * show a flag. Otherwise, we just check the legacy realtime updates.
   */
  const isConnecting = showGraphQLConnectivityFlags
    ? isSocketConnecting || isGraphqlSubscriptionsConnecting
    : isSocketConnecting;

  const isConnected = showGraphQLConnectivityFlags
    ? !isOffline &&
      isLegacyRealtimeUpdatesConnected &&
      isGraphqlSubscriptionsConnected
    : !isOffline && isLegacyRealtimeUpdatesConnected;

  const isDisconnected = showGraphQLConnectivityFlags
    ? isMemberLoggedIn() &&
      (isLegacyRealtimeUpdatesDisconnected ||
        isGraphqlSubscriptionsDisconnected)
    : isMemberLoggedIn() && isLegacyRealtimeUpdatesDisconnected;

  const enqueueFlag = useCallback(
    (nextFlagId: ThrottledFlags, timeout: number) => {
      window.clearTimeout(flagTimeoutRef.current);

      if (nextFlagId === currentFlagRef.current) {
        return;
      }

      flagTimeoutRef.current = window.setTimeout(() => {
        dismissCurrentFlag();
        flagTimeoutRef.current = undefined;
        currentFlagRef.current = nextFlagId;
        setFlagIdToShowWhenActive(nextFlagId);
      }, timeout);
    },
    [dismissCurrentFlag],
  );

  useEffect(() => {
    if (flagIdToShowWhenActive) {
      // if they didn't see the disconnected flag, just don't bother showing the connected flag
      if (
        flagIdToShowWhenActive === 'internetConnectionOnline' &&
        hasSeenDisconnectedFlagRef.current === false
      ) {
        dismissCurrentFlag();
        setFlagIdToShowWhenActive(undefined);
        return;
      }

      if (monitorState === 'active') {
        showFlag(FlagIdToArgs[flagIdToShowWhenActive]);
      }
      setFlagIdToShowWhenActive(undefined);
      hasSeenDisconnectedFlagRef.current = monitorState === 'active';
    }
  }, [
    monitorState,
    setFlagIdToShowWhenActive,
    flagIdToShowWhenActive,
    dismissCurrentFlag,
  ]);

  useEffect(() => {
    if (isConnecting) {
      window.clearTimeout(flagTimeoutRef.current);
      return;
    } else if (isConnected) {
      if (hasConnectedRef.current) {
        enqueueFlag('internetConnectionOnline', 0);
      } else {
        hasConnectedRef.current = true;
      }
    } else if (isOffline) {
      enqueueFlag('internetConnectionOffline', 0);
    } else if (connectionState === 'force_disconnected') {
      enqueueFlag('connectionForceDisconnected', 0);
    } else if (connectionState === 'too_far_behind') {
      enqueueFlag('connectionTooFarBehind', 0);
    } else if (connectionState === 'rate_limited') {
      enqueueFlag('redboxViaSocket', 0);
    } else if (pollingState === 'rate_limited') {
      enqueueFlag('redboxViaPolling', 0);
    } else if (isDisconnected) {
      // add a throttle for disconnection, since there are cases where we can disconnect and reconnect
      // quickly due to user action. For instance, changing board or workspace permissions.
      enqueueFlag('connectionDisconnected', randomNumberBetween(7500, 30000));
    }
  }, [
    connectionState,
    dismissCurrentFlag,
    enqueueFlag,
    internetConnection,
    isConnected,
    isConnecting,
    isDisconnected,
    isOffline,
    pollingState,
  ]);

  return null;
};
