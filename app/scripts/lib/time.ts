// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import { TrelloStorage } from '@trello/storage';

class Time {
  constructor() {
    // @ts-expect-error
    this.delta = TrelloStorage.get('serverTimeDelta');
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateServerTime(time: any) {
    // @ts-expect-error TS(2362): The left-hand side of an arithmetic operation must... Remove this comment to see the full error message
    this.delta = new Date(time) - new Date();
    // @ts-expect-error
    TrelloStorage.set('serverTimeDelta', this.delta);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  serverToClient(time: any) {
    // @ts-expect-error TS(2362): The left-hand side of an arithmetic operation must... Remove this comment to see the full error message
    return new Date(new Date(time) - this.delta);
  }
}

const time = new Time();
export { time as Time };
