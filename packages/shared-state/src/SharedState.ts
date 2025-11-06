import { arePartialsEqual, isPlainObject } from '@trello/objects';

export interface Updater<TValue> {
  (value: TValue): TValue;
}

interface Listener<TValue> {
  (value: TValue, previousValue: TValue): void;
}

export interface SharedStateOptions {
  /** @default false */
  onlyUpdateIfChanged?: boolean;
}

function isUpdater<TValue>(value: unknown): value is Updater<TValue> {
  return typeof value === 'function';
}

function isPrimitiveValue(value: unknown) {
  if (value === null) {
    return true;
  }

  if (typeof value === 'object' || typeof value === 'function') {
    return false;
  }

  return true;
}

/**
 * Represents a shared value that can be observed and updated in a shared
 * context. Any value changes will alert the registered listeners.
 *
 * See [TRELLOFE - Sharing state between architectures](https://hello.atlassian.net/wiki/spaces/TRELLOFE/blog/2020/10/06/900192334/Sharing+state+between+architectures)
 *
 * Related: {@link PersistentSharedState}
 */
export class SharedState<TValue> {
  value: TValue;

  #initialValue: TValue;
  #listeners: Set<Listener<TValue>> = new Set();

  constructor(initialValue: TValue) {
    this.value = initialValue;
    this.#initialValue = initialValue;
  }

  /**
   * Resolves the provided value to the generic type {@link TValue}.
   */
  protected computeNextValue(
    nextValue: Partial<TValue> | TValue | Updater<TValue>,
  ): TValue {
    if (isUpdater(nextValue)) {
      return nextValue(this.value) as TValue;
    } else if (isPlainObject(nextValue)) {
      return { ...this.value, ...nextValue };
    } else {
      return nextValue;
    }
  }

  /**
   * Sets a new value and updates all listeners.
   */
  setValue(nextValue: Partial<TValue> | TValue | Updater<TValue>): void {
    const previousValue = this.value;
    this.value = this.computeNextValue(nextValue);

    for (const listener of this.#listeners) {
      listener(this.value, previousValue);
    }
  }

  /**
   * Subscribes the listener for any changes to the value.
   * @param listener
   * @returns a function which can be used to unsubscribe the listener from updates.
   */
  subscribe(
    listener: Listener<TValue>,
    options: SharedStateOptions = {},
  ): () => void {
    const fx: Listener<TValue> = (nextState, previousState) => {
      let shouldUpdate = true;
      if (options.onlyUpdateIfChanged) {
        if (isPrimitiveValue(nextState)) {
          shouldUpdate = nextState !== previousState;
        } else if (isPlainObject(nextState)) {
          shouldUpdate = !arePartialsEqual(nextState, previousState);
        }
      }

      if (shouldUpdate) {
        listener(nextState, previousState);
      }
    };

    this.#listeners.add(fx);

    return () => {
      this.#listeners.delete(fx);
    };
  }

  /**
   * For testing purposes only. DO NOT USE IN APPLICATION CODE.
   * @private
   * */
  reset() {
    this.value = this.#initialValue;
    this.#listeners = new Set();
  }
}
