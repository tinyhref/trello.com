/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import _ from 'underscore';

import type { LabelColor } from '@trello/labels';

import { ModelCache } from 'app/scripts/db/ModelCache';
import type { Board } from 'app/scripts/models/Board';
import type { TrelloModelAttributes } from 'app/scripts/models/internal/TrelloModel';
import { TrelloModel } from 'app/scripts/models/internal/TrelloModel';

interface LabelAttributes extends TrelloModelAttributes {
  color: NonNullable<LabelColor>;
  name: string;
  idBoard: string;
  typeName: 'Label';
}

class Label extends TrelloModel<LabelAttributes> {
  // @ts-expect-error
  urlRoot: string;
  static colors: NonNullable<LabelColor>[];

  static initClass() {
    this.prototype.typeName = 'Label';
    this.prototype.urlRoot = '/1/labels';

    this.colors = [
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
    ];
  }

  getBoard(): Board {
    // @ts-expect-error
    return ModelCache.get('Board', this.get('idBoard'));
  }

  editable() {
    return this.getBoard().editable();
  }

  colorSortVal() {
    const v = _.indexOf(Label.colors, this.get('color'));
    if (v >= 0) {
      return v;
    } else {
      return Infinity;
    }
  }

  nameSortVal() {
    let left;
    return ((left = this.get('name')) != null ? left : '').toLowerCase();
  }

  /**
   * TypeScript interface defined in app/src/components/Label/CardLabel.types.ts
   */
  toCardLabelType() {
    return {
      id: this.id,
      name: this.get('name') ?? '',
      color: this.get('color') ?? null,
    };
  }

  static compare(a: Label, b: Label) {
    const cs = a.colorSortVal() - b.colorSortVal();
    if (cs !== 0 && !isNaN(cs)) {
      return cs;
    }
    return a.nameSortVal().localeCompare(b.nameSortVal());
  }
}
Label.initClass();

export { Label };
