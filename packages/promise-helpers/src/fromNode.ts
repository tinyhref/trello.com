// eslint-disable-next-line no-restricted-imports
import Bluebird from 'bluebird';

/**
 * @function fromNode
 * @description Wraps a node-style callback function in a Bluebird promise.
 * @param resolver - The resolver function to use.
 * @returns A promise that resolves to the result of the callback function.
 */
export const fromNode: typeof Bluebird.fromNode = <T>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resolver: (callback: (err: any, result?: T) => void) => void,
) => {
  return new Bluebird<T>((resolve, reject) => {
    resolver((err: Error, result?: T) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};
