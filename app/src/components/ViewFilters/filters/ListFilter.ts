import type { CardFilterCriteria } from './ViewFilter';
import { SerializableViewFilter } from './ViewFilter';

export class ListFilter extends SerializableViewFilter {
  public readonly filterType = 'list' as const;
  public readonly idLists: ReadonlySet<string>;

  constructor(idLists: ReadonlySet<string> = new Set<string>()) {
    super();
    this.idLists = idLists;
  }

  filterLength() {
    return this.idLists.size;
  }

  isEmpty(): boolean {
    return this.filterLength() === 0;
  }

  isEnabled(idList: string) {
    return this.idLists.has(idList);
  }

  disable(...idLists: string[]) {
    const newLists = new Set(this.idLists);
    idLists.forEach((list) => {
      newLists.delete(list);
    });
    return new ListFilter(new Set(newLists));
  }

  enable(...idLists: string[]) {
    return new ListFilter(new Set([...this.idLists, ...idLists]));
  }

  toggle(idList: string) {
    if (this.isEnabled(idList)) {
      return this.disable(idList);
    } else {
      return this.enable(idList);
    }
  }

  toUrlParams(): {
    [key: string]: string | null;
  } {
    const idLists = [...this.idLists];
    const idListsString = idLists.join(',');

    return {
      idLists: idListsString,
    };
  }

  static fromUrlParams({
    idLists: idListsString,
  }: {
    [key: string]: string | null;
  }) {
    const idLists = idListsString?.split(',') || [];

    const newLists = new Set<string>();
    for (const idList of idLists) {
      newLists.add(idList);
    }
    return new ListFilter(newLists);
  }

  toCardFilterCriteria() {
    return {
      idLists: [...this.idLists],
    };
  }

  static fromCardFilterCriteria(cardFilterCriteria: CardFilterCriteria) {
    const idLists = cardFilterCriteria.idLists || [];

    const newLists = new Set<string>();
    for (const idList of idLists) {
      newLists.add(idList);
    }
    return new ListFilter(newLists);
  }
}
