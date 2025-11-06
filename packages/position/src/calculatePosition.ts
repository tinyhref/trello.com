import { INITIAL_POS, NULL_POS, SPACING } from './position.constants';

/**
 * Calculates a valid position for an item between the provided {previous} and
 * {next} positions. If there is a preferred position for the item to be in, it
 * can be provided in {proposed}, and will be returned if its valid.
 *
 * Any/all of the arguments can be passed {NULL_POS} to signal that no value is
 * provided. For {previous}/{next} this implies that no item is found in that
 * direction. For {proposed} it means that the caller has declined to propose a
 * position.
 *
 * @param previous The position of the previous item or {NULL_POS}
 * @param next The position of the next item or {NULL_POS}
 * @param proposed The position we'd like the item to be in or {NULL_POS}
 * @returns A valid position for an item between previous and next
 */
export const calculatePosition = (
  previous: number,
  next: number,
  proposed: number = NULL_POS,
): number => {
  if (previous === NULL_POS && next === NULL_POS) {
    return INITIAL_POS;
  }
  if (next === NULL_POS) {
    // Ensure that the new pos comes after the prev card pos
    if (proposed !== NULL_POS && proposed > previous) {
      // it's already after so no need to update
      return proposed;
    } else {
      // bump it one past the last item
      return previous + SPACING;
    }
  } else {
    if (proposed !== NULL_POS && proposed > previous && proposed < next) {
      return proposed;
    } else if (previous >= 0) {
      // move linearly if we have room
      if (next - previous >= 2 * SPACING) {
        if (previous > INITIAL_POS) {
          return previous + SPACING;
        } else {
          return next - SPACING;
        }
      }
      // use the midpoint otherwise
      return (next + previous) / 2;
    } else {
      // move linearly if we have room
      if (next >= 2 * SPACING) {
        return next - SPACING;
      }
      // halve the pos of the top item otherwise
      return next / 2;
    }
  }
};
