import type { CardLabelType } from '@trello/labels';

/**
 * Given a specific label against a set of labels, determine if the label
 * already exists, in which case it's a duplicate, and any mutative operations
 * involving it should probably noop for sanity.
 *
 * For example, if the user tries to create a label and it already exists, noop;
 * if the user saves a label without making any changes, don't send a PUT.
 */
export const findExistingLabel = (
  labels: CardLabelType[],
  label: CardLabelType,
): CardLabelType | undefined =>
  labels.find((l) => label.name === l.name && label.color === l.color);
