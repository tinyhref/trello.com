// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import _ from 'underscore';

import { Auth } from 'app/scripts/db/Auth';
import { LocalStorageModel } from 'app/scripts/view-models/internal/LocalStorageModel';

export const MemberState = new (class extends LocalStorageModel {
  constructor() {
    super();
    this.set({ id: `memberState-${Auth.myId()}` });
    this.fetch();
    this.enableTabSync();
  }

  default() {
    return {
      processingAttachmentsLength: 0,
      idCollapsedChecklists: [],
      showSuggestions: true,
      useAnimatedStickers: true,
    };
  }

  setShowSuggestions(enabled: boolean) {
    return this.save('showSuggestions', enabled);
  }

  getShowSuggestions() {
    return this.get('showSuggestions');
  }

  getCollapsedChecklists() {
    return this.get('idCollapsedChecklists');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pullCollapsedChecklist(idChecklist: any) {
    return this.pull('idCollapsedChecklists', idChecklist);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pushCollapsedChecklist(idChecklist: any) {
    this.pull('idCollapsedChecklists', idChecklist);
    this.addToSet('idCollapsedChecklists', idChecklist);
    const collapsed = this.getCollapsedChecklists();
    const collapsedTrunc = _.rest(
      collapsed,
      Math.max(0, collapsed.length - 256),
    );
    return this.save('idCollapsedChecklists', collapsedTrunc);
  }

  getBoardCollapsedPowerUps() {
    return this.get('idBoardCollapsedPowerUps');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pullBoardCollapsedPowerUps(idBoard: any) {
    return this.pull('idBoardCollapsedPowerUps', idBoard);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pushBoardCollapsedPowerUps(idBoard: any) {
    this.pull('idBoardCollapsedPowerUps', idBoard);
    this.addToSet('idBoardCollapsedPowerUps', idBoard);
    const collapsed = this.getBoardCollapsedPowerUps();
    const collapsedTrunc = _.rest(
      collapsed,
      Math.max(0, collapsed.length - 256),
    );
    return this.save('idBoardCollapsedPowerUps', collapsedTrunc);
  }

  getUseAnimatedStickers() {
    return this.get('useAnimatedStickers');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setUseAnimatedStickers(value: any) {
    return this.save('useAnimatedStickers', value);
  }
})();
