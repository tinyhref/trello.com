import type { LabelColor } from './labelColors';
import { LABEL_COLORS } from './labelColors';

const indexOfLabelColor = (color: string | null) =>
  LABEL_COLORS.indexOf(color as LabelColor);

export const sortLabels = <T extends { name?: string; color?: string | null }>(
  labels: T[] | undefined = [],
): T[] =>
  [...labels].sort(
    (a, b) =>
      indexOfLabelColor(a.color ?? null) - indexOfLabelColor(b.color ?? null) ||
      (a.name ?? '').localeCompare(b.name ?? ''),
  );
