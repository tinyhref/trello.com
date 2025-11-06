/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS204: Change includes calls to have a more natural evaluation order
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import { LabelList } from 'app/scripts/models/collections/LabelList';
import { LabelsHelper } from 'app/scripts/models/internal/LabelsHelper';
import { LocalStorageModel } from 'app/scripts/view-models/internal/LocalStorageModel';

interface CardComposer {
  labelList: LabelList;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  board: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  waitForId: any;
}

class CardComposer extends LocalStorageModel {
  static initClass() {
    // @ts-expect-error TS(2339): Property 'typeName' does not exist on type 'CardCo... Remove this comment to see the full error message
    this.prototype.typeName = 'CardComposer';

    this.lazy({
      labelList() {
        return (
          new LabelList()
            .syncModel(this, 'idLabels')
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .syncCache(this.modelCache, [], (label: any) => {
              let left, needle;
              return (
                (needle = label.id),
                Array.from(
                  (left = this.get('idLabels')) != null ? left : [],
                ).includes(needle)
              );
            })
        );
      },
    });

    // @ts-expect-error TS(2322): Type 'string[]' is not assignable to type '() => b... Remove this comment to see the full error message
    this.prototype.syncedKeys = ['title'];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(attrs: any, { board }: any) {
    // @ts-expect-error TS(2556): A spread argument must either have a tuple type or... Remove this comment to see the full error message
    super(...arguments);
    this.board = board;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.waitForId(this.board, (idBoard: any) => {
      this.set({ id: `boardCardComposerSettings-${idBoard}` });
      return this.fetch();
    });
  }

  default() {
    return {
      list: null,
      index: null,
      idMembers: [],
      idLabels: [],
      pos: 'bottom',
      title: '',
      vis: false,
    };
  }

  clear() {
    return this.save(this.default());
  }

  clearItems() {
    this.labelList.reset();
    this.save({
      idMembers: [],
      idLabels: [],
      title: '',
    });
  }

  moveToNext() {
    let left;
    this.save({
      index: ((left = this.get('index')) != null ? left : 0) + 1,
    });
  }

  getBoard() {
    return this.board;
  }

  getList() {
    return this.get('list');
  }

  editable() {
    return this.getBoard().editable();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addMember(idMember: any) {
    return this.addToSet('idMembers', idMember);
  }

  // This is a passthrough proxy for CardMemberSelectView.selectMem which
  // can have a model of type CardComposer (this view model) or Card.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addMemberWithTracing(idMember: any, traceId: any, next: any) {
    this.addMember(idMember);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  removeMember(idMember: any) {
    return this.pull('idMembers', idMember);
  }

  // This is a passthrough proxy for CardMemberSelectView.selectMem which
  // can have a model of type CardComposer (this view model) or Card.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  removeMemberWithTracing(idMember: any, traceId: any, next: any) {
    this.removeMember(idMember);
  }

  // For now, no suggestions on card composer
  isValidSuggestion() {
    return false;
  }

  // LabelsHelper mapping
  getLabels() {
    return LabelsHelper.getLabels.call(this);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataForLabel(label: any) {
    return LabelsHelper.dataForLabel.call(this, label);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toggleLabelColor(color: any) {
    return LabelsHelper.toggleLabelColor.call(this, color);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  hasLabel(label: any) {
    return LabelsHelper.hasLabel.call(this, label);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toggleLabel(label: any, toggleOn: any, next?: any) {
    return LabelsHelper.toggleLabel.call(this, label, toggleOn, next);
  }
}
CardComposer.initClass();

export { CardComposer };
