import { Analytics } from '@trello/atlassian-analytics';
import { isDesktop } from '@trello/browser';
import { dontDismissNotifications } from '@trello/config';
import { getDateDeltaString } from '@trello/dates/i18n';
import { forNamespace } from '@trello/legacy-i18n';
import { getScreenFromUrl } from '@trello/marketing-screens';
import { TrelloStorage, type StorageKey } from '@trello/storage';
import type { TrelloWindow } from '@trello/window-types';

import { currentModelManager } from 'app/scripts/controller/currentModelManager';
import { isCustomAction } from 'app/src/components/ActionEntities/customActions';
import { EntityTransformers } from 'app/src/components/ActionEntities/EntityTransformers';
import { formatCustomAction } from 'app/src/components/ActionEntities/formatCustomAction';
import type {
  ActionDisplayType,
  ActionEntitiesObject,
  CommentEntity,
} from 'app/src/components/ActionEntities/types';

declare const window: TrelloWindow;

const formatNotifications = forNamespace('notifications');

const notificationTypeBlockList = [
  'reactionAdded',
  'memberJoinedBoard',
  'memberJoinedWorkspace',
];

export interface Notification {
  id: string;
  display: ActionDisplayType;
  type: string;
  unread: boolean;
  markRead: () => void;
  getUrl: () => string;
  data: {
    board?: {
      id: string;
    };
    organization?: {
      id: string;
    };
  };
  memberCreator?: {
    avatarUrl?: string | null;
  };
}

export class DesktopNotification {
  // Amount of time to wait after writing lock to read it
  LOCK_DELAY = 100;
  // Head start to give 'priority' windows (i.e. ones displaying
  // the board/org the notification is about)
  PRIORITY_DELAY = 1000;
  // Amount of time to wait to clear the lock and notification
  CLEAR_DELAY = 10000;

  // Typescript never thinks the window.Notification is undefined,
  // when in browsers like IE11 this is not true
  static isEnabled() {
    return (
      typeof Notification !== 'undefined' &&
      Notification.permission === 'granted'
    );
  }

  static isDenied() {
    return (
      typeof Notification !== 'undefined' &&
      Notification.permission === 'denied'
    );
  }

  static isUnknown() {
    return (
      typeof Notification !== 'undefined' &&
      Notification.permission === 'default'
    );
  }

  static requestPermission() {
    return new Promise((resolve, reject) => {
      if (typeof Notification === 'undefined') {
        reject('denied');
      }

      Notification.requestPermission().then((permission) => {
        if (permission === 'denied') {
          reject(permission);
        } else {
          resolve(permission);
        }
      });
    });
  }

  // @ts-expect-error
  notification: Notification;
  // @ts-expect-error
  format: ReturnType<typeof forNamespace>;
  constructor(notification: Notification) {
    if (!DesktopNotification.isEnabled() || !notification.unread) {
      return;
    }

    this.notification = notification;
    this.format = isCustomAction({ display: notification.display })
      ? formatCustomAction
      : formatNotifications;

    // If the board is open somewhere in a tab, we want to
    // give that tab first dibs on displaying the notification
    // so that it can load in that tab if clicked.
    if (this.localNotification()) {
      this.show();
    } else {
      setTimeout(() => this.show(), this.PRIORITY_DELAY);
    }
  }

  show() {
    if (notificationTypeBlockList.includes(this.notification.type)) {
      return;
    }

    this.getLock(() => {
      const renderProps = this.render();
      if (!renderProps) {
        return;
      }

      const { title, body, icon, tag } = renderProps;
      let n: globalThis.Notification;

      try {
        // check if Notification supported on Browser
        n = new Notification(title, { body, icon, tag });
      } catch (e) {
        // @ts-expect-error
        if (e.name === 'TypeError') {
          Analytics.sendOperationalEvent({
            action: 'errored',
            actionSubject: 'desktopNotification',
            source: getScreenFromUrl(),
            attributes: {
              message: 'Browser does not support the Notification API',
            },
          });
          return;
        } else {
          // in the case we don't get a TypeError, send to Sentry instead
          throw e;
        }
      }

      // There are Electron apps that run Trello and provide a
      // version of Notifications that don't include
      // addEventListener
      n.addEventListener?.('click', this.clickHandler.bind(this));

      if (!dontDismissNotifications) {
        setTimeout(() => {
          // Users may click "close" on the notification before we hit this timeout
          // which will cause the browser to destruct the Notification instance
          return n?.close?.();
        }, this.CLEAR_DELAY);
      }
    });
  }

  stringifyEntities(entities: ActionEntitiesObject) {
    return Object.keys(entities).reduce(
      (result: { [key: string]: string }, key) => {
        const entity = entities[key];
        let value = '';

        switch (entity.type) {
          case 'relDate':
            value = this.localizeRelativeDate(entity.date);
            break;
          case 'date':
            value = entity.date || '';
            break;
          case 'attachmentPreview':
          case 'comment':
          case 'translatable':
            value = '';
            break;
          default:
            value = entity.text || '';
        }

        result[key] = value;

        return result;
      },
      {},
    );
  }

  localizeRelativeDate(dateString: string) {
    const now = new Date();
    const date = new Date(dateString);
    const period = getDateDeltaString(date, now);
    const relativeDateKey =
      date > now ? 'notification_is_due' : 'notification_was_due';

    return this.format(relativeDateKey, { period });
  }

  render() {
    const { display } = this.notification;

    if (display.translationKey === 'unknown' || !display.entities) {
      return undefined;
    }

    // Fix up entities
    const { entities } =
      new EntityTransformers(display)
        .fixDateIssues()
        .fixTranslatebleLocaleGroup('notifications')
        .addUrlContext()
        .makeEntitiesFriendly()
        .value() ?? {};

    // Get entities that make up title
    const title = this.format(
      display.translationKey,
      this.stringifyEntities(entities || {}),
    );

    // Get the body of notification which will be the comment or blank
    const commentEntity = Object.values(entities || {}).find(
      (entity) => entity.type === 'comment',
    );
    const body = (commentEntity as CommentEntity)?.text || '';

    // Get the icon, if there's a member use that as the icon
    // if not use the favicon.
    const member = this.notification.memberCreator;
    let icon = '/favicon.ico';
    if (member?.avatarUrl) {
      icon = `${member.avatarUrl}/50.png`;
    }

    return { title, body, icon, tag: this.notification.id };
  }

  clickHandler(event: Event) {
    // @ts-expect-error: closes the desktop notification
    (event?.target as Notification)?.close();

    this.notification.markRead();

    const url = this.notification.getUrl();

    const newTab = window.open(url);
    // Electron window.open doesn't return correctly even though window.open
    // succeeds so this keeps us from navigating and opening a new window
    if (!isDesktop()) {
      if (newTab) {
        newTab.focus();
      } else {
        window.location.assign(url);
      }
    }
  }

  localNotification() {
    const { data } = this.notification;

    return [
      currentModelManager.onBoardView(data?.board?.id || ''),
      currentModelManager.onOrganizationView(data?.organization?.id || ''),
    ].some((value) => value);
  }

  getLock(next: () => void) {
    const key: StorageKey<'localStorage'> = `notification_lock_${this.notification.id}`;

    // Check if another tab is displaying this notification.
    if (TrelloStorage.get(key)) {
      return;
    }

    // We may be competing with other tabs for this write, so each tab will
    // attempt to write with a unique key, wait a small delay for contention,
    // and then try to read to see if it obtained the lock or not.
    const uniqueValue = Math.random().toString();
    TrelloStorage.set(key, uniqueValue);

    // Check if we obtained the lock and call the callback only if we did.
    setTimeout(() => {
      if (TrelloStorage.get(key) === uniqueValue) {
        next();
      }
    }, this.LOCK_DELAY);

    // Clean up our key after a small delay.
    setTimeout(() => {
      TrelloStorage.unset(key);
    }, this.CLEAR_DELAY);
  }
}
