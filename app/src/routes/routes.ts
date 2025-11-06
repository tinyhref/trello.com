import { type RouteObject } from 'react-router';

import { routeDefinitions, RouteId } from '@trello/router/routes';
import { importWithRetry } from '@trello/use-lazy-component';

import { PageError } from 'app/src/components/PageError';
import { TrelloOnline } from 'app/src/components/TrelloOnline';
import { CatchAllMigrationRoute } from './CatchAllMigrationRoute';
import {
  loggedInGuard,
  passiveClientUpdaterMiddleware,
  routerStateMiddleware,
} from './middleware';
import { loadIfGateEnabled } from './migration';

/**
 * Route configurations for React Router
 */
export const routes: RouteObject[] = [
  {
    path: '/',
    Component: TrelloOnline,
    ErrorBoundary: PageError,
    middleware: [passiveClientUpdaterMiddleware, routerStateMiddleware],
    children: [
      // blank
      {
        path: routeDefinitions[RouteId.BLANK].reactPattern,
        Component: () => null,
      },
      // attributions
      {
        path: routeDefinitions[RouteId.OPEN_SOURCE_ATTRIBUTIONS].reactPattern,
        lazy: () =>
          loadIfGateEnabled(RouteId.OPEN_SOURCE_ATTRIBUTIONS, async () => {
            const { Component } = await importWithRetry(
              () =>
                import(
                  /* webpackChunkName: "open-source-attributions-route" */ './AttributionsRoute'
                ),
            );
            return {
              Component,
            };
          }),
      },
      // e/:name/admin/*
      {
        path: routeDefinitions[RouteId.ENTERPRISE_ADMIN].reactPattern,
        middleware: [loggedInGuard],
        lazy: () =>
          loadIfGateEnabled(RouteId.ENTERPRISE_ADMIN, async () => {
            const { Component } = await importWithRetry(
              () =>
                import(
                  /* webpackChunkName: "enterprise-dashboard-route" */ './EnterpriseAdminDashboardRoute'
                ),
            );
            return {
              Component,
            };
          }),
      },
      // u/:username/activity
      {
        path: routeDefinitions[RouteId.MEMBER_ACCOUNT].reactPattern,
        middleware: [
          loggedInGuard,
          // TODO: introduce this separately after the main route gate is rolled out
          // createUsernameAuthGuard({
          //   redirectUrl: (username: string) => `/u/${username}/activity`,
          //   getUsernameFromParams: (params: Params<string>) =>
          //     params.username ?? '',
          // }),
        ],
        lazy: () =>
          loadIfGateEnabled(RouteId.MEMBER_ACCOUNT, async () => {
            const { Component } = await importWithRetry(
              () =>
                import(
                  /* webpackChunkName: "member-account-route" */ './MemberAccountRoute'
                ),
            );
            return {
              Component,
            };
          }),
      },
      // u/:username/ai-settings
      {
        path: routeDefinitions[RouteId.MEMBER_AI_SETTINGS].pattern,
        middleware: [loggedInGuard],
        lazy: async () => {
          const { Component } = await importWithRetry(
            () =>
              import(
                /* webpackChunkName: "member-ai-settings-route" */ './MemberAiSettingsRoute'
              ),
          );
          return {
            Component,
          };
        },
      },
      // me/inbox
      {
        path: routeDefinitions[RouteId.INBOX].reactPattern,
        middleware: [loggedInGuard],
        lazy: () =>
          loadIfGateEnabled(RouteId.INBOX, async () => {
            const { Component, loader } = await importWithRetry(
              () =>
                import(/* webpackChunkName: "inbox-route" */ './InboxRoute'),
            );
            return {
              Component,
              loader,
            };
          }),
      },
      // :username/inbox
      {
        path: routeDefinitions[RouteId.OLD_INBOX].reactPattern,
        middleware: [loggedInGuard],
        lazy: () =>
          loadIfGateEnabled(RouteId.OLD_INBOX, async () => {
            const { createComponent } = await importWithRetry(
              () =>
                import(
                  /* webpackChunkName: "legacy-url-error-route" */ './LegacyUrlErrorRoute'
                ),
            );
            return {
              Component: createComponent('/my/inbox'),
            };
          }),
      },
      {
        path: '/*',
        Component: CatchAllMigrationRoute,
      },
    ],
  },
];
