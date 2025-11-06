import {
  checkThirdParty,
  deleteCookie,
  getCookie,
  initializeControls,
  setCookie,
  setStrictlyNecessaryCookie,
} from '@atlassian/browser-storage-controls';

export type CookieLevel = 'necessary' | 'use_preferences';

// this is the global js-cookie Cookies namespace NOT the class below
type JSCookieAttributes = Cookies.CookieAttributes;

export abstract class Cookies {
  // This function creates an override of document.cookie in order to track adoption of the library, maintain
  // compliance of products, and track third party library usage of cookies.
  static initialize() {
    initializeControls({ product: 'Trello' });
  }

  // Attempts to set a cookie asynchronously using the user's preferences
  // @param level Describes how necessary the cookie is. Only use NECESSARY if the cookie is absolutely required.
  // @returns true if the cookie succeeded in being set based on the user's preferences
  static async set(
    name: string,
    value: string,
    options?: JSCookieAttributes,
    level: CookieLevel = 'use_preferences',
  ) {
    if (level === 'necessary') {
      //Use only with necessary cookies - this function does not check if the cookie is necessary.
      //See https://bitbucket.org/atlassian/atlassian-frontend/src/master/packages/policy-platform/browser-storage-controls/src/controllers/cookie-controls/
      setStrictlyNecessaryCookie(name, value, options);
      return Promise.resolve(true);
    }

    //setCookie differs from setStrictlyNecessaryCookie because it checks for cookie category
    //This queries user preferences before setting the cookie,
    //so it must be used for any cookies which are not strictly necessary.
    return (await setCookie(name, value, options)) === 'SUCCESS';
  }
  //Gets a cookie or all cookies. If no key is provided, returns all cookies.
  static get(name?: string): string | undefined;
  static get(): string | { [name: string]: string };
  static get(name?: string) {
    if (!name) {
      return getCookie();
    }
    return getCookie(name);
  }
  //deletes a cookie based on provided name
  static remove(name: string, options?: JSCookieAttributes) {
    deleteCookie(name, options);
  }
  static async checkThirdParty(
    name: string,
    onAllowed: () => Promise<void>,
    onDenied?: () => Promise<void>,
  ) {
    await checkThirdParty(name, onAllowed, onDenied);
  }
}
