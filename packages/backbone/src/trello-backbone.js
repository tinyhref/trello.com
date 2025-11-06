/* eslint-disable
    eqeqeq,
*/
import _ from 'underscore';

// jquery core is a subset of jquery that skips ui
import $ from '@trello/jquery/core';
import { getCsrfRequestPayload } from '@trello/session-cookie/csrf';

import Backbone from './backbone.js';

// Backbone tries to read jquery off of `this` -- window in a cat world --
// but it's not set to something reasonable mid-require. So let's help it
// out a bit.
Backbone.$ = $;

Backbone.prepareData = function (method, model, options) {
  if (options == null) {
    options = {};
  }
  const tokenData = getCsrfRequestPayload();

  const json = (() => {
    let createJson;
    switch (method) {
      case 'create':
      case 'update':
        createJson =
          options.requestData != null
            ? // You can optionally send something completely different than the
              // model attributes via the requestData option
              _.clone(options.requestData)
            : options.createData != null
              ? // You can add to (or override parts of) the data that we send to
                // the server
                {
                  ...model.toJSON(),
                  ...options.createData,
                }
              : _.clone(model.toJSON());

        // All creates/updates need to include the token as well
        return _.extend(createJson, tokenData);
      case 'delete':
        return tokenData;
      default:
        return {};
    }
  })();

  if (method === 'read') {
    if (_.isArray(options.fields)) {
      json.fields = options.fields.join(',');
    }

    return new URLSearchParams(json).toString();
  } else {
    return JSON.stringify(json);
  }
};

Backbone.syncOriginal = Backbone.sync;

Backbone.sync = function (method, model, options) {
  switch (method) {
    case 'update':
      // We can't trust Backbone to send updates; it wants to send all of the attributes
      // but we just want it to send things that have changed
      return options?.success?.(model, {}, options);

    case 'create':
      // We have a problem where we get into a bad state if the notification of a create
      // arrives before the response to the API call is processed; because the model
      // hasn't been created yet, we don't know that the notification is giving us a
      // duplicate, so we can end up with two copies of the same model
      //
      // We attempt to solve this problem by locking the section of the model cache that
      // corresponds to the type of model that is being created; we won't process any
      // notifications for that type of model until after this API call is completed
      if (!options.wait) {
        // We're not waiting for the server to respond, let's make sure notifications
        // don't get in the way
        const lockIndex = model.modelCache.lock('Backbone.sync create');
        const unlock = _.once(() => model.modelCache.unlock(lockIndex));
        const wrapWithUnlock = (fx) =>
          function () {
            if (typeof fx === 'function') {
              fx(...arguments);
            }
            return unlock();
          };
        // Automatically drop the lock after 10 seconds
        setTimeout(wrapWithUnlock(), 10000);

        options.success = wrapWithUnlock(options.success);
        options.error = wrapWithUnlock(options.error);
      }
      break;

    case 'delete':
      if (/^placeholder/.test(model.id)) {
        return;
      }
      break;
    default:
  }

  return Backbone.syncOriginal(...arguments);
};

export default Backbone;
