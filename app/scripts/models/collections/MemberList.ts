// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import { getApiError, parseXHRError } from '@trello/error-handling';
import { sendNetworkErrorEvent } from '@trello/error-reporting';

import { Auth } from 'app/scripts/db/Auth';
import { modelFactory } from 'app/scripts/db/modelFactory';
import type { Member } from 'app/scripts/models/Member';
import { ApiAjax } from 'app/scripts/network/ApiAjax';
import { CollectionWithHelpers } from './internal/CollectionWithHelpers';

interface MemberList {
  sortField: keyof Member['attributes'];
  options: object;
}

class MemberList extends CollectionWithHelpers<Member> {
  static initClass() {
    this.prototype.model = modelFactory.getModelClass('Member');
    this.prototype.sortField = 'fullName';
  }

  idList() {
    return this.pluck('id');
  }

  removeMembershipWithTracing(
    member: Member,
    options: { traceId: string; mass?: boolean },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    next: any,
  ) {
    this.remove(member);
    const traceId = options.traceId;

    if (!this.sourceModel) {
      return;
    }

    let route = `/1/${this.sourceModel.typeName}/${this.sourceModel.id}/members/${member.id}`;
    if (options?.mass) {
      route += '/all';
    }

    return ApiAjax({
      traceId,
      url: route,
      type: 'delete',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      success: (resp: any) => {
        //The original method contained an early return for the server returning {unreadable: true}
        //when the member removal resulted in the viewing user to lose view permissions. For the board
        //case, the early return did not appear to do anything, so I removed it. If we start seeing
        //uncaught errors, we may want to add "if(resp.unreadable){next(null, resp) return}". If there's
        //no difference with the other models or in error states, please remove this comment when you deprecate
        //the removeMembership method.
        next(null, resp);
      },
      error: (xhr: XMLHttpRequest) => {
        const errorMessage = parseXHRError(xhr);
        // @ts-expect-error
        const error = getApiError(xhr.status, errorMessage);
        sendNetworkErrorEvent({
          status: xhr.status,
          response: error.toString(),
          url: route,
        });
        next(error);
      },
    });
  }

  removeMembership(
    member: Member,
    options: { mass: boolean; success: () => void },
  ) {
    this.remove(member);

    if (!this.sourceModel) {
      return;
    }

    let route = `/1/${this.sourceModel.typeName}/${this.sourceModel.id}/members/${member.id}`;
    if (options?.mass) {
      route += '/all';
    }
    return ApiAjax({
      url: route,
      type: 'delete',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      success(resp: any) {
        // If removing a member would make the member lose view perms for the model, the
        // server sends a 200 with a response of {unreadable:true}. This workaround
        // was put in place to not treat this as response as successful, but it's unclear
        // if that is still needed. I am leaving it intact for now, but when we port this
        // method entirely to removeMembershipWithTracing, we should test if this is
        // necessary to do for org and enterprise. On board, returning here doesn't appear to
        // do anything and complicates tracing.
        if (resp?.unreadable) {
          return;
        }
        return options?.success?.();
      },
    });
  }

  // Returns a new member list without members that you shouldn't be able to see
  // The force option excludes deactivated members, even if you're allowed to
  // see them
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filterDeactivated(param: any = {}) {
    let { model, force } = param;
    if (!model) {
      model = this.sourceModel;
    }
    if (!force) {
      force = false;
    }
    // We don't want to always use @options.model, since that could be a card and
    // we want to reference the membership model (board in that case)
    // force allows you to forget whether the user can see them or not
    const me = Auth.me();
    return new MemberList(
      this.filter(
        (member: Member) =>
          // Make sure the member is on the model since you could somehow be on a
          // card without being on the board (since removal was broken for some
          // time), and we don't want to hide that member while they wonder why
          // they're getting updates.
          model.hasActiveMembership(member) ||
          (!force &&
            model.isDeactivated(member) &&
            model.canSeeDeactivated(me)),

        this.options,
      ),
    );
  }

  // @ts-expect-error
  comparator(member: Member) {
    return member.get(this.sortField)?.toLocaleLowerCase();
  }
}
MemberList.initClass();

export { MemberList };
