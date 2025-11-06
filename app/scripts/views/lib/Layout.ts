/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

import _ from 'underscore';

import Backbone from '@trello/backbone';
// eslint-disable-next-line no-restricted-imports
import $ from '@trello/jquery';
import { TrelloStorage } from '@trello/storage';

import { editCommentState } from 'app/src/components/Comments/editCommentState';

interface LayoutClass {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  trigger: any;
}

class LayoutClass {
  static initClass() {
    _.extend(this.prototype, Backbone.Events);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cancelEdit($el: any) {
    $el.find('.edit-controls:not(.keep)').remove();
    $el.removeClass('editing is-editing focus');
    return $el.blur();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cancelEdits(elExclude?: any) {
    $('.edit-controls:not(.keep)').remove();
    $('.is-editing').removeClass('is-editing');
    $('.checklist-new-item').removeClass('focus');
    $('input')
      .not(elExclude || 'none')
      .blur();
    $('textarea')
      .not(elExclude || 'none')
      .blur();

    // If shown, hide the Markdown read-only view for Editor
    $('.description-edit').removeClass('view-readonly-markdown');

    // Cancel any instances where a comment is being edited
    editCommentState.setValue(() => ({}));

    this.trigger('cancelEdits');

    const editableFields = $('.editable');
    if (editableFields.length > 0) {
      editableFields.each((i) => {
        let unmarkeddown;
        const editableField = $('.editable')[i];
        const isEditing = $(editableField).hasClass('editing');
        const warning = $(editableField).find('.edits-warning:first');
        const current = $(editableField).find('.current:first');
        const field = $(editableField).find('.field:first');
        const draftKey = field.data('draftKey');

        const saveDraft =
          (unmarkeddown = current.data('unmarkeddown')) != null
            ? unmarkeddown !== field.val()
            : field.val() !== current.text();

        if (saveDraft && draftKey != null && isEditing) {
          if (field.hasClass('field-autosave')) {
            return this.autosaveEdits(editableField, field);
            // Don't save the draft unless they made edits that are not empty
          } else if (field.val() !== '') {
            // @ts-expect-error TS(2345): Argument of type 'string | number | string[] | und... Remove this comment to see the full error message
            TrelloStorage.set(draftKey, field.val());
            return warning.show();
          }
        }
      });
    }

    return $('.editing').removeClass('editing');
  }

  isEditing() {
    return $('.editing').length + $('.checklist-new-item.focus').length > 0;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  autosaveEdits(editableField: any, field: any) {
    if (field.hasClass('card-description')) {
      return this.trigger('autosaveCardDescription', $(editableField));
    } else if (field.hasClass('board-description')) {
      return this.trigger('autosaveBoardDescription', $(editableField));
    } else {
      return this.trigger('autosaveEdits', $(editableField));
    }
  }
}

LayoutClass.initClass();

export const Layout = new LayoutClass();
