// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import { Util } from 'app/scripts/lib/util';
import { SavedSearch } from 'app/scripts/models/SavedSearch';
import { CollectionWithHelpers } from './internal/CollectionWithHelpers';

interface SavedSearchList {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  member: any;
}

class SavedSearchList extends CollectionWithHelpers<SavedSearch> {
  static initClass() {
    this.prototype.model = SavedSearch;
  }
  url() {
    return `/1/member/${this.member.id}/savedSearches`;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialize(list: any, { member }: any) {
    this.member = member;
    return this.listenTo(this, 'change:pos', this.sort);
  }

  // @ts-expect-error
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  comparator(savedSearch: any) {
    return savedSearch.get('pos') || 0;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  saveSearch(name: any, query: any) {
    let pos;
    if (this.length) {
      // @ts-expect-error
      pos = this.at(this.length - 1).get('pos') + Util.spacing;
    } else {
      pos = Util.spacing;
    }

    return this.create(
      {
        name,
        query,
        pos,
      },
      // @ts-expect-error
      { modelCache: this.modelCache },
    );
  }
}
SavedSearchList.initClass();

export { SavedSearchList };
