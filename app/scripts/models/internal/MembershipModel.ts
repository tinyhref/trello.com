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
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import _ from 'underscore';

import { Analytics } from '@trello/atlassian-analytics';

import { Auth } from 'app/scripts/db/Auth';
import { ModelCache } from 'app/scripts/db/ModelCache';
import { removeById } from 'app/scripts/lib/util/array/remove-by-id';
import { ApiPromise } from 'app/scripts/network/ApiPromise';

// Mixin for models that have memberships
export const MembershipModel = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  orderedVisibleAdmins(): any {
    return (
      // @ts-expect-error TS(2339): Property 'adminList' does not exist on type '{ ord... Remove this comment to see the full error message
      this.adminList
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .sortBy((member: any) => {
          const prefix = Auth.isMe(member)
            ? // The current user is always first in the list
              '0'
            : this.isDeactivated(member)
              ? // Deactivated users always come last
                '4'
              : this.isPending(member)
                ? '3'
                : // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
                  this.getMemberType(member) === 'admin'
                  ? // Admins toward the front
                    '1'
                  : '2';

          return prefix + member.get('fullName')?.toLocaleLowerCase();
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((member: any) => {
          return (
            !this.isDeactivated(member) || this.canSeeDeactivated(Auth.me())
          );
        })
    );
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  orderedVisibleMembers(): any {
    return (
      // @ts-expect-error TS(2339): Property 'memberList' does not exist on type '{ or... Remove this comment to see the full error message
      this.memberList
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .sortBy((member: any) => {
          const prefix = Auth.isMe(member)
            ? // The current user is always first in the list
              '0'
            : this.isDeactivated(member)
              ? // Deactivated users always come last
                '4'
              : this.isPending(member)
                ? '3'
                : // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
                  this.getMemberType(member) === 'admin'
                  ? // Admins toward the front
                    '1'
                  : '2';

          return prefix + member.get('fullName')?.toLocaleLowerCase();
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((member: any) => {
          return (
            !this.isDeactivated(member) || this.canSeeDeactivated(Auth.me())
          );
        })
    );
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getMemberType(member: any, opts: any) {
    let memberType;
    if (opts == null) {
      opts = {};
    }
    const { ignoreEntAdminStatus } = opts;
    if (
      !ignoreEntAdminStatus &&
      // @ts-expect-error TS(2339): Property 'getEnterprise' does not exist on type '{... Remove this comment to see the full error message
      (typeof this.getEnterprise === 'function'
        ? // @ts-expect-error TS(2339): Property 'getEnterprise' does not exist on type '{... Remove this comment to see the full error message
          this.getEnterprise()
        : undefined
      )?.isAdmin(member)
    ) {
      memberType = 'admin';
    } else if (
      // @ts-expect-error TS(2339): Property 'getOrganization' does not exist on type ... Remove this comment to see the full error message
      (typeof this.getOrganization === 'function'
        ? // @ts-expect-error TS(2339): Property 'getOrganization' does not exist on type ... Remove this comment to see the full error message
          this.getOrganization()
        : undefined
      )?.isPremOrgAdmin(member)
    ) {
      memberType = 'admin';
    } else {
      memberType = this.getExplicitMemberType(member);
    }

    if (
      memberType !== 'public' &&
      (typeof this.isPending === 'function'
        ? this.isPending(member)
        : undefined)
    ) {
      memberType = 'pending';
    }

    return memberType;
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _refreshMemberships(): any {
    // @ts-expect-error TS(2339): Property '_memberships' does not exist on type '{ ... Remove this comment to see the full error message
    return this._memberships.update(this.get('memberships'));
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _getMembershipFor(member: any): any {
    // Dependency required at call site to avoid import cycles, do not lift to top of module
    const {
      MembershipList,
    } = require('app/scripts/models/collections/MembershipList');

    // @ts-expect-error TS(2339): Property '_memberships' does not exist on type '{ ... Remove this comment to see the full error message
    if (!this._memberships) {
      // @ts-expect-error TS(2339): Property '_memberships' does not exist on type '{ ... Remove this comment to see the full error message
      this._memberships = new MembershipList();
      this._refreshMemberships();

      // @ts-expect-error TS(2339): Property 'listenTo' does not exist on type '{ orde... Remove this comment to see the full error message
      this.listenTo(this, 'change:memberships', this._refreshMemberships);
    }

    // @ts-expect-error TS(2339): Property '_memberships' does not exist on type '{ ... Remove this comment to see the full error message
    return this._memberships.getMember(member);
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getMembershipFor(member: any) {
    // Much of the underlying code expects a basic object, and not a model. This
    // is something we can change in the future by moving more methods on to the
    // membership model.
    return this._getMembershipFor(member)?.toJSON();
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  hasActiveMembership(member: any) {
    return (
      this._getMembershipFor(member) != null && !this.isDeactivated(member)
    );
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isMember(member: any) {
    let needle;
    return (
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      (needle = this.getMemberType(member)),
      ['pending', 'normal', 'admin'].includes(needle)
    );
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isPending(member: any): boolean {
    return (member != null ? member.get('memberType') : undefined) === 'ghost';
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isDeactivated(member: any): boolean {
    return this._getMembershipFor(member)?.get('deactivated') === true;
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isUnconfirmed(member: any): boolean {
    return this._getMembershipFor(member)?.get('unconfirmed') === true;
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isObserver(member: any): boolean {
    return this.getExplicitMemberType(member) === 'observer';
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isPremOrgAdmin(memberOrId: any): boolean {
    // 'memberOrId' can be a member or just an id here, hence the extra checks
    // This is true for many of the methods in this file. Presumably this
    // is so we can handle deleted members properly. Item to clean
    // this up on card https://trello.com/c/jB0cQJPR

    let left;
    if (_.isString(memberOrId)) {
      memberOrId = ModelCache.get('Member', memberOrId);
    }

    const idPremOrgsAdmin =
      (left = memberOrId?.get?.('idPremOrgsAdmin')) != null ? left : [];

    // @ts-expect-error TS(2339): Property 'getOrganization' does not exist on type ... Remove this comment to see the full error message
    const idOrganization = this.getOrganization
      ? // @ts-expect-error TS(2339): Property 'getOrganization' does not exist on type ... Remove this comment to see the full error message
        this.getOrganization()?.id
      : // @ts-expect-error TS(2339): Property 'id' does not exist on type '{ orderedVis... Remove this comment to see the full error message
        this.id;

    return Array.from(idPremOrgsAdmin).includes(idOrganization);
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getExplicitMemberType(member: any) {
    let membership;
    if (this.isDeactivated(member)) {
      return 'deactivated';
    } else if (this.isUnconfirmed(member)) {
      return 'unconfirmed';
    } else if ((membership = this._getMembershipFor(member))) {
      return membership.get('memberType');
    } else if (
      // @ts-expect-error TS(2339): Property 'getOrganization' does not exist on type ... Remove this comment to see the full error message
      (typeof this.getOrganization === 'function'
        ? // @ts-expect-error TS(2339): Property 'getOrganization' does not exist on type ... Remove this comment to see the full error message
          this.getOrganization()
        : undefined
      )?.isMember(member)
    ) {
      return 'org';
    } else {
      return 'public';
    }
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  canSeeDeactivated(member: any): boolean {
    return (
      this.isMember(member) ||
      (member.organizationList != null
        ? // @ts-expect-error TS(2339): Property 'getOrganization' does not exist on type ... Remove this comment to see the full error message
          member.organizationList.get(this.getOrganization()?.id)
        : undefined)
    );
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addMembership(membership: any) {
    const newMemberships =
      // @ts-expect-error TS(2339): Property 'get' does not exist on type '{ orderedVi... Remove this comment to see the full error message
      this.get('memberships') != null ? _.clone(this.get('memberships')) : [];
    newMemberships.push(membership);
    // @ts-expect-error TS(2339): Property 'set' does not exist on type '{ orderedVi... Remove this comment to see the full error message
    return this.set('memberships', newMemberships);
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _removeFromMembershipsAttribute(membership: any) {
    // @ts-expect-error TS(2339): Property 'get' does not exist on type '{ orderedVi... Remove this comment to see the full error message
    if (!this.get('memberships')) {
      return;
    }

    // @ts-expect-error TS(2339): Property 'set' does not exist on type '{ orderedVi... Remove this comment to see the full error message
    return this.set(
      'memberships',
      // @ts-expect-error TS(2339): Property 'get' does not exist on type '{ orderedVi... Remove this comment to see the full error message
      removeById(this.get('memberships'), membership),
    );
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  removeMembership(membership: any) {
    // @ts-expect-error TS(2339): Property '_memberships' does not exist on type '{ ... Remove this comment to see the full error message
    this._memberships.remove(membership);
    return this._removeFromMembershipsAttribute(membership);
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setOnMembership(member: any, attrs: any) {
    // @ts-expect-error TS(2339): Property 'set' does not exist on type '{ orderedVi... Remove this comment to see the full error message
    return this.set({
      // @ts-expect-error TS(2339): Property 'get' does not exist on type '{ orderedVi... Remove this comment to see the full error message
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      memberships: this.get('memberships').map(function (membership: any) {
        if (membership.idMember === member.id) {
          return { ...membership, ...attrs };
        } else {
          return membership;
        }
      }),
    });
  },

  // @ts-expect-error TS(7023): 'addMemberRole' implicitly has return type 'any' b... Remove this comment to see the full error message
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addMemberRole(opts: any) {
    return ApiPromise({
      type: 'PUT',
      // @ts-expect-error TS(2339): Property 'typeName' does not exist on type '{ orde... Remove this comment to see the full error message
      url: `/1/${this.typeName.toLowerCase()}/${this.id}/members`,
      data: opts,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }).then(function (this: any) {
      return Analytics.sendTrackEvent({
        action: 'added',
        actionSubject: 'member',
        source: 'inviteToBoardInlineDialog',
        attributes: {
          role: opts.type,
        },
        containers: {
          organization: {
            id: this.id,
          },
        },
      });
    });
  },
};
