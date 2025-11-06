// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS201: Simplify complex destructure assignments
 * DS204: Change includes calls to have a more natural evaluation order
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

// eslint-disable-next-line no-restricted-imports
import $ from '@trello/jquery';

import type { TrelloModelAttributes } from 'app/scripts/models/internal/TrelloModel';
import { TrelloModel } from 'app/scripts/models/internal/TrelloModel';
import { ApiAjax } from 'app/scripts/network/ApiAjax';

interface InvitationAttributes extends TrelloModelAttributes {
  typeName: 'BoardInvitation' | 'Invitation' | 'OrganizationInvitation';
}

class Invitation extends TrelloModel<InvitationAttributes> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  invitationList: any;
  static initClass() {
    this.prototype.typeName = 'Invitation';
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialize(attributes: InvitationAttributes, options: any) {
    this.invitationList = options.collection;

    this.setReady();
  }

  // Temporary functions to handle invitations functions until backbone is migrated to new API
  // @ts-expect-error
  create({ model, data, success, error }) {
    return ApiAjax({
      url: `/1/${model.typeName}/${model.id}/invitations`,
      type: 'post',
      data,
      dataType: 'json',
      // @ts-expect-error
      error: (...args) => {
        let needle;
        const adjustedLength = Math.max(args.length, 1),
          [err] = Array.from(args.slice(0, adjustedLength - 1)),
          handler = args[adjustedLength - 1];
        if (
          err.responseText.trim() ===
          'Member email restricted by organization administrators'
        ) {
          // Email address did not match allowlist or board can't invite external members
          // @ts-expect-error
          $('.error', this.$el).show();
          return;
        }
        if (
          ((needle = err.responseText.trim()),
          ![
            'Member already invited',
            'Member already a member',
            'Member email restricted by organization administrators',
          ].includes(needle))
        ) {
          handler();
        }
        return typeof error === 'function' ? error(err) : undefined;
      },
      // @ts-expect-error
      // eslint-disable-next-line @typescript-eslint/no-shadow
      success: (data) => {
        return typeof success === 'function' ? success(data) : undefined;
      },
    });
  }

  // @ts-expect-error
  delete({ model, idInvitation, success, error }) {
    return ApiAjax({
      url: `/1/${model.typeName}/${model.id}/invitations/${idInvitation}`,
      type: 'delete',
      dataType: 'json',
      // @ts-expect-error
      error: (...args) => {
        const adjustedLength = Math.max(args.length, 1),
          [err] = Array.from(args.slice(0, adjustedLength - 1)),
          handler = args[adjustedLength - 1];
        if (err.responseText.trim() !== 'Invitation not found') {
          handler();
        }
        return typeof error === 'function' ? error(err) : undefined;
      },
      // @ts-expect-error
      success: (data) => {
        return typeof success === 'function' ? success(data) : undefined;
      },
    });
  }

  // @ts-expect-error
  respond({ model, response, data, success, error }) {
    return ApiAjax({
      url: `/1/${model.typeName}/${model.id}/invitations/${response}`,
      type: 'post',
      dataType: 'json',
      data,
      // @ts-expect-error
      error: (...args) => {
        const adjustedLength = Math.max(args.length, 1),
          [err] = Array.from(args.slice(0, adjustedLength - 1)),
          handler = args[adjustedLength - 1];
        if (err.responseText.trim() !== 'already a member') {
          handler();
        }
        return typeof error === 'function' ? error(err) : undefined;
      },
      // @ts-expect-error
      // eslint-disable-next-line @typescript-eslint/no-shadow
      success: (data) => {
        return typeof success === 'function' ? success(data) : undefined;
      },
    });
  }
}
Invitation.initClass();

export { Invitation };
