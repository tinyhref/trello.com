import type { KeyString } from '@trello/keybindings';
import type { BaseLabelColor } from '@trello/labels';
import { BASE_LABEL_COLORS } from '@trello/labels';

import type { Card } from 'app/scripts/models/Card';

class LabelKeyHelper {
  static keyboardIndex: Array<Exclude<BaseLabelColor, null>>;

  static initClass() {
    const colors = [...BASE_LABEL_COLORS].filter(Boolean);
    // This is pretty silly, but we want the last base color, black, to sit at
    // index 0 of the array. To do that, we need to extract it from its index,
    // and slice the rest of the array in.
    const indexOfZeroKey = colors.length - 1;
    this.keyboardIndex = [
      colors[indexOfZeroKey]!,
      ...(colors.slice(0, indexOfZeroKey) as typeof this.keyboardIndex),
    ];
  }

  static keyNumberForColor(color: Exclude<BaseLabelColor, null>) {
    const ix = this.keyboardIndex.indexOf(color);
    if (ix >= 0) {
      return `${ix}`;
    } else {
      return null;
    }
  }

  static colorForKey(key: KeyString | number) {
    const labelIndex = Number(key);
    return this.keyboardIndex[labelIndex];
  }

  static setLabelFromKey(
    key: KeyString,
    card: Card,
    fxNoUniqueLabel: (color: BaseLabelColor) => void,
  ) {
    const keyColor = this.colorForKey(key);
    const labelsForColors = card.getBoard().labelsForColors();

    const colors = [keyColor, `${keyColor}_light`, `${keyColor}_dark`] as const;
    const matches = colors
      .flatMap((color) => labelsForColors[color])
      .filter(Boolean);

    if (matches.length === 1) {
      card.toggleLabelColor(matches[0]!.get('color'));
    } else {
      fxNoUniqueLabel(keyColor);
    }
  }
}
LabelKeyHelper.initClass();
export { LabelKeyHelper };
