import type { FilterMode } from 'app/src/components/ViewFilters/types';
import { SerializableViewFilter } from './ViewFilter';

const defaultMode = 'or';

export class ModeFilter extends SerializableViewFilter {
  public readonly filterType = 'mode' as const;
  public readonly mode: FilterMode;

  constructor(value: FilterMode = defaultMode) {
    super();
    this.mode = value;
  }

  filterLength(): number {
    return 1;
  }

  isEmpty(): boolean {
    return false;
  }

  getMode() {
    return this.mode;
  }

  setMode(value: FilterMode) {
    return new ModeFilter(value);
  }

  toUrlParams(): {
    mode: string | null;
  } {
    return { mode: this.mode === 'and' ? 'and' : null };
  }

  static fromUrlParams({ mode }: { [key: string]: string | null }) {
    if (mode?.toLowerCase() === 'and') {
      return new ModeFilter('and');
    }
    return new ModeFilter();
  }

  toCardFilterCriteria() {
    return {};
  }

  static fromCardFilterCriteria() {
    return new ModeFilter();
  }

  serializeToBackboneFilter() {
    return { mode: this.getMode() };
  }
}
