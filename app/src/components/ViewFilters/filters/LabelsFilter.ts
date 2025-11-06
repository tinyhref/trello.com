import { urlDecode } from '@trello/urls';

import type { Board } from 'app/scripts/models/Board';
import type { LabelColor, LabelName } from 'app/src/components/TableView/types';
import type { FilterableCard } from 'app/src/components/ViewFilters/types';
import { ID_NONE, NO_LABELS } from 'app/src/satisfiesFilter';
import type { CardFilterCriteria } from './ViewFilter';
import { SerializableViewFilter } from './ViewFilter';

const setOrAddToMap = (
  map: Map<LabelColor, Set<LabelName>>,
  color: LabelColor,
  name: LabelName,
) => {
  if (map.has(color)) {
    map.get(color)?.add(name);
  } else {
    map.set(color, new Set([name]));
  }
};

export class LabelsFilter extends SerializableViewFilter {
  public readonly filterType = 'labels' as const;
  public readonly labels: ReadonlyMap<LabelColor, ReadonlySet<LabelName>> =
    new Map<LabelColor, Set<LabelName>>();

  constructor(
    labels: Map<LabelColor, ReadonlySet<LabelName>> = new Map<
      LabelColor,
      Set<LabelName>
    >(),
  ) {
    super();
    this.labels = labels;
  }

  private setEquals = (
    set1: ReadonlySet<string | null | undefined> | undefined,
    set2: ReadonlySet<string | null | undefined> | undefined,
  ): boolean => {
    if (set1 === undefined && set2 === undefined) return true;
    else if (set1 === undefined || set2 === undefined) return false;
    return (
      set1.size === set2.size && [...set1].every((value) => set2.has(value))
    );
  };

  has(color: LabelColor) {
    return this.labels.has(color);
  }

  get(color: LabelColor) {
    return this.labels.get(color);
  }

  keys() {
    return this.labels.keys();
  }

  filterLength() {
    const labels = this.getLabelsForServer();
    return labels?.length ?? 0;
  }

  isEmpty(): boolean {
    return this.filterLength() === 0;
  }

  isEnabled(color: LabelColor, name: LabelName) {
    return this.labels.get(color)?.has(name) ?? false;
  }

  private makeMutableLabelsCopy(): Map<LabelColor, Set<LabelName>> {
    const newLabelsMap = new Map<LabelColor, Set<LabelName>>();
    this.labels.forEach((value, key) => {
      newLabelsMap.set(key, new Set(value));
    });
    return newLabelsMap;
  }

  disable(...labels: [color: LabelColor, name: LabelName][]): LabelsFilter {
    const newLabels = new Map(this.labels);

    labels.forEach((label) => {
      const [color, name] = label;

      const colorSet = new Set(newLabels.get(color));
      if (colorSet?.has(name)) {
        colorSet.delete(name);
        if (colorSet.size === 0) {
          newLabels.delete(color);
        }
      }
      newLabels.set(color, colorSet);
    });
    return new LabelsFilter(newLabels);
  }

  enable(...labels: [color: LabelColor, name: LabelName][]) {
    const newLabels = this.makeMutableLabelsCopy();

    labels.forEach((label) => {
      const [color, name] = label;
      setOrAddToMap(newLabels, color, name);
    });
    return new LabelsFilter(newLabels);
  }

  toggle(...labels: [color: LabelColor, name: LabelName][]) {
    const newLabels = this.makeMutableLabelsCopy();

    const newLabelsRemove = (color: LabelColor, name: LabelName) => {
      if (newLabels.get(color)) {
        newLabels.get(color)?.delete(name);
      }
      if (newLabels.get(color)?.size === 0) {
        newLabels.delete(color);
      }
    };

    const newLabelsAdd = (color: LabelColor, name: LabelName) => {
      if (newLabels.get(color)) {
        newLabels.get(color)?.add(name);
      } else {
        newLabels.set(color, new Set([name]));
      }
    };

    labels.forEach((label) => {
      const [color, name] = label;
      if (newLabels.get(color)?.has(name) ?? false) {
        newLabelsRemove(color, name);
      } else {
        newLabelsAdd(color, name);
      }
    });

    return new LabelsFilter(newLabels);
  }

  equals(otherFilter: LabelsFilter): boolean {
    const colors = new Set(this.labels.keys());

    return (
      this.setEquals(colors, new Set(otherFilter.labels.keys())) &&
      Array.from(colors).every((color) =>
        this.setEquals(this.labels.get(color), otherFilter.labels.get(color)),
      )
    );
  }

  satisfiesLabelsFilter(
    cardLabels: FilterableCard['labels'],
    isAnd?: boolean,
  ): boolean {
    if (this.isEmpty() || !cardLabels) {
      return true;
    }

    const showCardsWithNoLabels = this.isEnabled(NO_LABELS, NO_LABELS);

    if (isAnd) {
      if (showCardsWithNoLabels && this.filterLength() > 1) {
        return false;
      }

      if (showCardsWithNoLabels && cardLabels.length === 0) {
        return true;
      }

      const filterLabelStrings: string[] = [];

      for (const [color, colorMap] of this.labels.entries()) {
        // Duplicates logic from getLabelsForServer()
        // to avoid encoding and decoding for special characters
        // in label names

        if (color === NO_LABELS) {
          filterLabelStrings.push(ID_NONE);
          continue;
        }
        for (const name of colorMap.values()) {
          filterLabelStrings.push(
            name.length ? `${color}:${name}` : `${color}`,
          );
        }
      }

      const cardLabelStrings = cardLabels.map(({ color, name }) =>
        name ? `${color}:${name}` : `${color}`,
      );

      return filterLabelStrings.every((filterLabelString) =>
        cardLabelStrings.includes(filterLabelString),
      );
    } else {
      if (showCardsWithNoLabels && cardLabels.length === 0) {
        return true;
      }

      return cardLabels.some(({ color, name }) => this.isEnabled(color, name));
    }
  }

  getLabelsForServer(): string[] | null {
    const labels: string[] = [];

    for (const [color, colorMap] of this.labels.entries()) {
      if (color === NO_LABELS) {
        labels.push(ID_NONE);
        continue;
      }
      for (const name of colorMap.values()) {
        labels.push(
          name.length
            ? `${color}:${
                // These characters have special meaning when parsing labels
                // so encode the whole name if we see any of them. The server
                // always decodes the name portion, but we avoid an extra
                // level of encoding if we can to keep the URL a little more
                // readable
                /[:,%]/.test(name) ? encodeURIComponent(name) : name
              }`
            : `${color}`,
        );
      }
    }

    if (labels.length === 0) {
      return null;
    }

    return labels;
  }

  toUrlParams(): {
    labels: string | null;
  } {
    const labels = this.getLabelsForServer()?.join(',') ?? null;
    return { labels };
  }

  static fromUrlParams({
    labels: labelsString,
  }: {
    [key: string]: string | null;
  }) {
    const labels = labelsString?.split(',') ?? [];
    const newLabels = new Map<LabelColor, Set<LabelName>>();
    for (const label of labels) {
      this.addLabelToMap(newLabels, label);
    }
    return new LabelsFilter(newLabels);
  }

  private static addLabelToMap(
    map: Map<LabelColor, Set<LabelName>>,
    labelString: string,
  ) {
    if (labelString === ID_NONE) {
      setOrAddToMap(map, NO_LABELS, NO_LABELS);
      return;
    }

    const [labelColor, labelName = ''] = labelString.split(':');
    setOrAddToMap(
      map,
      (labelColor === 'null' ? null : labelColor) as LabelColor,
      urlDecode(labelName),
    );
  }

  toCardFilterCriteria(): CardFilterCriteria {
    return { labels: this.getLabelsForServer() || [] };
  }

  static fromCardFilterCriteria({ labels }: CardFilterCriteria) {
    const newLabels = new Map<LabelColor, Set<LabelName>>();
    labels?.forEach((label) => this.addLabelToMap(newLabels, label));
    return new LabelsFilter(newLabels);
  }

  serializeToBackboneFilter(board: Board) {
    const idLabels = this.isEnabled(NO_LABELS, NO_LABELS) ? [ID_NONE] : [];

    board.getLabels().forEach((label) => {
      const name = label.get('name');
      const color = label.get('color') as LabelColor;

      if (this.isEnabled(color, name)) {
        idLabels.push(label.id);
      }
    });

    return { idLabels };
  }
}
