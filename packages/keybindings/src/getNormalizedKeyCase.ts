import { getKey } from './keyboard';
import type { KeyEvent, KeyString } from './types';
import { Key } from './types';

const uppercaseKeyToLowercaseKeyMap = new Map<KeyString, KeyString>([
  [Key.A, Key.a],
  [Key.B, Key.b],
  [Key.C, Key.c],
  [Key.D, Key.d],
  [Key.E, Key.e],
  [Key.F, Key.f],
  [Key.G, Key.g],
  [Key.H, Key.h],
  [Key.I, Key.i],
  [Key.J, Key.j],
  [Key.K, Key.k],
  [Key.L, Key.l],
  [Key.M, Key.m],
  [Key.N, Key.n],
  [Key.O, Key.o],
  [Key.P, Key.p],
  [Key.Q, Key.q],
  [Key.R, Key.r],
  [Key.S, Key.s],
  [Key.T, Key.t],
  [Key.U, Key.u],
  [Key.V, Key.v],
  [Key.W, Key.w],
  [Key.X, Key.x],
  [Key.Y, Key.y],
  [Key.Z, Key.z],
]);

// Invert the uppercase key map:
const lowercaseKeyToUppercaseKeyMap: Map<KeyString, KeyString> = new Map();
uppercaseKeyToLowercaseKeyMap.forEach((value, key) => {
  lowercaseKeyToUppercaseKeyMap.set(value, key);
});

/**
 * A helper function for {@link getKey} that normalizes key enum values to their
 * deterministic case, based on whether the shift key is held. For example, if
 * a user presses the "a" key while caps lock is enabled, `getKey` will return
 * `Key.A`; `getNormalizedKeyCase`, on the other hand, will return `Key.a`.
 * If the user presses the "a" key while holding down the shift key, this method
 * will return `Key.A`, regardless of whether caps locks is enabled.
 *
 * Note: mapping key enum values to one another is meaningful because `getKey`
 * has logic to normalize characters from non-English alphabets into valid enum
 * values; attempting to transform key cases with String prototype methods could
 * break non-English keyboard shortcuts.
 */
export const getNormalizedKeyCase = (e: KeyEvent): KeyString => {
  const key = getKey(e);

  if (e.shiftKey) {
    return lowercaseKeyToUppercaseKeyMap.get(key) || key;
  }

  return uppercaseKeyToLowercaseKeyMap.get(key) || key;
};
