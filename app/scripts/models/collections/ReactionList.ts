/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import _ from 'underscore';

import type { ErrorExtensionsType } from '@trello/graphql-error-handling';

import { Auth } from 'app/scripts/db/Auth';
import { ModelLoader } from 'app/scripts/db/model-loader';
import { ModelCache } from 'app/scripts/db/ModelCache';
import { Util } from 'app/scripts/lib/util';
import { Reaction } from 'app/scripts/models/Reaction';
import { CollectionWithHelpers } from './internal/CollectionWithHelpers';

const getIdEmoji = function (reaction: Reaction) {
  const currentEmoji = reaction.get('emoji');
  const currentIdEmoji =
    currentEmoji.unified != null
      ? currentEmoji.unified.toUpperCase()
      : currentEmoji;
  return currentIdEmoji;
};

// @ts-expect-error
interface ReactionList {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _debouncedPersistUpdates: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _pendingReactionUpdates: any;
}

class ReactionList extends CollectionWithHelpers<Reaction> {
  static initClass() {
    this.prototype.model = Reaction;

    this.prototype._debouncedPersistUpdates = _.debounce(function () {
      // @ts-expect-error
      _.each(this._pendingReactionUpdates, ({ updateFn }) => updateFn());
      // @ts-expect-error
      return (this._pendingReactionUpdates = {});
    }, 1000);
  }

  initialize() {
    return (this._pendingReactionUpdates = {});
  }

  // @ts-expect-error
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  comparator(reaction: any) {
    return Util.idToDate(reaction.id);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  findMyReaction(idEmoji: any) {
    return this.find((entry: Reaction) => {
      return (
        // @ts-expect-error
        entry.get('idMember') === Auth.myId() &&
        // @ts-expect-error
        entry.get('idEmoji') === idEmoji
      );
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getAction(idAction: any) {
    return this.modelCache != null
      ? ModelCache.get('Action', idAction)
      : undefined;
  }

  getUniqueCount() {
    return _.uniq(this.models, false, getIdEmoji).length;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isNewPile(reactionList: any, idEmoji: any) {
    // returns true if adding reaction with idEmoji will create a new pile
    return !_.some(
      reactionList.models,
      (reaction) => getIdEmoji(reaction) === idEmoji,
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reload(idAction: any) {
    return ModelLoader.loadReactions(idAction).catch(() => {
      // We may have lost access to see the reactions.
      // Remove all reactions related to this action from the modelcache.
      return (
        this.modelCache
          // @ts-expect-error
          .all('Reaction')
          // @ts-expect-error
          .filter((reaction) => reaction.get('idModel') === idAction)
          .forEach((reaction) => ModelCache.remove(reaction))
      );
    });
  }

  // Track function Returns true or false, for added or removed, respectively.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toggleReaction(idAction: any, emoji: any, trackFn: any) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let existing: any;
    const idEmoji = emoji.unified.toUpperCase();

    if ((existing = this.findMyReaction(idEmoji))) {
      this.remove(existing);
      return this._registerReactionUpdate({
        idReaction: idEmoji,
        updateFn: () => {
          trackFn(false);
          return existing.destroy({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            error: (model: any, { status, responseJSON }: any) => {
              this.trigger('removeReactionError');
              // We've destroyed the model, and we need to reconcile the state
              // try reloading
              return this.reload(idAction);
            },
          });
        },
        model: existing,
      });
    } else {
      const actionModel = this.getAction(idAction);
      const reactionLimits = (
        actionModel != null ? actionModel.get('limits') : undefined
      )?.reactions;
      if (
        (actionModel != null
          ? actionModel.isOverUniqueReactionsCapacity()
          : undefined) &&
        // @ts-expect-error
        this.isNewPile(actionModel.reactionList, idEmoji)
      ) {
        this.trigger(
          'uniqueReactionLimit',
          reactionLimits != null ? reactionLimits.uniquePerAction : undefined,
        );
        return;
      }

      if (
        actionModel != null
          ? actionModel.isOverTotalReactionsCapacity()
          : undefined
      ) {
        this.trigger(
          'totalReactionLimit',
          (reactionLimits != null ? reactionLimits.perAction : undefined) ||
            // @ts-expect-error
            actionModel.reactionList.length,
        );
        return;
      }

      const model =
        (this._pendingReactionUpdates[idEmoji] != null
          ? this._pendingReactionUpdates[idEmoji].model
          : undefined) ||
        new Reaction(
          {
            idModel: idAction,
            // @ts-expect-error
            idMember: Auth.myId(),
            idEmoji,
            // this emoji object is not needed for the server payload
            // but allows us to render the reaction immediately upon adding to the model
            emoji,
          },
          { modelCache: this.modelCache },
        );
      return this._registerReactionUpdate({
        idReaction: idEmoji,
        updateFn: () => {
          trackFn(true);
          return model.save(null, {
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-shadow */
            error: (model: any, { status, responseJSON }: any) => {
              // Because we cache requests it's possible that the client
              // manged to add more reactions than the server allows
              // if we error because of this let's alert the user and remove
              // the reactions that were added
              const message: ErrorExtensionsType =
                responseJSON != null ? responseJSON.error : undefined;
              if (message != null) {
                // It's possible we've not loaded the reactionsLimits, as they
                // are loaded with the action model, which is not loaded when
                // loading reactions via the notifications. Calculate the limit
                // based on what we have locally as a best effort.
                if (message === 'ACTION_TOO_MANY_UNIQUE_REACTIONS') {
                  this.trigger(
                    'uniqueReactionLimit',
                    (reactionLimits != null
                      ? reactionLimits.uniquePerAction
                      : undefined) || { disableAt: this.getUniqueCount() - 1 },
                  );
                } else if (message === 'ACTION_TOO_MANY_TOTAL_REACTIONS') {
                  this.trigger(
                    'totalReactionLimit',
                    (reactionLimits != null
                      ? reactionLimits.perAction
                      : undefined) || { disableAt: this.models.length - 1 },
                  );
                }
              } else {
                this.trigger('addReactionError');
              }
              this.reload(idAction);
              return model.destroy();
            },
          });
        },
        model,
      });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _registerReactionUpdate({ idReaction, updateFn, model }: any) {
    if (this._pendingReactionUpdates[idReaction] != null) {
      // Remove from pending updates, the user has just cancelled that operation
      delete this._pendingReactionUpdates[idReaction];
      model.destroy();
    } else {
      this._pendingReactionUpdates[idReaction] = {
        updateFn,
        model,
      };
    }

    return this._debouncedPersistUpdates();
  }
}
ReactionList.initClass();

export { ReactionList };
