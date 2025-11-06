// eslint-disable-next-line no-restricted-imports
import Bluebird from 'bluebird';

import { ApiError, assert } from '@trello/error-handling';
import { convertToPIIString } from '@trello/privacy';
import { TrelloSessionStorage, type StorageKey } from '@trello/storage';
import { isMeAlias } from '@trello/urls';
import { importWithRetry } from '@trello/use-lazy-component';

import { errorPage } from 'app/scripts/controller/errorPage';
import { Auth } from 'app/scripts/db/Auth';
import { ModelCache } from 'app/scripts/db/ModelCache';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getViewData = (name: any) => {
  let value;
  // Dependency required at call site to avoid import cycles, do not lift to top of module
  const { ApiPromise } = require('app/scripts/network/ApiPromise');

  const key: StorageKey<'sessionStorage'> = `typeof_${name}`;

  // Check cache for item
  // eslint-disable-next-line eqeqeq
  if ((value = TrelloSessionStorage.get(key)) != null) {
    return Bluebird.resolve(value);
  } else {
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-shadow */
    return ApiPromise({ url: `/1/types/${name}` }).then((value: any) => {
      TrelloSessionStorage.set(key, value);
      return value;
    });
  }
};

export const userOrOrgPage = function (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  name: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fxUser: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fxOrganization: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options: any,
) {
  // eslint-disable-next-line eqeqeq
  if (options == null) {
    options = {};
  }
  return (
    getViewData(name)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((data: any) => {
        const fn = (() => {
          switch (data.type) {
            case 'member':
              return fxUser;
            case 'organization':
              return fxOrganization;
            default:
          }
        })();

        // eslint-disable-next-line eqeqeq
        assert(fn != null, `/1/types/${name} resolved to ${data.type}`);
        // @ts-expect-error
        return fn.call(this, name, options);
      })
      .catch(ApiError.NotFound, () => {
        return errorPage({});
      })
  );
};

const getMemberActivityPage = function (username = 'me') {
  return importWithRetry(
    () =>
      import(
        /* webpackChunkName: "member-activity-page-controller" */ './memberActivityPageController'
      ),
  ).then(({ memberActivityPageController }) =>
    memberActivityPageController({
      username: convertToPIIString(username),
    }),
  );
};

const getMemberProfilePage = function (username = 'me') {
  return importWithRetry(
    () =>
      import(
        /* webpackChunkName: "member-profile-page-controller" */ './memberProfilePageController'
      ),
  ).then(({ memberProfilePageController }) =>
    memberProfilePageController({
      username: convertToPIIString(username),
    }),
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const userOrOrgProfilePage = function (name: any) {
  // eslint-disable-next-line eqeqeq
  if (name == null) {
    name = 'me';
  }

  if (!Auth.isLoggedIn()) {
    // @ts-expect-error TS(2554): Expected 5 arguments, but got 4.
    userOrOrgPage.call(
      // @ts-expect-error
      this,
      name,
      getMemberActivityPage,
      // @ts-expect-error
      this.organizationBoardsView,
    );
  } else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ModelCache.waitFor('Member', Auth.myId(), (__: any, me: any) => {
      if (me.get('username') === name || isMeAlias(name)) {
        // @ts-expect-error TS(2554): Expected 5 arguments, but got 4.
        userOrOrgPage.call(
          // @ts-expect-error
          this,
          name,
          getMemberProfilePage,
          // @ts-expect-error
          this.organizationBoardsView,
        );
      } else {
        // @ts-expect-error TS(2554): Expected 5 arguments, but got 4.
        userOrOrgPage.call(
          // @ts-expect-error
          this,
          name,
          getMemberActivityPage,
          // @ts-expect-error
          this.organizationBoardsView,
        );
      }
    });
  }
};
