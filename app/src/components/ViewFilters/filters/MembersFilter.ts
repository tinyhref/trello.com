import type { FilterableCard } from 'app/src/components/ViewFilters/types';
import { ID_NONE } from 'app/src/satisfiesFilter';
import type { CardFilterCriteria } from './ViewFilter';
import { SerializableViewFilter } from './ViewFilter';

const VALID_ID_REGEX = /^[a-f0-9]{24}$/;
const isValidObjectID = (s: string | null) =>
  typeof s === 'string' && VALID_ID_REGEX.test(s);

export class MembersFilter extends SerializableViewFilter {
  public readonly filterType = 'members' as const;
  public readonly idMembers: ReadonlySet<string>;

  constructor(idMembers: ReadonlySet<string> = new Set<string>()) {
    super();
    this.idMembers = idMembers;
  }

  equals(otherFilter: MembersFilter): boolean {
    return (
      this.idMembers.size === otherFilter.idMembers.size &&
      [...this.idMembers].every((value) => otherFilter.idMembers.has(value))
    );
  }

  filterLength(): number {
    return this.idMembers.size;
  }

  isEmpty(): boolean {
    return this.filterLength() === 0;
  }

  isEnabled(memberId: string) {
    return this.idMembers.has(memberId);
  }

  disable(...memberIds: string[]) {
    const newMembers = new Set<string>(this.idMembers);
    memberIds.forEach((member) => {
      newMembers.delete(member);
    });
    return new MembersFilter(newMembers);
  }

  enable(...memberIds: string[]) {
    return new MembersFilter(new Set([...this.idMembers, ...memberIds]));
  }

  toggle(memberId: string) {
    if (this.isEnabled(memberId)) {
      return this.disable(memberId);
    } else {
      return this.enable(memberId);
    }
  }

  satisfiesMembersFilter(
    cardMembers: FilterableCard['idMembers'] = [],
    isAnd?: boolean,
  ): boolean {
    if (this.isEmpty()) {
      return true;
    }

    const showCardsWithNoMembers = this.isEnabled(ID_NONE);
    const showCardsWithAnyone = this.isEnabled('anyone');

    if (isAnd) {
      if (showCardsWithNoMembers && this.filterLength() > 1) {
        return false;
      }

      if (showCardsWithNoMembers && cardMembers.length === 0) {
        return true;
      }

      const filterMembers = Array.from(this.idMembers);
      return filterMembers.every((idMember) => cardMembers.includes(idMember));
    } else {
      if (showCardsWithNoMembers && cardMembers.length === 0) {
        return true;
      }

      if (showCardsWithAnyone && cardMembers.length > 0) {
        return true;
      }

      return cardMembers.some((idMember) => this.isEnabled(idMember));
    }
  }

  toUrlParams(): {
    idMembers: string | null;
  } {
    const idMembersString = [...this.idMembers].join(',');
    return { idMembers: idMembersString || null };
  }

  static fromUrlParams({
    idMembers: idMembersString,
  }: {
    [key: string]: string | null;
  }) {
    const idMembers =
      idMembersString
        ?.split(',')
        .filter((member) =>
          member === ID_NONE ? true : isValidObjectID(member),
        ) ?? [];

    return new MembersFilter(new Set(idMembers));
  }

  toCardFilterCriteria() {
    return {
      idMembers: [...this.idMembers],
    };
  }

  static fromCardFilterCriteria(cardFilterCriteria: CardFilterCriteria) {
    return new MembersFilter(new Set(cardFilterCriteria.idMembers || []));
  }

  serializeToBackboneFilter() {
    return { idMembers: [...this.idMembers] };
  }
}
