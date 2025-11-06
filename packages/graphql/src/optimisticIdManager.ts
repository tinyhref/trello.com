import { v4 as uuidv4 } from 'uuid';

import { environment } from '@trello/config';
import { Deferred } from '@trello/deferred';

const OPTIMISTIC_ID_PREFIX = 'Optimistic';

type OptimisticId = `${typeof OPTIMISTIC_ID_PREFIX}_${string}_${string}`;

/**
 * When we create a new object with GraphQL, the Apollo cache attempts to assign
 * that object an optimistic ID (specified by the consumer). However, Apollo
 * doesn't offer a built-in way to connect the optimistic ID to the eventually
 * resolved ID, which means that edge cases can sometimes arise when users try
 * to interact with optimistic objects that do not yet have actual IDs.
 *
 * This class acts as a layer to create that functionality, though it's largely
 * manual. The process looks like this:
 * 1. When a new model is created, use {@link generateOptimisticId} for its
 *    optimistic response. This will automatically add a reference to that
 *    optimistic ID in the manager's local cache.
 * 2. When that model is resolved (via the `update` mutation callback), call
 *    {@link resolveId} with its optimistic and resolved IDs.
 * 3. When working with downstream mutations on models that can be created with
 *    optimistic GraphQL operations, await {@link waitForId} to ensure that the
 *    mutations target the resolved model, and not the optimistic one.
 */
class OptimisticIdManager {
  #cache: Record<OptimisticId, Deferred<string>> = {};
  #idToOptimisticId: Record<string, OptimisticId> = {};

  /**
   * Generate a string to be used for an optimistic response for a new model.
   * This makes it easier to determine when a model is optimistic or not.
   */
  generateOptimisticId(__typename: string): OptimisticId {
    const optimisticId =
      `${OPTIMISTIC_ID_PREFIX}_${__typename}_${uuidv4()}` as const;
    this.#cache[optimisticId] = new Deferred<string>();
    return optimisticId;
  }

  resolveId(optimisticId: OptimisticId, resolvedId: string) {
    this.#cache[optimisticId]?.setValue(resolvedId);
    this.#idToOptimisticId[resolvedId] = optimisticId;
    // We should be able to safely delete this key now; anything waiting for it
    // can still resolve independently of this reference:
    delete this.#cache[optimisticId];
  }

  /**
   * Abstraction for working with potentially optimistic data in Apollo cache.
   * This method will determine whether a given ID belongs to an optimistic
   * model, and attempt to return a resolved ID.
   */
  waitForId(optimisticId: string) {
    // If the given ID isn't actually optimistic, resolve it immediately.
    if (!this.isOptimisticId(optimisticId)) {
      return Promise.resolve(optimisticId);
    }
    if (optimisticId in this.#cache) {
      return this.#cache[optimisticId].getValueAsync();
    }
    if (environment !== 'prod') {
      throw new Error(
        'Attempted to wait for an optimistic ID, but it could not be found. Was it added to the OptimisticIdManager?',
      );
    }
    throw new Error(
      'Attempted to wait for an optimistic ID, but it could not be found.',
    );
  }

  /**
   * Evaluates whether an ID was generated via {@link generateOptimisticId}.
   */
  isOptimisticId(id: string): id is OptimisticId {
    return id.startsWith(OPTIMISTIC_ID_PREFIX);
  }

  /**
   * Components in an array, like cards, are rendered with their IDs as `key`s.
   * This can be problematic when those components have interactive optimistic
   * behavior, as re-rendering with a new key wipes out the existing render.
   * For example, if the quick card editor is open on an optimistic card,
   * it will be automatically closed when the card ID is resolved, and the key
   * changes.
   *
   * This method allows us to retain the reference to the optimistic ID for
   * stable re-renders using the same key.
   */
  getStableIdKey(id: string): string {
    return this.#idToOptimisticId[id] || id;
  }

  /**
   * Reset the optimistic ID cache. Useful for limiting the unbounded storage
   * of this model. Call this sparingly, like when unmounting a board view.
   */
  reset() {
    this.#cache = {};
    this.#idToOptimisticId = {};
  }
}

/**
 * See {@link OptimisticIdManager} for annotations.
 */
export const optimisticIdManager = new OptimisticIdManager();
