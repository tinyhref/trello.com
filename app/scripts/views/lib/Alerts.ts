import { dismissFlag, showFlag } from '@trello/nachos/experimental-flags';

import { l } from 'app/scripts/lib/localize';

/**
 * Alerts is our legacy way to show messages to the user.
 * With the Flags system, this is now simply a wrapper around legacy calls,
 * and should likely not be used directly. It is persisted primarily for the
 * `show` method, which references translation keys stored in the Alerts
 * localization namespace, which also should not be used moving forward.
 */
class Alerts {
  /**
   * Massage alerts into Flags. Area is equivalent to `id`, and the presence of
   * an `msTimeout` turns the Flag into an AutoDismiss Flag. displayType is
   * mapped into Flag appearance, with `confirm` value converted to `success`.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _showFlag({ title, displayType, area, msTimeout }: any) {
    let appearance;
    switch (displayType) {
      case 'info':
      case 'warning':
      case 'error':
        appearance = displayType;
        break;
      case 'confirm':
        appearance = 'success';
        break;
      default:
        break; // undefined appearance is valid
    }
    showFlag({
      id: area,
      title,
      appearance,
      isAutoDismiss: !!msTimeout,
      msTimeout,
    });
  }

  /**
   * Maintained solely for alerts with localizations in the Alerts namespace.
   * Use `showFlag` directly instead, with localization result set to `title`.
   * @deprecated
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  show(key: any, displayType: any, area: any, msTimeout?: any) {
    let data;
    if (Array.isArray(key)) {
      [key, data] = Array.from(key);
    } else {
      data = {};
    }
    const title = l(['alerts', key], data);
    this._showFlag({ title, displayType, area, msTimeout });
  }

  /**
   * These are equivalent to `show` calls with msTimeout set to 2000.
   * Use `showFlag` directly with the localization result set to `title` and
   * `msTimeout` set to 2000.
   * @deprecated
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  flash(key: any, displayType: any, area: any) {
    return this.show(key, displayType, area, 2000);
  }

  /**
   * These can be converted directly to `showFlag` invocations.
   * See `packages/nachos/src/experimental/Flags/showFlag`.
   * @deprecated
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  showLiteralText(text: any, displayType: any, area: any, msTimeout?: any) {
    this._showFlag({ title: text, displayType, area, msTimeout });
  }

  /**
   * Use `dismissFlag` directly.
   * @deprecated
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  hide(area: any) {
    dismissFlag({ id: area });
  }
}

/**
 * This package is deprecated; use Flags instead.
 * See `packages/nachos/src/experimental/Flags/showFlag`.
 * @deprecated
 */

const alerts = new Alerts();

/** @deprecated Please do not make new uses of this component.  It's slated for removal */
export { alerts as Alerts };
