/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import { intl } from '@trello/i18n';
import { showFlag } from '@trello/nachos/experimental-flags';

// Mixing-in classes must have a labelList property that the mixin can access.
export const LabelsHelper = {
  // @ts-expect-error TS(7023): 'getLabels' implicitly has return type 'any' becau... Remove this comment to see the full error message
  getLabels() {
    // @ts-expect-error TS(2339): Property 'labelList' does not exist on type '{ get... Remove this comment to see the full error message
    return this.labelList.models;
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataForLabel(label: any) {
    return { ...label.toJSON(), isActive: this.hasLabel(label) };
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toggleLabelColor(color: any): void {
    // @ts-expect-error TS(2339): Property 'getBoard' does not exist on type '{ getL... Remove this comment to see the full error message
    const label = this.getBoard().labelForColor(color);
    if (label != null) {
      return this.toggleLabel(label);
    }
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  hasLabel(label: any): boolean {
    // @ts-expect-error TS(2339): Property 'labelList' does not exist on type '{ get... Remove this comment to see the full error message
    return this.labelList.contains(label);
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toggleLabel(label: any, toggleOn?: any, next?: any): void {
    if (!label) {
      showFlag({
        // @ts-expect-error TS(2322): Type '"toggleLabelFailed"' is not assignable to ty... Remove this comment to see the full error message
        id: 'toggleLabelFailed',
        title: intl.formatMessage({
          id: 'templates.popover_change_labels.something-went-wrong',
          defaultMessage: 'Something went wrong. Try again later.',
          description:
            'Error message for unsuccessful label change in popover.',
        }),
        appearance: 'error',
      });
      return;
    }

    if (toggleOn == null) {
      toggleOn = !this.hasLabel(label);
    }

    // @ts-expect-error TS(2339): Property 'recordAction' does not exist on type '{ ... Remove this comment to see the full error message
    if (typeof this.recordAction === 'function') {
      // @ts-expect-error TS(2339): Property 'recordAction' does not exist on type '{ ... Remove this comment to see the full error message
      this.recordAction({
        type: toggleOn ? 'add-label' : 'remove-label',
        idLabel: label.id,
      });
    }

    // @ts-expect-error TS(2339): Property 'toggle' does not exist on type '{ getLab... Remove this comment to see the full error message
    return this.toggle('idLabels', label.id, toggleOn, next);
  },
};
