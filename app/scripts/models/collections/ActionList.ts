/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS204: Change includes calls to have a more natural evaluation order
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// eslint-disable-next-line no-restricted-imports
import Bluebird from 'bluebird';
import _ from 'underscore';

import { ApiError } from '@trello/error-handling';

import { ModelLoader } from 'app/scripts/db/model-loader';
import { ModelCache } from 'app/scripts/db/ModelCache';
import { Action } from 'app/scripts/models/Action';
import { CollectionWithHelpers } from './internal/CollectionWithHelpers';

interface ActionList {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options: any;
}

class ActionList extends CollectionWithHelpers<Action> {
  static initClass() {
    this.prototype.model = Action;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialize(list: any, options: any) {
    this.options = options;
  }

  // @ts-expect-error
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  comparator(action: any) {
    return -action.getDate() || 0;
  }

  _getRelatedBoards() {
    let idBoardsRelated = (() => {
      const result = [];
      for (const model of Array.from(this.models)) {
        let needle;
        if (
          ((needle = model.get('type')),
          ['moveCardToBoard', 'moveCardFromBoard'].includes(needle))
        ) {
          const data = model.get('data');
          result.push(
            // @ts-expect-error
            (data.boardTarget != null ? data.boardTarget.id : undefined) ||
              // @ts-expect-error
              (data.boardSource != null ? data.boardSource.id : undefined),
          );
        }
      }
      return result;
    })();

    idBoardsRelated = _.compact(_.uniq(idBoardsRelated));
    idBoardsRelated = _.reject(
      idBoardsRelated,
      (idBoard) => ModelCache.get('Board', idBoard) != null,
    );

    return Bluebird.resolve(idBoardsRelated).map((idBoard) => {
      return ModelLoader.loadBoardName(idBoard).catch(
        ApiError.Unauthorized,
        ApiError.NotFound,
        function () {},
      );
    });
  }
}
ActionList.initClass();

export { ActionList };
