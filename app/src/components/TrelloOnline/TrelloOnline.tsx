import 'app/scripts/debug/client-version-header';

import { Suspense, useEffect } from 'react';

import { isMemberLoggedIn, useMemberId } from '@trello/authentication';
import { isEmbeddedInAtlassian, isTouch } from '@trello/browser';
import { useInitializeOneTimeMessagesDismissedState } from '@trello/business-logic-react/member';
import { useIsColorBlind } from '@trello/colorblind-support';
import {
  ChunkLoadErrorBoundary,
  ErrorBoundary,
} from '@trello/error-boundaries';
import { useFeatureGateClientInitializer } from '@trello/feature-gate-client';
import { useInternetConnectionState } from '@trello/internet-connection-state';
// eslint-disable-next-line no-restricted-imports -- supporting legacy code
import $ from '@trello/jquery';
import {
  LayerManagerPortal,
  LayerManagerProvider,
  Layers,
} from '@trello/layer-manager';
import { monitor } from '@trello/monitor';
import { Flags, showFlag } from '@trello/nachos/experimental-flags';
import { PopoverBoundary } from '@trello/nachos/popover-boundary';
import { useRouterStateUpdater } from '@trello/router';
import { useSharedState } from '@trello/shared-state';
import { useGlobalThemeUpdater } from '@trello/theme/initialize-global-theme';
import { LazySwitchThemeShortcutContainer } from '@trello/theme/internal-tools';
import { useLazyComponent } from '@trello/use-lazy-component';
import { userSession } from '@trello/user-session';
import { useWorkspaceStateUpdater } from '@trello/workspaces';

// eslint-disable-next-line no-restricted-imports -- supporting legacy code
import { Controller } from 'app/scripts/controller';
import { ModelCache } from 'app/scripts/db/ModelCache';
import { subscriber } from 'app/scripts/init/subscriber';
// eslint-disable-next-line no-restricted-imports -- supporting legacy code
import { Dates } from 'app/scripts/lib/dates';
import { WindowSize } from 'app/scripts/lib/window-size';
import { classicUpdaterClient } from 'app/scripts/network/classicUpdaterClient';
import { SessionStatus } from 'app/scripts/network/SessionStatus';
import { appRenderState } from 'app/src/appRenderState';
import { LazyAutoOpenCrossFlow } from 'app/src/components/AutoOpenCrossFlow';
import {
  LazyBoardSwitcherDialog,
  useShouldRenderBoardSwitcher,
} from 'app/src/components/BoardSwitcher';
import { useDesktopApp } from 'app/src/components/DesktopApp';
import { DeveloperConsole } from 'app/src/components/DeveloperConsole';
import { EmbeddedBoardFooterContainer } from 'app/src/components/EmbeddedBoardFooter';
import { GlobalErrorHandler } from 'app/src/components/GlobalErrorHandler';
import { Header } from 'app/src/components/Header';
import { HeaderSkeleton } from 'app/src/components/HeaderSkeleton';
import { useShouldShowInternalTools } from 'app/src/components/InternalTools';
import { InviteAcceptance } from 'app/src/components/InviteAcceptance';
import { MigrationRouter } from 'app/src/components/MigrationRouter';
import { VersionUpdater } from 'app/src/components/VersionUpdater';
import {
  LazyWorkspaceNavigation,
  useWorkspaceNavigationHiddenStateUpdater,
  useWorkspaceNavigationStateUpdater,
} from 'app/src/components/WorkspaceNavigation';
import { domReady, initializeLayers } from './doc-init';
import { loadErrorMessagesForApolloClient } from './loadErrorMessagesForApolloClient';
import { Overlays } from './Overlays';
import { Surface } from './Surface';
import { TrelloBoardUpdatedSubscription } from './TrelloBoardUpdatedSubscription';
import { TrelloMemberUpdatedSubscription } from './TrelloMemberUpdatedSubscription';
import { useAnalyticsContext } from './useAnalyticsContext';
import { useAnalyticsIdContext } from './useAnalyticsIdContext';
import { useAnalyticsTenant } from './useAnalyticsTenant';
import { useAnalyticsUIEvent } from './useAnalyticsUIEvent';
import { useAnalyticsUser } from './useAnalyticsUser';
import { useAnimatedLabels } from './useAnimatedLabels';
import { useBrowserFeatures } from './useBrowserFeatures';
import { useConnectivityFlags } from './useConnectivityFlags';
import { useDisconnectAlert } from './useDisconnectAlert';
import { useFeatureGateClientCustomAttributes } from './useFeatureGateClientCustomAttributes';
import { useFirefoxDuplicateDscCookieDetector } from './useFirefoxDuplicateDscCookieDetector';
import { useGoogleTagManager } from './useGoogleTagManager';
import { useGtmSharedState } from './useGtmSharedState';
import { useHelpShortcut } from './useHelpShortcut';
import { useIframeSourcePreservation } from './useIframeSourcePreservation';
import { useInvalidModelHandler } from './useInvalidModelHandler';
import { useMemberLocaleCache } from './useMemberLocaleCache';
import { usePageTracking } from './usePageTracking';
import { usePopoverPositioner } from './usePopoverPositioner';
import { useSocketTracing } from './useSocketTracing';
import { useUpdateNudge } from './useUpdateNudge';
import { useWebVitalsReporter } from './useWebVitalsReporter';
import { useWindowSizeClass } from './useWindowSizeClass';

// eslint-disable-next-line @trello/less-matches-component -- making it very clear that these styles are global
import './TrelloOnline.global.less';

import { forTemplate } from '@trello/legacy-i18n';

import { LazyFloatingInternalToolsButton } from 'app/src/components/InternalTools/LazyFloatingInternalToolsButton';
import { GlobalPopover } from 'app/src/GlobalPopover';
import { TrelloWorkspaceUpdatedSubscription } from './TrelloWorkspaceUpdatedSubscription';
import { useRoutingDiagnostics } from './useRoutingDiagnostics';

import * as styles from './TrelloOnline.module.less';

const format = forTemplate('error');

export const TrelloOnline = () => {
  const [appRenderStatus] = useSharedState(appRenderState);
  useDisconnectAlert();
  usePageTracking();
  useIframeSourcePreservation();
  useWebVitalsReporter();

  const Banners = useLazyComponent(
    () =>
      import(/* webpackChunkName: "messages" */ 'app/src/components/Banners'),
    {
      namedImport: 'Banners',
    },
  );
  const AccessibilityMenuOptions = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "accessibility-menu" */ 'app/src/components/AccessibilityMenu'
      ),
    {
      namedImport: 'AccessibilityMenuOptions',
    },
  );

  const MobileAppDownloadPrompt = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "mobile-app-download-prompt" */ 'app/src/components/MobileAppDownloadPrompt'
      ),
    {
      namedImport: 'MobileAppDownloadPrompt',
    },
  );

  const Heartbeat = useLazyComponent(
    () => import(/* webpackChunkName: "heartbeat" */ '@trello/heartbeat'),
    {
      namedImport: 'Heartbeat',
    },
  );

  // Invalidates client session on 'invalidModel' event from websocket
  useInvalidModelHandler();

  // Keeps the HTML root in sync with the selected global theme.
  useGlobalThemeUpdater();

  // THESE HOOKS ARE MOSTLY GLOBAL BEHAVIOR USING LEGACY JQUERY LOGIC. THEY
  // SHOULD EVENTUALLY MOVE CLOSER TO THEIR RELATED CODE AND BE DONE IN A MORE
  // CONVENTIONAL "REACT" WAY.

  // Wires up the listener for the "?" keyboard shortcut, which is used to
  // access the shortcuts page or dialog.
  useHelpShortcut();

  // Wires up the listener for switching between text and non-text labels on
  // boards (which requires a class on the board for animations and dragging).
  useAnimatedLabels();

  // Wires up a listener for window resize and publishes an event when we switch
  // between small, medium, large, and extra large. This event is observed from
  // the calendar PowerUp.
  useWindowSizeClass();

  // Repositions popovers on window resize.
  usePopoverPositioner();

  // Sends Cloud SLA success events for received socket updates
  useSocketTracing();

  // Keeps location state up to date as user navigates between routes
  useRouterStateUpdater();

  // Logs all navigation/routing requests for Trellists, when modernized routing is enabled for diagnostic purposes
  useRoutingDiagnostics();

  // Shows a flag when the user has not reloaded the client in awhile
  useUpdateNudge();

  // Keeps workspace state up to date as user navigates between routes
  useWorkspaceStateUpdater();

  // Keeps workspace navigation state up to date
  useWorkspaceNavigationStateUpdater();

  // Keeps workspace hidden navigation state up to date
  useWorkspaceNavigationHiddenStateUpdater();

  // Set the global user context for the analytics client
  useAnalyticsUser();

  // Set the global tenant context for the analytics client
  useAnalyticsTenant();

  // Start the UI Viewed event
  useAnalyticsUIEvent();

  // Gets default analytics attributes for the Analytics Client on route changes
  useAnalyticsContext();

  // Gets default analytics id attributes for the Analytics Client on route changes
  useAnalyticsIdContext();

  // Update the local storage cache for the member's locale preference
  useMemberLocaleCache();

  const customAttributes = useFeatureGateClientCustomAttributes();

  // Start the feature gate client
  useFeatureGateClientInitializer(customAttributes);

  // Update the DOM classList for the member's color blind preferences.
  const isColorBlind = useIsColorBlind();
  useEffect(() => {
    const trelloRoot = document.getElementById('trello-root');
    trelloRoot?.classList.toggle('body-color-blind-mode-enabled', isColorBlind);
  }, [isColorBlind]);

  // Will show flags in the UI for connectivity states to server
  useConnectivityFlags();

  // Observes events (like browser online/offline) to help accurately transition between healthy and unhealthy internet
  // connection states. This hook has the side effect of changing the internetConnectionState piece of shared state.
  useInternetConnectionState();

  // initialize shared state for one time messages dismissed
  useInitializeOneTimeMessagesDismissedState();

  // Initialize GPU detection and send analytics event
  useBrowserFeatures();

  useGtmSharedState();
  useGoogleTagManager();

  // Hooks for desktop app are stored here inside the useDesktopApp
  useDesktopApp();

  useEffect(() => {
    domReady();

    initializeLayers();

    const classicBody = $('#trello-root');

    const intervalId = window.setInterval(() => {
      Dates.update(classicBody);
      // @ts-expect-error
      Dates.trigger('renderInterval', Date.now());
    }, 10 * 1000);

    SessionStatus.start();
    monitor.init();
    userSession.init();

    Controller.start();
    WindowSize.ensureRun();

    classicUpdaterClient.subscribe(({ typeName, delta }) => {
      ModelCache.enqueueRealtimeDelta(typeName, delta);
    });

    loadErrorMessagesForApolloClient();

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  // this basically means we've completed the initial pieces of rendering
  // controller item, such as a board. Now, we can move to more expensive stuff
  // in the second phase. Will be fixed with render phases eventually
  const readyToRender = appRenderStatus !== 'paint';

  const shouldShowInternalTools = useShouldShowInternalTools();

  const memberId = useMemberId();
  useEffect(() => {
    if (isMemberLoggedIn()) {
      return subscriber.addSubscription({
        modelType: 'Member',
        idModel: memberId,
        tags: ['updates'],
      });
    }
  }, [memberId]);

  const shouldRenderBoardSwitcher = useShouldRenderBoardSwitcher();

  useFirefoxDuplicateDscCookieDetector();

  return (
    <ErrorBoundary
      errorHandlerComponent={GlobalErrorHandler}
      sendCrashEvent={true}
      tags={{ fromGlobalErrorBoundary: 'true' }}
    >
      <VersionUpdater>
        <LayerManagerProvider>
          <Surface>
            {!readyToRender && !isEmbeddedInAtlassian() && <HeaderSkeleton />}
            {readyToRender && !isEmbeddedInAtlassian() && (
              <ChunkLoadErrorBoundary
                fallback={<HeaderSkeleton />}
                retryAfter={15000}
                onError={() => {
                  // Replaces the flag that previously lived in ChunkLoadErrorBoundary on retry
                  showFlag({
                    appearance: 'error',
                    title: `${format('global-unhandled')} - ${format(
                      'reload-call-to-action',
                    )}`,
                    id: 'chunk-load-error-boundary',
                  });
                }}
              >
                <Header />
              </ChunkLoadErrorBoundary>
            )}
            <PopoverBoundary>
              <div className={styles.navigation}>
                {isMemberLoggedIn() && readyToRender ? (
                  <LazyWorkspaceNavigation />
                ) : null}
                <div id="content-wrapper" className={styles.contentWrapper}>
                  <div>
                    {readyToRender && (
                      <ChunkLoadErrorBoundary fallback={null}>
                        <Suspense fallback={null}>
                          <Banners />
                        </Suspense>
                      </ChunkLoadErrorBoundary>
                    )}
                  </div>
                  <MigrationRouter />
                </div>
              </div>
            </PopoverBoundary>
            {/* The contents of the footer will only be loaded and rendered when on an embedded board */}
            <EmbeddedBoardFooterContainer />
          </Surface>
          {readyToRender && <Overlays />}
          <LayerManagerPortal layer={Layers.Flag}>
            <Flags />
          </LayerManagerPortal>
        </LayerManagerProvider>
        <div className="window-overlay">
          <div className="window" role="dialog" aria-modal>
            <div
              className="window-wrapper js-autofocus"
              tabIndex={-1}
              aria-labelledby="js-dialog-title"
            />
          </div>
        </div>
        <GlobalPopover />
        <div className="pop-over" />
        <div className="tooltip-container" />
        <div id="clipboard-container" aria-hidden />
        {readyToRender && (
          <ChunkLoadErrorBoundary fallback={null}>
            <Suspense fallback={null}>
              <AccessibilityMenuOptions />
            </Suspense>
          </ChunkLoadErrorBoundary>
        )}
        {isTouch() && readyToRender && (
          <ChunkLoadErrorBoundary fallback={null}>
            <Suspense fallback={null}>
              <MobileAppDownloadPrompt />
            </Suspense>
          </ChunkLoadErrorBoundary>
        )}
        {isMemberLoggedIn() && readyToRender && (
          <ErrorBoundary
            tags={{
              ownershipArea: 'trello-web-eng',
              feature: 'Invite Acceptance Notifications',
            }}
          >
            <InviteAcceptance />
          </ErrorBoundary>
        )}
        {isMemberLoggedIn() && readyToRender && (
          <ChunkLoadErrorBoundary fallback={null}>
            <Suspense fallback={null}>
              <Heartbeat />
            </Suspense>
          </ChunkLoadErrorBoundary>
        )}
        {isMemberLoggedIn() && readyToRender && shouldRenderBoardSwitcher && (
          <LazyBoardSwitcherDialog />
        )}
        {isMemberLoggedIn() && (
          <TrelloMemberUpdatedSubscription memberId={memberId} />
        )}
        {shouldShowInternalTools && readyToRender && (
          // Wires up the listener for the "`" and "~" keyboard shortcuts,
          // which are used for cycling the theme override. For internal use only.
          <ChunkLoadErrorBoundary fallback={null}>
            <LazySwitchThemeShortcutContainer />
          </ChunkLoadErrorBoundary>
        )}
        {readyToRender && <LazyAutoOpenCrossFlow />}
        {isMemberLoggedIn() && readyToRender && (
          <>
            <TrelloBoardUpdatedSubscription />
            <TrelloWorkspaceUpdatedSubscription />
          </>
        )}
      </VersionUpdater>
      <LazyFloatingInternalToolsButton />
      <DeveloperConsole />
    </ErrorBoundary>
  );
};
