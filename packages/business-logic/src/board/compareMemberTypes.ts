import type { MemberType } from './memberType.types';

/**
 * Compares memberTypes according to the following hirerarchy: 'org' -> 'normal' -> 'admin'. Returns a number that reflects the difference.
 * Only does standard mode so far; add modes as you need
 */
export const compareMemberTypes = (a: MemberType, b: MemberType) => {
  const hierarchy = [['org'], ['normal'], ['admin']];
  const aTier = hierarchy.findIndex((tier) => tier.includes(a ?? ''));
  const bTier = hierarchy.findIndex((tier) => tier.includes(b ?? ''));
  return aTier - bTier;
};
