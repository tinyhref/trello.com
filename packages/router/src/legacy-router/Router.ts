import debounce from 'debounce';

import Backbone from '@trello/backbone';

import { pathnameToRouteContext } from './pathnameToRouteContext';
import type {
  BackboneHistory,
  BackboneHistoryNavigateOptions,
  RouteContext,
} from './Router.types';

export const defaultBackboneHistoryNavigateOptions: BackboneHistoryNavigateOptions =
  {
    trigger: true,
    replace: false,
  };

export interface RouteSubscriber {
  (routeContext: RouteContext): void;
}

export interface RouteSubscriptionRevoker {
  (): void;
}

/**
 * After measuring several calls from rendered Views,
 * 25ms was the shortest amount I found we could afford
 * without potentially impacting UX.
 *
 * With this setting, the listeners are called
 * 3 times at most.
 */
const ROUTE_SUBSCRIBERS_DEBOUNCE_DELAY = 25;

/** @deprecated */
export class Router {
  private history: BackboneHistory;
  private subscriptions = new Set<RouteSubscriber>();
  public updateSubscribers: () => void;

  constructor(
    history: BackboneHistory = Backbone.history,
    debounceSubscribers = true,
  ) {
    this.history = history;

    this.updateSubscribers = debounceSubscribers
      ? debounce(this._updateSubscribers, ROUTE_SUBSCRIBERS_DEBOUNCE_DELAY)
      : this._updateSubscribers;
  }

  private _updateSubscribers = () => {
    const routeContext = this.getRoute();

    this.subscriptions.forEach((subscriber) => subscriber(routeContext));
  };

  // Exposed to aid testing, you probably don't need this :stare:
  get subscriptionsCount() {
    return this.subscriptions.size;
  }

  /**
   * Returns RouteContext for the current route
   *
   * @deprecated Use `useLocation` or `getLocation` instead.
   */
  getRoute(): RouteContext {
    return pathnameToRouteContext(
      `${this.history.location.pathname}${this.history.location.search}`,
    );
  }

  /**
   * Updates the current route
   *
   * @param pathname
   * @param options
   *
   * @deprecated Use `navigate` instead.
   */
  setRoute(
    pathname: string,
    options: BackboneHistoryNavigateOptions = defaultBackboneHistoryNavigateOptions,
  ): void {
    this.history.navigate(pathname, options);
  }

  /**
   * Subscribes to route changes
   *
   * @param subscriber
   *
   * @deprecated Use `useLocation` instead.
   */
  subscribe(subscriber: RouteSubscriber): RouteSubscriptionRevoker {
    this.subscriptions.add(subscriber);

    return () => {
      this.subscriptions.delete(subscriber);
    };
  }
}

/** @deprecated */
export const defaultRouter_DO_NOT_USE = new Router();
