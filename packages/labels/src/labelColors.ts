import { freeze } from '@trello/objects';

export const BASE_LABEL_COLORS = freeze([
  'green',
  'yellow',
  'orange',
  'red',
  'purple',
  'blue',
  'sky',
  'lime',
  'pink',
  'black',
  null,
] as const);

export type BaseLabelColor = (typeof BASE_LABEL_COLORS)[number];

type VariantLabelColor = `${NonNullable<BaseLabelColor>}_${'dark' | 'light'}`;

export type LabelColor = BaseLabelColor | VariantLabelColor;

export const LABEL_COLORS = freeze<LabelColor[]>(
  BASE_LABEL_COLORS.reduce<LabelColor[]>((acc, color) => {
    if (!color) {
      return [...acc, color];
    }
    return [...acc, `${color}_light`, color, `${color}_dark`];
  }, []),
);
