/* eslint-disable
    eqeqeq,
*/

/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS202: Simplify dynamic range loops
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// eslint-disable-next-line no-restricted-imports
import Bluebird from 'bluebird';
import _ from 'underscore';

import { makeErrorEnum } from '@trello/error-handling';

import { currentModelManager } from 'app/scripts/controller/currentModelManager';
import { Auth } from 'app/scripts/db/Auth';
import { ModelCache } from 'app/scripts/db/ModelCache';
import { Board } from 'app/scripts/models/Board';
import { Card } from 'app/scripts/models/Card';
import { List } from 'app/scripts/models/List';
import { Member } from 'app/scripts/models/Member';

// eslint-disable-next-line @trello/enforce-variable-case
const PluginHandlerContextError = makeErrorEnum('PluginHandlerContext', [
  'InvalidType',
  'NotSerializable',
  'PluginDisabled',
]);

const elMap = {};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isCurrentBoard = function (idBoard: any) {
  let board;
  return (
    (board = currentModelManager.getCurrentBoard()) != null &&
    board.id === idBoard
  );
};

const alphabet =
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWYXZ';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const randomId = function (length: any) {
  if (length == null) {
    length = 16;
  }
  const digits = [];
  for (
    let i = 0, end = length, asc = 0 <= end;
    asc ? i < end : i > end;
    asc ? i++ : i--
  ) {
    digits.push(alphabet[Math.floor(Math.random() * alphabet.length)]);
  }
  return digits.join('');
};

// We have to be able to convert a context object into something we can send
// over postMessage; there are a few special keys that contain complex objects
// that we know how to serialize
const converters = {
  card: {
    type: Card,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    serialize(card: any) {
      return { value: card.id };
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    deserialize(idCard: any) {
      const requestedCard = ModelCache.get('Card', idCard);
      if (
        requestedCard != null &&
        isCurrentBoard(requestedCard.get('idBoard'))
      ) {
        return requestedCard;
      } else {
        return null;
      }
    },
  },

  board: {
    type: Board,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    serialize(board: any) {
      return { value: board.id };
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    deserialize(idBoard: any) {
      if (isCurrentBoard(idBoard)) {
        return ModelCache.get('Board', idBoard);
      } else {
        return null;
      }
    },
  },

  list: {
    type: List,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    serialize(list: any) {
      return { value: list.id };
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    deserialize(idList: any) {
      const requestedList = ModelCache.get('List', idList);
      if (
        requestedList != null &&
        isCurrentBoard(requestedList.get('idBoard'))
      ) {
        return requestedList;
      } else {
        return null;
      }
    },
  },

  member: {
    type: Member,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    serialize(member: any) {
      return { value: member.id };
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    deserialize(idMember: any) {
      if (Auth.isMe(idMember)) {
        return ModelCache.get('Member', idMember);
      } else {
        return null;
      }
    },
  },

  el: {
    type: Element,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    serialize(element: any) {
      // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
      const ref = randomId();
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      elMap[ref] = element;

      return {
        value: ref,
        disposer() {
          // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          return delete elMap[ref];
        },
      };
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    deserialize(ref: any) {
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      return elMap[ref];
    },
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isSerializable = function (obj: any) {
  if (
    _.isString(obj) ||
    _.isNumber(obj) ||
    _.isBoolean(obj) ||
    _.isNull(obj) ||
    _.isUndefined(obj)
  ) {
    return true;
  } else if (_.isFunction(obj) || _.isRegExp(obj) || _.isDate(obj)) {
    return false;
  } else if (_.isArray(obj)) {
    return _.every(obj, isSerializable);
  } else if (_.isObject(obj)) {
    return isSerializable(_.values(obj));
  } else {
    return false;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const serialize = function (context: any) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const disposers: any = [];

  return Bluebird.try(() =>
    _.mapObject(context, function (value, key) {
      let converter;
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      if ((converter = converters[key]) != null) {
        if (!(value instanceof converter.type)) {
          if (value == null) {
            return null;
          }

          throw PluginHandlerContextError.InvalidType(
            'value in context did not have the expected type',
          );
        }

        const { value: serialized, disposer } = converter.serialize(value);
        if (disposer != null) {
          disposers.push(disposer);
        }
        return serialized;
      } else if (isSerializable(value)) {
        return value;
      } else {
        throw PluginHandlerContextError.NotSerializable(
          `the value for ${key} was not serializable`,
        );
      }
    }),
  ).disposer(function () {
    for (const disposer of Array.from(disposers)) {
      // @ts-expect-error TS(2571): Object is of type 'unknown'.
      disposer();
    }
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const deserialize = function (serialized: any, idPlugin: any) {
  const deserialized = _.mapObject(serialized, function (value, key) {
    let converter;
    if (
      value != null &&
      Object.prototype.hasOwnProperty.call(converters, key) &&
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      (converter = converters[key]) != null
    ) {
      return converter.deserialize(value);
    } else {
      return value;
    }
  });

  if (
    !(
      deserialized.board || currentModelManager.getCurrentBoard()
    )?.isPluginEnabled(idPlugin) &&
    !currentModelManager.onAnyCardView()
  ) {
    throw PluginHandlerContextError.PluginDisabled(
      `plugin disabled on board idPlugin=${idPlugin}`,
    );
  }

  return deserialized;
};

export { deserialize, PluginHandlerContextError as Error, serialize };
