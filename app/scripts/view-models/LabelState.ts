// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import { LocalStorageModel } from 'app/scripts/view-models/internal/LocalStorageModel';

interface LabelState {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  update: any;
}

class LabelState extends LocalStorageModel {
  constructor() {
    // @ts-expect-error TS(2556): A spread argument must either have a tuple type or... Remove this comment to see the full error message
    super(...arguments);
    this.set({ id: 'labelState' });
    this.fetch();
    this.enableTabSync();
  }

  default() {
    return { showText: false };
  }

  getShowText() {
    return this.get('showText');
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setShowText(showText: any) {
    return this.update('showText', showText);
  }
  toggleText() {
    return this.setShowText(!this.getShowText());
  }

  // @ts-expect-error TS(2425): Class 'LocalStorageModel' defines instance member ... Remove this comment to see the full error message
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onStorage(ev: any) {
    return this.setShowText(this.getShowText());
  }
}

// Label state is global across the application
const labelState = new LabelState();
export { labelState as LabelState };
