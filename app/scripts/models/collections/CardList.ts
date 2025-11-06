// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import { modelFactory } from 'app/scripts/db/modelFactory';
import type { Card } from 'app/scripts/models/Card';
import { CollectionWithHelpers } from './internal/CollectionWithHelpers';

interface CardList {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  list: any;
}

class CardList extends CollectionWithHelpers<Card> {
  static initClass() {
    this.prototype.model = modelFactory.getModelClass('Card');

    // @ts-expect-error
    this.prototype.url = '/1/cards';
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialize(models: any, options: any) {
    this.listenTo(this, 'change:pos', this.sort);
    this.list = options.list;
  }

  // @ts-expect-error
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  comparator(card: any) {
    return card.get('pos') || 0;
  }
}
CardList.initClass();

export { CardList };
