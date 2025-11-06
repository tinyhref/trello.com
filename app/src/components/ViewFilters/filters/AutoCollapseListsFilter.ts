import { SerializableViewFilter } from './ViewFilter';

export class AutoCollapseListsFilter extends SerializableViewFilter {
  public readonly filterType = 'autoCollapse' as const;
  public readonly autoCollapse: boolean;

  constructor(value: boolean = false) {
    super();
    this.autoCollapse = value;
  }

  filterLength(): number {
    return 1;
  }

  isEmpty(): boolean {
    return false;
  }

  getAutoCollapse() {
    return this.autoCollapse;
  }

  setAutoCollapse(value: boolean) {
    return new AutoCollapseListsFilter(value);
  }

  toUrlParams(): {
    autoCollapse: string | null;
  } {
    return {
      autoCollapse: !this.autoCollapse ? null : this.autoCollapse.toString(),
    };
  }

  static fromUrlParams({ autoCollapse }: { [key: string]: string | null }) {
    if (autoCollapse?.toLowerCase() === 'true') {
      return new AutoCollapseListsFilter(true);
    }
    return new AutoCollapseListsFilter(false);
  }

  toCardFilterCriteria() {
    return {};
  }

  static fromCardFilterCriteria() {
    return new AutoCollapseListsFilter();
  }

  serializeToBackboneFilter() {
    return { autoCollapse: this.getAutoCollapse() };
  }
}
