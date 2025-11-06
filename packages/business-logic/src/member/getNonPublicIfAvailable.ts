import type {
  LooseMemberNonPublicFields,
  MemberNonPublicKeys,
} from '@trello/model-types';
import { convertToPIIString } from '@trello/privacy';

export type MemberWithNonPublicInformation = {
  nonPublic?: LooseMemberNonPublicFields | null;
} & LooseMemberNonPublicFields;

// this utility method is almost identical to the one used on server side (changes made for TS)
export const getNonPublicIfAvailable = (
  member: MemberWithNonPublicInformation,
  attribute: MemberNonPublicKeys,
) => {
  const field = member.nonPublic?.[attribute] ?? member[attribute];
  if (typeof field === 'string') {
    return convertToPIIString(field);
  }
  return field;
};
