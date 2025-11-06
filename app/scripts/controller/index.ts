// eslint-disable-next-line no-restricted-imports
import Bluebird from 'bluebird';
import _ from 'underscore';

import { isMemberLoggedIn, logoutUser } from '@trello/authentication';
import Backbone from '@trello/backbone';
import { unmountComponentAtNode } from '@trello/component-wrapper';
import { client, clientVersion } from '@trello/config';
import { dynamicConfigClient } from '@trello/dynamic-config';
import type { PremiumFeature } from '@trello/entitlements';
import { ApiError } from '@trello/error-handling';
import { FavIcon } from '@trello/favicon';
import { getFeatureGateAsync } from '@trello/feature-gate-client';
// eslint-disable-next-line no-restricted-imports
import $ from '@trello/jquery';
import { overlayState } from '@trello/nachos/overlay';
// these will be removed in a near future PR, added here to reduce blast radius
import { cachedPersonalWorkspaceIdsState } from '@trello/personal-workspace';
import type { PIIString } from '@trello/privacy';
import {
  convertToPIIString,
  dangerouslyConvertPrivacyString,
} from '@trello/privacy';
import { cacheFactory, QuickLoad } from '@trello/quickload';
import { realtimeUpdaterEvents } from '@trello/realtime-updater';
import { pushRecentBoard, removeRecentBoardById } from '@trello/recent-boards';
import { getLocation } from '@trello/router';
import { navigate } from '@trello/router/navigate';
import { getRouteIdFromPathname, RouteId } from '@trello/router/routes';
import { TrelloStorage, type StorageKey } from '@trello/storage';
import {
  getMemberAccountUrl,
  getMemberActivityUrl,
  getMemberBoardsUrl,
  getMemberCardsUrl,
  getMemberLabsUrl,
  getMemberProfileUrl,
  getOrganizationAccountUrl,
  getOrganizationBillingUrl,
  getOrganizationExportUrl,
  getOrganizationFreeTrialUrl,
  getOrganizationGuestUrl,
  getOrganizationHomeUrl,
  getOrganizationMembersUrl,
  getOrganizationPowerUpsUrl,
  getOrganizationRequestUrl,
  getOrganizationUrl,
  getWorkspaceCustomTableViewUrl,
  getWorkspaceDefaultCustomCalendarViewUrl,
} from '@trello/urls';
import { importWithRetry } from '@trello/use-lazy-component';

import { errorPage } from 'app/scripts/controller/errorPage';
import { Auth } from 'app/scripts/db/Auth';
import { ModelLoader } from 'app/scripts/db/model-loader';
import { Util } from 'app/scripts/lib/util';
import { BOARD_VIEW_BACKGROUND_CLASSES } from 'app/scripts/views/board/boardViewBackgroundClasses';
import { View } from 'app/scripts/views/internal/View';
import { preloadCurrentBoardViewAssets } from 'app/src/components/Board/preloadCurrentBoardViewAssets';
import { boardsMenuState } from 'app/src/components/CreateBoard';
import type { ErrorProps } from 'app/src/components/Error/Error.types';
import { controllerEvents } from './controllerEvents';
import { currentModelManager } from './currentModelManager';
// Require a bunch of random methods that will be used to extend the Controller
// prototype. The long-term vision is to get rid of these methods from the Controller.
import { fatalErrorPage } from './fatalErrorPage';
import {
  isShowingBoardViewSection,
  showingAutomaticReports,
  showingCalendar,
  showingMap,
  showingPupDirectory,
} from './getCurrentBoardView';
import { renderPage } from './renderPage';
import { getOrganizationMemberCardsUrl } from './urls';
import { getViewData } from './userOrOrgProfilePage';

const getHomeLastTabStorageKey = (): StorageKey<'localStorage'> =>
  `home_${Auth.myId()}_last_tab_2`;

const loadHeaderDataAndTriggerWaits = function (
  controller: Controller,
  methodName: string,
  eventName: string,
) {
  const actualLoad = Auth.isLoggedIn()
    ? // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      ModelLoader[methodName]()
    : Bluebird.resolve(null);

  return actualLoad
    .then(function () {
      return ModelLoader.triggerWaits(eventName);
    })
    .catch(ApiError, (error: typeof ApiError) => {
      if (error instanceof ApiError.Unauthenticated) {
        logoutUser();
        return;
      }

      controller.showFatalErrorPage({
        errorType: 'serverError',
        error:
          error ??
          new Error('Unknown error loading header data for application'),
      });
    });
};

interface Controller {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  applicationView: any;

  location: string;

  currentPage: 'search';

  isFirstTimeViewingBoard: boolean;

  unmountReactRoot?: (() => void) | null;
}

class Controller extends Backbone.Router {
  start() {
    controllerEvents.on('clearPreviousView', (options) => {
      this.clearPreviousView(options);
    });
    controllerEvents.on('setViewType', (viewType) => {
      this.setViewType(viewType);
    });
    // Dependency required at call site to avoid import cycles, do not lift to top of module
    const { JoinOnConfirm } = require('app/scripts/lib/join-on-confirm');
    realtimeUpdaterEvents.on(
      'subscription_invalid',
      (function (_this) {
        return function (modelType, idModel) {
          const shouldDisplayError = function () {
            switch (modelType) {
              case 'Board':
                return currentModelManager.onBoardView(idModel);
              case 'Organization':
                return currentModelManager.onOrganizationView(idModel);
              case 'Enterprise':
                return currentModelManager.onEnterpriseView(idModel);
              default:
                return false;
            }
          }.call(_this);
          if (shouldDisplayError) {
            const errorType =
              modelType === 'Board' ? 'boardNotFound' : 'notFound';
            return errorPage({
              errorType,
            });
          }
        };
      })(this),
    );
    loadHeaderDataAndTriggerWaits(this, 'loadHeaderData', 'headerData');
    loadHeaderDataAndTriggerWaits(this, 'loadBoardsData', 'boardsData');
    if (isMemberLoggedIn()) {
      // @ts-expect-error TS(2531): Object is possibly 'null'.
      cacheFactory
        .waitForQueryHydratedTo('MemberHeader', 'ModelCache')
        .then(function () {
          const me = Auth.me();

          const premiumFeaturesSet = new Set<PremiumFeature>();
          const productSet = new Set<number>();

          me.organizationList.forEach((org) => {
            const product = org.getProduct();
            if (product) {
              productSet.add(product);
            }
            org
              .get('premiumFeatures')
              ?.forEach((feature) => premiumFeaturesSet.add(feature));
          });

          const userData = {
            clientVersion,
            emailDomain:
              dangerouslyConvertPrivacyString(me.get('email'))?.split('@')[1] ??
              '',
            hasBC: me.organizationList.some((org) => org.hasPaidProduct()),
            hasMultipleEmails: (me.get('logins') ?? []).length > 1,
            head: client.head,
            idEnterprises:
              me.get('enterprises')?.map((enterprise) => enterprise.id) ?? [],
            idOrgs: me.get('idOrganizations') ?? [],
            isClaimable: me.get('logins')?.some(
              (login) =>
                // @ts-expect-error TS(2339): Property 'claimable' does not exist on type 'Login... Remove this comment to see the full error message
                login.claimable,
            ),
            inEnterprise: (me.get('enterprises') || []).length > 0,
            orgs: ['[Redacted]'],
            // dates should be formatted as UNIX milliseconds
            signupDate: Util.idToDate(me.id).getTime(),
            premiumFeatures: Array.from(premiumFeaturesSet),
            products: Array.from(productSet),
            version: client.version,
          };

          // Update the user data in the dynamic config
          return dynamicConfigClient.refineUserData(userData);
        });
    } else {
      // Have the user object reflect a user that isn't logged in
      const userData = {
        clientVersion,
        emailDomain: '',
        hasBC: false,
        hasMultipleEmails: false,
        head: client.head,
        idEnterprises: [],
        idOrgs: [],
        inEnterprise: false,
        isClaimable: false,
        orgs: [],
        premiumFeatures: [],
        products: [],
        signupDate: undefined,
        version: client.version,
      };

      dynamicConfigClient.refineUserData(userData);
      cacheFactory.markQueryHydratedFor('MemberHeader', 'ModelCache');
      cacheFactory.markQueryHydratedFor('MemberBoards', 'ModelCache');
    }

    return JoinOnConfirm.autoJoin()
      .then(function (didJoin: boolean) {
        if (didJoin) {
          // We can't trust that the stuff that we quickloaded is
          // going to be accurate, or that we'll catch the updates
          // when we subscribe, so just dump it to be safe
          return QuickLoad.clear();
        }
      })
      .return();
  }

  viewType = 'none';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  topLevelView(viewType: any, model: any, options: any = {}) {
    // eslint-disable-next-line eqeqeq
    if (this.applicationView == null) {
      this.applicationView = new View();
    }
    return this.applicationView.subview(viewType, model, options);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  existingTopLevelView(viewType: any, model: any) {
    return this.applicationView.existingSubview(viewType, model);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  existingTopLevelViewOrUndefined(viewType: any, model: any) {
    return this.applicationView?.existingSubviewOrUndefined(viewType, model);
  }

  showingBoardOverlay() {
    return (
      showingPupDirectory() ||
      showingCalendar() ||
      showingMap() ||
      isShowingBoardViewSection('timeline') ||
      isShowingBoardViewSection('calendar-view') ||
      showingAutomaticReports()
    );
  }

  clearPreviousView(options?: { isNextViewReact?: boolean }) {
    // eslint-disable-next-line eqeqeq
    if (options == null) {
      options = {};
    }
    // eslint-disable-next-line eqeqeq
    if (options.isNextViewReact == null) {
      options.isNextViewReact = false;
    }
    const { isNextViewReact } = options;

    // Dependency required at call site to avoid import cycles, do not lift to top of module
    const { PluginModal } = require('app/scripts/views/lib/PluginModal');
    // Dependency required at call site to avoid import cycles, do not lift to top of module
    const { PopOver } = require('app/scripts/views/lib/PopOver');
    // Dependency required at call site to avoid import cycles, do not lift to top of module

    overlayState.setValue({
      overlayType: null,
      context: {},
    });

    const contentNode = document.getElementById('content');

    /**
     * This block manages the unmounting of components, addressing both modern React 18 (using React roots) and older React 17 style components.
     * It attempts to unmount the component using a project-specific `unmountReactRoot` method if available, exclusively for React 18 components.
     * If `unmountReactRoot` is not used or doesn't exist, it falls back to a custom `unmountComponentAtNode` method intended for React 17 components.
     * If the custom `unmountComponentAtNode` fails (returns false), it uses ReactDOM's standard `unmountComponentAtNode` to ensure the component is fully unmounted.
     *
     * Important Note:
     * This unmounting strategy is specifically designed for this project's unique setup and should not be generalized to other projects without careful adaptation.
     * This approach utilizes project-specific implementations and should be phased out as the project transitions fully to React 18, at which point all `ReactDOM.render` usages should be eliminated.
     */
    // Attempt to unmount using the project-specific method for React 18 views
    if (this.unmountReactRoot) {
      this.unmountReactRoot();
      this.unmountReactRoot = null;
    } else if (contentNode) {
      unmountComponentAtNode(contentNode);
    }

    // eslint-disable-next-line eqeqeq
    if (this.applicationView != null) {
      this.applicationView.remove();
    }
    delete this.applicationView;
    PopOver.hide();
    PluginModal.close();
    if (!isNextViewReact) {
      $('#content').html('');
    }
    // @ts-expect-error TS(2345): Argument of type 'string' is not assignable to par... Remove this comment to see the full error message
    $('body').scrollTop('0');
    $('#trello-root')
      .removeClass('body-tabbed-page body-board-view')
      .removeClass(BOARD_VIEW_BACKGROUND_CLASSES)
      .css({
        'background-image': '',
        'background-color': '',
      });
    controllerEvents.trigger('clearAttachmentViewer');
  }

  // Call this *after* loading data, before displaying
  // (So the transition is instant)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setViewType(modelOrString: any) {
    // Dependency required at call site to avoid import cycles, do not lift to top of module
    const { Board } = require('app/scripts/models/Board');
    if (_.isString(modelOrString)) {
      currentModelManager.currentModel.set(null);
    } else {
      currentModelManager.currentModel.set(modelOrString);
    }
    this.currentPage = modelOrString;
    if (currentModelManager.currentModel.get() instanceof Board) {
      const board = currentModelManager.currentModel.get();
      // Setting this property on the controller before the board is marked as viewed below
      this.isFirstTimeViewingBoard = board.get('dateLastView') === null;
      this.waitForId(board, function () {
        // The right thing to do would be to have all this accounting-for-
        // views code observe the current location of the Controller, instead
        // of having the Controller know about that much. A good project
        // for a future refactor.
        // @ts-expect-error
        board.markAsViewed();

        // exclude inbox id into recent board global state
        const inboxIds = cachedPersonalWorkspaceIdsState.value[Auth.me().id];
        if (inboxIds?.idBoard) {
          removeRecentBoardById(inboxIds.idBoard);
          boardsMenuState.setValue({
            ...boardsMenuState.value,
            idRecentBoards: [
              ...boardsMenuState.value.idRecentBoards.filter((idBoard) => {
                return idBoard !== inboxIds?.idBoard;
              }),
            ],
          });
        }

        if (inboxIds?.idBoard === board.id) {
          return;
        }

        pushRecentBoard({ id: board.id, dateLastView: new Date() });
        return boardsMenuState.setValue({
          ...boardsMenuState.value,
          idRecentBoards: [
            board.id,
            ...boardsMenuState.value.idRecentBoards.filter(
              (idBoard) => idBoard !== board.id,
            ),
          ].slice(0, 16),
        });
      });
    } else {
      FavIcon.resetBackground();
    }
  }

  organizationById(idOrganization: string) {
    return ModelLoader.loadOrgNameById(idOrganization)
      .then((name: string) =>
        navigate(getOrganizationUrl(name), {
          trigger: true,
          replace: true,
        }),
      )
      .catch(ApiError, () => errorPage({}));
  }

  quickBoard(search: string) {
    return renderPage(
      importWithRetry(
        () =>
          import(
            /* webpackChunkName: "quick-board" */
            './quickBoard'
          ),
      ).then(({ QuickBoard }) => QuickBoard.quickBoard.call(this, search)),
    );
  }
  powerUpAdmin() {
    return renderPage(
      importWithRetry(
        () =>
          import(
            /* webpackChunkName: "powerup-admin-page" */
            './powerupAdminPage'
          ),
      ).then(({ powerupAdminPage }) => powerupAdminPage()),
    );
  }
  async appsAdmin() {
    if (await getFeatureGateAsync('ecosystem_apps_admin_route')) {
      return renderPage(
        importWithRetry(
          () =>
            import(
              /* webpackChunkName: "powerup-admin-page" */
              './powerupAdminPage'
            ),
        ).then(({ powerupAdminPage }) => powerupAdminPage()),
      );
    }
    errorPage({});
  }
  editPowerUpPage() {
    renderPage(
      importWithRetry(
        () =>
          import(
            /* webpackChunkName: "powerup-edit-powerup-page" */
            './powerupEditPowerUpPage'
          ),
      ).then(({ powerupEditPowerUpPage }) => powerupEditPowerUpPage()),
    );
  }
  async appsAdminEdit() {
    if (await getFeatureGateAsync('ecosystem_apps_admin_route')) {
      return renderPage(
        importWithRetry(
          () =>
            import(
              /* webpackChunkName: "powerup-edit-powerup-page" */
              './powerupEditPowerUpPage'
            ),
        ).then(({ powerupEditPowerUpPage }) => powerupEditPowerUpPage()),
      );
    }

    errorPage({});
  }
  publicDirectory() {
    renderPage(
      importWithRetry(
        () =>
          import(
            /* webpackChunkName: "powerup-public-directory-page" */
            './powerupPublicDirectoryPage'
          ),
      ).then(({ powerupPublicDirectoryPage }) => powerupPublicDirectoryPage()),
    );
  }
  welcomeToTrelloPage() {
    return renderPage(
      importWithRetry(
        () =>
          import(
            /* webpackChunkName: "welcome-to-trello-page" */ './welcomeToTrelloPage'
          ),
      ).then(({ welcomeToTrelloPage }) => {
        return welcomeToTrelloPage();
      }),
    );
  }
  shortcutsPage() {
    return renderPage(
      importWithRetry(
        () =>
          import(/* webpackChunkName: "shortcuts-page" */ './shortcutsPage'),
      ).then(({ shortcutsPage }) => {
        return shortcutsPage.call(this);
      }),
    );
  }
  shortcutsOverlayPage() {
    return renderPage(
      importWithRetry(
        () =>
          import(
            /* webpackChunkName: "shortcuts-overlay-page" */ './shortcutsOverlayPage'
          ),
      ).then(({ shortcutsOverlayPage }) => {
        return shortcutsOverlayPage();
      }),
    );
  }
  blankPage() {
    return renderPage(
      importWithRetry(
        () => import(/* webpackChunkName: "blank-page" */ './blankPage'),
      ).then(({ blankPage }) => {
        return blankPage();
      }),
    );
  }
  getAppPage() {
    // Pure redirect - no rendering needed
    return importWithRetry(
      () =>
        import(
          /* webpackChunkName: "get-app-page" */ 'app/src/pages/getAppPage'
        ),
    ).then(({ getAppPage }) => {
      getAppPage();
    });
  }
  selectOrgToUpgradePage() {
    return renderPage(
      importWithRetry(
        () =>
          import(
            /* webpackChunkName: "select-org-to-upgrade-page" */ './selectOrgToUpgradePage'
          ),
      ).then(({ selectOrgToUpgradePage }) => {
        return selectOrgToUpgradePage();
      }),
    );
  }
  selectTeamToUpgradePage() {
    return renderPage(
      importWithRetry(
        () =>
          import(
            /* webpackChunkName: "select-team-to-upgrade-page" */ './selectTeamToUpgradePage'
          ),
      ).then(({ selectTeamToUpgradePage }) => {
        return selectTeamToUpgradePage();
      }),
    );
  }
  searchPage() {
    return renderPage(
      importWithRetry(
        () => import(/* webpackChunkName: "search-page" */ './searchPage'),
      ).then(({ searchPage }) => {
        return searchPage();
      }),
    );
  }
  openSourceAttributionsPage() {
    return renderPage(
      importWithRetry(
        () =>
          import(
            /* webpackChunkName: "open-source-attributions-page" */ './openSourceAttributionsPage'
          ),
      ).then(({ openSourceAttributionsPage }) => {
        return openSourceAttributionsPage.call(this);
      }),
    );
  }
  async templatesGalleryPublicPage() {
    return renderPage(
      importWithRetry(
        () => import(/* webpackChunkName: "home-page" */ './homePage'),
      ).then(({ homePage }) => {
        return homePage({});
      }),
    );
  }
  inviteAcceptBoardPage() {
    return renderPage(
      importWithRetry(
        () =>
          import(
            /* webpackChunkName: "invite-accept-page" */
            './inviteAcceptPage'
          ),
      ).then(({ InviteAcceptPage }) =>
        InviteAcceptPage.boardInvitationPage.call(this),
      ),
    );
  }
  inviteAcceptTeamPage() {
    return renderPage(
      importWithRetry(
        () =>
          import(
            /* webpackChunkName: "invite-accept-page" */
            './inviteAcceptPage'
          ),
      ).then(({ InviteAcceptPage }) =>
        InviteAcceptPage.teamInvitationPage.call(this),
      ),
    );
  }
  boardPage(
    shortLink?: string,
    path?: string | null,
    referrerUsername?: string | null,
  ) {
    preloadCurrentBoardViewAssets();
    return renderPage(
      importWithRetry(
        () =>
          import(
            /* webpackChunkName: "new-board-page" */
            './newBoardPage'
          ),
      ).then(({ newBoardPage }) => newBoardPage.call(this)),
    );
  }
  workspaceDefaultCustomTableViewPage(orgname: string) {
    return renderPage(
      importWithRetry(
        () =>
          import(
            /* webpackChunkName: "workspace-view-page" */
            './workspaceViewPage'
          ),
      ).then(async ({ workspaceDefaultCustomTableViewPage }) => {
        // update URL to include `/w/` if it matches old pattern
        const { origin, pathname } = getLocation();
        const routeId = getRouteIdFromPathname(pathname);
        if (
          routeId === RouteId.OLD_WORKSPACE_DEFAULT_CUSTOM_TABLE_VIEW &&
          (await getFeatureGateAsync('legacy_url_error_page'))
        ) {
          return this.legacyUrlErrorPage(
            origin + getWorkspaceCustomTableViewUrl(orgname),
          );
        } else if (
          routeId === RouteId.OLD_WORKSPACE_DEFAULT_CUSTOM_TABLE_VIEW
        ) {
          return navigate(getWorkspaceCustomTableViewUrl(orgname), {
            replace: true,
            trigger: true,
          });
        }
        return workspaceDefaultCustomTableViewPage();
      }),
    );
  }
  workspaceDefaultCustomCalendarViewPage(orgname: string) {
    return renderPage(
      importWithRetry(
        () =>
          import(
            /* webpackChunkName: "workspace-view-page" */
            './workspaceViewPage'
          ),
      ).then(async ({ workspaceDefaultCustomCalendarViewPage }) => {
        // update URL to include `/w/` if it matches old pattern
        const { origin, pathname } = getLocation();
        const routeId = getRouteIdFromPathname(pathname);
        if (
          routeId === RouteId.OLD_WORKSPACE_DEFAULT_CUSTOM_CALENDAR_VIEW &&
          (await getFeatureGateAsync('legacy_url_error_page'))
        ) {
          return this.legacyUrlErrorPage(
            origin + getWorkspaceDefaultCustomCalendarViewUrl(orgname),
          );
        } else if (
          routeId === RouteId.OLD_WORKSPACE_DEFAULT_CUSTOM_CALENDAR_VIEW
        ) {
          return navigate(getWorkspaceDefaultCustomCalendarViewUrl(orgname), {
            replace: true,
            trigger: true,
          });
        }
        return workspaceDefaultCustomCalendarViewPage();
      }),
    );
  }
  workspaceViewPage(shortLink: string) {
    return renderPage(
      importWithRetry(
        () =>
          import(
            /* webpackChunkName: "workspace-view-page" */
            './workspaceViewPage'
          ),
      ).then(({ workspaceViewPage }) => workspaceViewPage(shortLink)),
    );
  }
  cardPage(id?: string) {
    preloadCurrentBoardViewAssets();
    return renderPage(
      importWithRetry(
        () =>
          import(
            /* webpackChunkName: "new-board-page" */
            './newBoardPage'
          ),
      ).then(({ newBoardPage }) => newBoardPage.call(this)),
    );
  }
  createFirstBoardPage() {
    if (!isMemberLoggedIn()) {
      return window.location.replace('/login');
    }
    return navigate('/', { trigger: true });
  }
  userOrOrgAccountPage(name: PIIString | string) {
    return renderPage(
      importWithRetry(
        () =>
          import(
            /* webpackChunkName: "user-or-org-account-page" */ './userOrOrgAccountPage'
          ),
      ).then(async ({ userOrOrgAccountPage }) => {
        const { origin, pathname } = getLocation();
        const routeId = getRouteIdFromPathname(pathname);
        if (
          routeId === RouteId.OLD_ACCOUNT &&
          (await getFeatureGateAsync('legacy_url_error_page'))
        ) {
          return (
            getViewData(name)
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              .then((data: any) => {
                switch (data.type) {
                  case 'member':
                    return this.legacyUrlErrorPage(
                      origin + getMemberAccountUrl(name),
                    );
                  case 'organization':
                    return this.legacyUrlErrorPage(
                      origin + getOrganizationAccountUrl(name),
                    );
                  default:
                    return errorPage({});
                }
              })
              .catch(ApiError.NotFound, () => {
                return errorPage({});
              })
          );
        }
        return userOrOrgAccountPage.call(this, name);
      }),
    );
  }
  userOrOrgProfilePage(name: PIIString | string) {
    return renderPage(
      importWithRetry(
        () =>
          import(
            /* webpackChunkName: "user-or-org-profile-page" */ './userOrOrgProfilePage'
          ),
      ).then(async ({ userOrOrgProfilePage }) => {
        const { origin } = getLocation();
        if (await getFeatureGateAsync('legacy_url_error_page')) {
          return (
            getViewData(name)
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              .then((data: any) => {
                switch (data.type) {
                  case 'member':
                    return this.legacyUrlErrorPage(
                      origin + getMemberProfileUrl(name),
                    );
                  case 'organization':
                    return this.legacyUrlErrorPage(
                      origin + getOrganizationUrl(name),
                    );
                  default:
                    return errorPage({});
                }
              })
              .catch(ApiError.NotFound, () => {
                return errorPage({});
              })
          );
        }
        return userOrOrgProfilePage.call(this, name);
      }),
    );
  }
  async enterpriseAdminDashboardView(name: string) {
    return renderPage(
      importWithRetry(
        () =>
          import(
            /* webpackChunkName: "enterprise-dashboard-page" */ './enterpriseDashboard'
          ),
      ).then(({ enterpriseDashboard }) => {
        return enterpriseDashboard.call(this, name);
      }),
    );
  }
  async enterpriseDashTab(name: string, tab: string | null) {
    return renderPage(
      importWithRetry(
        () =>
          import(
            /* webpackChunkName: "enterprise-dashboard-page" */ './enterpriseDashboard'
          ),
      ).then(({ enterpriseDashboard }) => {
        return enterpriseDashboard.call(this, name, tab);
      }),
    );
  }
  async memberHomePage() {
    return renderPage(
      importWithRetry(
        () => import(/* webpackChunkName: "home-page" */ './homePage'),
      ).then(({ homePage }) => {
        return homePage({});
      }),
    );
  }

  async memberHomeBoardsPage(orgname: string) {
    const { origin, pathname } = getLocation();
    const routeId = getRouteIdFromPathname(pathname);
    if (
      routeId === RouteId.OLD_MEMBER_HOME_WORKSPACE_BOARDS &&
      (await getFeatureGateAsync('legacy_url_error_page'))
    ) {
      //:orgname/home
      return this.legacyUrlErrorPage(origin + getOrganizationHomeUrl(orgname));
    }
    return renderPage(
      importWithRetry(
        () => import(/* webpackChunkName: "home-page" */ './homePage'),
      ).then(({ homePage }) => {
        return homePage({ orgname });
      }),
    );
  }
  async memberAllBoardsPage(username: PIIString) {
    // caught by '/u/:username/boards' route
    // but we actually want to show the 'memberHomePage'
    // just without any organisation, to show the SH all boards tab

    // update URL to include `/u/` if it matches old pattern
    const { origin, pathname } = getLocation();
    const routeId = getRouteIdFromPathname(pathname);
    if (
      routeId === RouteId.OLD_MEMBER_ALL_BOARDS &&
      (await getFeatureGateAsync('legacy_url_error_page'))
    ) {
      return this.legacyUrlErrorPage(origin + getMemberBoardsUrl(username));
    } else if (routeId === RouteId.OLD_MEMBER_ALL_BOARDS) {
      return navigate(getMemberBoardsUrl(username), {
        replace: true,
        trigger: true,
      });
    }
    return renderPage(
      importWithRetry(
        () => import(/* webpackChunkName: "home-page" */ './homePage'),
      ).then(({ homePage }) => {
        return homePage({});
      }),
    );
  }
  async memberProfilePage(username: PIIString) {
    const { pathname } = getLocation();
    const routeId = getRouteIdFromPathname(pathname);
    if (routeId === RouteId.MEMBER_LABS) {
      return this.memberLabsPage(username);
    }

    return renderPage(
      importWithRetry(
        () =>
          import(
            /* webpackChunkName: "member-profile-page-controller" */ './memberProfilePageController'
          ),
      ).then(({ memberProfilePageController }) =>
        memberProfilePageController({
          username,
        }),
      ),
    );
  }
  async memberCardsPage(username = convertToPIIString('me'), orgname?: string) {
    //matches routes.oldMemberCards (:username/cards) OR routes.oldMemberCardsForOrg (:username/cards/:orgname)
    const { origin, pathname } = getLocation();
    const routeId = getRouteIdFromPathname(pathname);
    if (
      (routeId === RouteId.OLD_MEMBER_CARDS ||
        routeId === RouteId.OLD_MEMBER_CARDS_FOR_ORG) &&
      (await getFeatureGateAsync('legacy_url_error_page'))
    ) {
      return this.legacyUrlErrorPage(
        origin + getMemberCardsUrl(username, orgname),
      );
    }

    return renderPage(
      importWithRetry(
        () =>
          import(
            /* webpackChunkName: "member-cards-page-controller" */ './memberCardsPageController'
          ),
      ).then(({ memberCardsPageController }) =>
        memberCardsPageController({
          username,
          org: orgname,
        }),
      ),
    );
  }
  async memberAccountPage(username = convertToPIIString('me')) {
    return renderPage(
      importWithRetry(
        () =>
          import(
            /* webpackChunkName: "member-account-page-controller" */ './memberAccountPageController'
          ),
      ).then(({ memberAccountPageController }) =>
        memberAccountPageController({
          username,
        }),
      ),
    );
  }
  async memberActivityPage(username = convertToPIIString('me')) {
    const { origin, pathname } = getLocation();
    const routeId = getRouteIdFromPathname(pathname);
    if (
      routeId === RouteId.OLD_MEMBER_ACTIVITY &&
      (await getFeatureGateAsync('legacy_url_error_page'))
    ) {
      //':username/activity'
      return this.legacyUrlErrorPage(origin + getMemberActivityUrl(username));
    }
    return renderPage(
      importWithRetry(
        () =>
          import(
            /* webpackChunkName: "member-activity-page-controller" */ './memberActivityPageController'
          ),
      ).then(({ memberActivityPageController }) =>
        memberActivityPageController({
          username,
        }),
      ),
    );
  }
  legacyUrlErrorPage(correctUrl: string) {
    return renderPage(
      importWithRetry(
        () =>
          import(
            /* webpackChunkName: "legacy-url-error-page" */ './legacyUrlErrorPage'
          ),
      ).then(({ legacyUrlErrorPage }) => {
        return legacyUrlErrorPage({ correctUrl });
      }),
    );
  }
  async memberInboxPage() {
    const { origin, pathname, search } = getLocation();
    const routeId = getRouteIdFromPathname(pathname);
    if (!isMemberLoggedIn()) {
      window.location.assign(
        `/login?returnUrl=${encodeURIComponent(pathname + search)}`,
      );
      return;
    }
    if (
      routeId === RouteId.OLD_INBOX &&
      (await getFeatureGateAsync('legacy_url_error_page'))
    ) {
      return this.legacyUrlErrorPage(origin + '/my/inbox');
    }
    preloadCurrentBoardViewAssets();
    return renderPage(
      importWithRetry(
        () =>
          import(
            /* webpackChunkName: "inbox-page" */
            './inboxPage'
          ),
      ).then(({ inboxPage }) => inboxPage.call(this)),
    );
  }
  memberTasksPage() {
    TrelloStorage.set(getHomeLastTabStorageKey(), '/'); //#Trick Sticky Tabs into just redirecting us to Home
    return navigate('/', { replace: true, trigger: true });
  }
  memberLabsPage(username: PIIString) {
    return renderPage(
      importWithRetry(
        () =>
          import(/* webpackChunkName: "member-labs-page" */ './memberLabsPage'),
      ).then(async ({ memberLabsPage }) => {
        const { origin, pathname } = getLocation();
        const routeId = getRouteIdFromPathname(pathname);
        if (
          routeId === RouteId.OLD_MEMBER_LABS &&
          (await getFeatureGateAsync('legacy_url_error_page'))
        ) {
          // :username/labs
          return this.legacyUrlErrorPage(origin + getMemberLabsUrl(username));
        }
        return memberLabsPage();
      }),
    );
  }
  async organizationGuestsView(orgname: string) {
    // update URL to include `/w/` if it matches old pattern
    const { origin, pathname } = getLocation();
    const routeId = getRouteIdFromPathname(pathname);
    if (
      routeId === RouteId.OLD_ORGANIZATION_GUESTS &&
      (await getFeatureGateAsync('legacy_url_error_page'))
    ) {
      return this.legacyUrlErrorPage(origin + getOrganizationGuestUrl(orgname));
    } else if (routeId === RouteId.OLD_ORGANIZATION_GUESTS) {
      return navigate(getOrganizationGuestUrl(orgname), {
        replace: true,
        trigger: true,
      });
    }

    return renderPage(
      importWithRetry(
        () =>
          import(
            /* webpackChunkName: "organization-members-page" */ './organizationMembersPage'
          ),
      ).then(({ organizationMembersPage }) =>
        organizationMembersPage({
          orgNameOrId: orgname,
        }),
      ),
    );
  }
  async organizationRequestsView(orgname: string) {
    // update URL to include `/w/` if it matches old pattern
    const { origin, pathname } = getLocation();
    const routeId = getRouteIdFromPathname(pathname);
    if (
      routeId === RouteId.OLD_ORGANIZATION_REQUESTS &&
      (await getFeatureGateAsync('legacy_url_error_page'))
    ) {
      return this.legacyUrlErrorPage(
        origin + getOrganizationRequestUrl(orgname),
      );
    } else if (routeId === RouteId.OLD_ORGANIZATION_REQUESTS) {
      return navigate(getOrganizationRequestUrl(orgname), {
        replace: true,
        trigger: true,
      });
    }

    return renderPage(
      importWithRetry(
        () =>
          import(
            /* webpackChunkName: "organization-members-page" */ './organizationMembersPage'
          ),
      ).then(({ organizationMembersPage }) =>
        organizationMembersPage({
          orgNameOrId: orgname,
        }),
      ),
    );
  }
  async organizationMembersView(name: string) {
    // update URL to include `/w/` if it matches old pattern
    const { origin, pathname } = getLocation();
    const routeId = getRouteIdFromPathname(pathname);
    const orgName = name;
    if (
      routeId === RouteId.OLD_ORGANIZATION_MEMBERS &&
      (await getFeatureGateAsync('legacy_url_error_page'))
    ) {
      return this.legacyUrlErrorPage(
        origin + getOrganizationMembersUrl(orgName),
      );
    } else if (routeId === RouteId.OLD_ORGANIZATION_MEMBERS) {
      return navigate(getOrganizationMembersUrl(orgName), {
        replace: true,
        trigger: true,
      });
    }

    return renderPage(
      importWithRetry(
        () =>
          import(
            /* webpackChunkName: "organization-members-page" */ './organizationMembersPage'
          ),
      ).then(({ organizationMembersPage }) =>
        organizationMembersPage({
          orgNameOrId: orgName,
        }),
      ),
    );
  }
  async organizationMemberCardsView(name: string, username: PIIString) {
    const { origin, pathname } = getLocation();
    const routeId = getRouteIdFromPathname(pathname);
    if (
      routeId === RouteId.ORGANIZATION_MEMBER_CARDS &&
      (await getFeatureGateAsync('legacy_url_error_page'))
    ) {
      return this.legacyUrlErrorPage(
        origin + getOrganizationMemberCardsUrl(name, username),
      );
    }
    // This now lives on the member cards page
    return navigate(getOrganizationMemberCardsUrl(name, username), {
      trigger: true,
    });
  }
  async organizationExportView(orgname: string) {
    // update URL to include `/w/` if it matches old pattern
    const { origin, pathname } = getLocation();
    const routeId = getRouteIdFromPathname(pathname);
    if (
      routeId === RouteId.OLD_ORGANIZATION_EXPORT &&
      (await getFeatureGateAsync('legacy_url_error_page'))
    ) {
      return this.legacyUrlErrorPage(
        origin + getOrganizationExportUrl(orgname),
      );
    } else if (routeId === RouteId.OLD_ORGANIZATION_EXPORT) {
      return navigate(getOrganizationExportUrl(orgname), {
        replace: true,
        trigger: true,
      });
    }

    return renderPage(
      importWithRetry(
        () =>
          import(
            /* webpackChunkName: "organization-export-page" */ './organizationExportPage'
          ),
      ).then(({ organizationExportPage }) =>
        organizationExportPage({ orgNameOrId: orgname }),
      ),
    );
  }
  async organizationPowerUpsPage(orgname: string) {
    // update URL to include `/w/` if it matches old pattern
    const { origin, pathname } = getLocation();
    const routeId = getRouteIdFromPathname(pathname);
    if (
      routeId === RouteId.OLD_ORGANIZATION_POWER_UPS &&
      (await getFeatureGateAsync('legacy_url_error_page'))
    ) {
      return this.legacyUrlErrorPage(
        origin + getOrganizationPowerUpsUrl(orgname),
      );
    } else if (routeId === RouteId.OLD_ORGANIZATION_POWER_UPS) {
      return navigate(getOrganizationPowerUpsUrl(orgname), {
        replace: true,
        trigger: true,
      });
    }

    return renderPage(
      importWithRetry(
        () =>
          import(
            /* webpackChunkName: "organization-powerups-page" */ './organizationPowerUpsPage'
          ),
      ).then(({ organizationPowerUpsPage }) =>
        organizationPowerUpsPage({
          orgNameOrId: orgname,
        }),
      ),
    );
  }
  // Routes to the fullscreen /w/views/table route. We've moved this from
  // /w/:team/tables to /w/:team/views/table.
  // This redirect will append ?populate= unless there are already params in the
  // url
  async organizationTableView(orgname: string) {
    const existingParams =
      window.location.search === '' ? undefined : window.location.search;

    const { origin, pathname } = getLocation();
    const routeId = getRouteIdFromPathname(pathname);
    if (
      routeId === RouteId.OLD_ORGANIZATION_TABLES &&
      (await getFeatureGateAsync('legacy_url_error_page'))
    ) {
      // w/:name/tables(?*query)
      return this.legacyUrlErrorPage(
        origin + getWorkspaceCustomTableViewUrl(orgname, existingParams),
      );
    }

    return navigate(getWorkspaceCustomTableViewUrl(orgname, existingParams), {
      trigger: true,
    });
  }

  async freeTrialView(orgname: string) {
    const { origin, pathname } = getLocation();
    const routeId = getRouteIdFromPathname(pathname);
    if (
      routeId === RouteId.OLD_ORGANIZATION_FREE_TRIAL &&
      (await getFeatureGateAsync('legacy_url_error_page'))
    ) {
      return this.legacyUrlErrorPage(
        origin + getOrganizationFreeTrialUrl(orgname),
      );
    } else if (routeId === RouteId.OLD_ORGANIZATION_FREE_TRIAL) {
      return navigate(getOrganizationFreeTrialUrl(orgname), {
        replace: true,
        trigger: true,
      });
    }

    return renderPage(
      importWithRetry(
        () =>
          import(
            /* webpackChunkName: "organization-boards-page" */ './organizationBoardsPage'
          ),
      ).then(async ({ organizationBoardsPage }) =>
        organizationBoardsPage({ orgNameOrId: orgname }),
      ),
    );
  }
  // methods from organization-routes
  async organizationAccountView(orgname: string) {
    // update URL to include '/w/' if it matches old pattern
    const { pathname } = getLocation();
    const routeId = getRouteIdFromPathname(pathname);
    if (
      routeId === RouteId.OLD_ACCOUNT &&
      (await getFeatureGateAsync('legacy_url_error_page'))
    ) {
      return this.legacyUrlErrorPage(
        origin + getOrganizationAccountUrl(orgname),
      );
    } else if (routeId === RouteId.OLD_ACCOUNT) {
      return navigate(getOrganizationAccountUrl(orgname), {
        replace: true,
        trigger: true,
      });
    }

    return renderPage(
      importWithRetry(
        () =>
          import(
            /* webpackChunkName: "organization-settings-page" */ './organizationSettingsPage'
          ),
      ).then(({ organizationSettingsPage }) =>
        organizationSettingsPage({
          orgNameOrId: orgname,
        }),
      ),
    );
  }
  async organizationBillingView(orgname: string, options = {}) {
    // update URL to include `/w/` if it matches old pattern
    const { pathname, search, origin } = getLocation();
    const routeId = getRouteIdFromPathname(pathname);
    if (routeId === RouteId.BILLING) {
      if (await getFeatureGateAsync('legacy_url_error_page')) {
        return (
          getViewData(orgname)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .then((data: any) => {
              if (data.type === 'organization') {
                return this.legacyUrlErrorPage(
                  origin + getOrganizationBillingUrl(orgname),
                );
              }
              return errorPage({});
            })
            .catch(ApiError.NotFound, () => {
              return errorPage({});
            })
        );
      }
      return navigate(`${getOrganizationBillingUrl(orgname)}${search}`, {
        replace: true,
        trigger: true,
      });
    }

    if (!isMemberLoggedIn()) {
      window.location.assign(
        `/login?returnUrl=${encodeURIComponent(
          window.location.pathname + window.location.search,
        )}`,
      );
      return;
    }

    return renderPage(
      importWithRetry(
        () =>
          import(
            /* webpackChunkName: "organization-billing-page" */ './organizationBillingPage'
          ),
      ).then(({ organizationBillingPage }) =>
        organizationBillingPage({ orgNameOrId: orgname }),
      ),
    );
  }

  async organizationBoardsView(orgname: string) {
    return renderPage(
      importWithRetry(
        () =>
          import(
            /* webpackChunkName: "organization-boards-page" */ './organizationBoardsPage'
          ),
      ).then(({ organizationBoardsPage }) =>
        organizationBoardsPage({ orgNameOrId: orgname }),
      ),
    );
  }

  showFatalErrorPage({
    errorType,
    error,
  }: {
    errorType: 'serverError';
    error: Error;
  }) {
    fatalErrorPage({
      errorType,
      error,
    });
  }
  showErrorPage({ errorType, reason }: ErrorProps) {
    errorPage({
      errorType,
      reason,
    });
  }
  redeemPage() {
    if (!isMemberLoggedIn()) {
      window.location.assign(
        `/login?returnUrl=${encodeURIComponent(
          window.location.pathname + window.location.search,
        )}`,
      );
      return;
    }

    return renderPage(
      importWithRetry(
        () => import(/* webpackChunkName: "redeem-page" */ './redeemPage'),
      ).then(({ redeemPage }) => redeemPage()),
    );
  }
}

const controller = new Controller();

export { controller as Controller };
