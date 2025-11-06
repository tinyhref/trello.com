/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

import { getMemberId, isMemberLoggedIn } from '@trello/authentication';
import type { PIIString } from '@trello/privacy';
import { convertToPIIString } from '@trello/privacy';
import { token } from '@trello/session-cookie';

import { ModelCache } from 'app/scripts/db/ModelCache';
import type { Member } from '../models/Member';
import { modelFactory } from './modelFactory';

interface Auth {
  idNotLoggedIn: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  memberId: any;
  isLoggedIn(): boolean;
  myId(): string;
  myUsername(): PIIString;
  myToken(): string;
  me(): Member;
  isMe(memberOrId: Partial<Member> | string | undefined): boolean;
  confirmed(): boolean;
}

class Auth {
  constructor() {
    this.idNotLoggedIn = 'notLoggedIn';
    this.memberId = getMemberId() || this.idNotLoggedIn;
  }

  /***
   * @deprecated please use `isMemberLoggedIn` from '@trello/authentication';
   */
  isLoggedIn() {
    return isMemberLoggedIn();
  }
  /***
   * @deprecated please use `getMemberId` or `useMemberId` from '@trello/authentication';
   */
  myId() {
    return this.memberId;
  }
  /***
   * @deprecated please use a GraphQL query or fragment to get data for the current user
   */
  myUsername() {
    return convertToPIIString(this.me()?.get('username'));
  }
  /***
   * @deprecated please use `token` from '@trello/session-cookie';
   */
  myToken() {
    return token;
  }
  /***
   * @deprecated please use a GraphQL query or fragment to get data for the current user
   */
  me() {
    let me = ModelCache.get('Member', this.memberId);
    if (me == null && !this.isLoggedIn()) {
      // eslint-disable-next-line @trello/enforce-variable-case
      const Member = modelFactory.getModelClass('Member');
      me = new Member(
        { id: this.idNotLoggedIn, notLoggedIn: true },
        // @ts-expect-error TS(2554): Expected 0-1 arguments, but got 2.
        { modelCache: ModelCache },
      );
      ModelCache.add(me);
    }
    return me!;
  }
  // Returns true if the member or member id passed in is the logged in member
  /***
   * @deprecated please use `getMemberId` or `useMemberId` from '@trello/authentication'
   */
  // @ts-expect-error TS(7023): 'isMe' implicitly has return type 'any' because it... Remove this comment to see the full error message
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isMe(memberOrId: any) {
    if (memberOrId != null ? memberOrId.id : undefined) {
      return this.isMe(memberOrId.id);
    } else {
      return memberOrId === this.memberId;
    }
  }
  /***
   * @deprecated please use a GraphQL query or fragment to get data for the current user
   */
  confirmed() {
    return this.me().get('confirmed');
  }
}

/***
 * @deprecated
 */
const auth = new Auth();
export { auth as Auth };
