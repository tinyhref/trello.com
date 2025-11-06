export const MemberErrorExtensions = {
  MUST_REACTIVATE_USER_FIRST: 'MUST_REACTIVATE_USER_FIRST',
  BAD_EMAIL: 'BAD_EMAIL',
  ALREADY_CONFIRMED_EMAIL: 'ALREADY_CONFIRMED_EMAIL',
} as const;
type MemberErrorExtensionsType =
  (typeof MemberErrorExtensions)[keyof typeof MemberErrorExtensions];

export const MemberErrors: Record<string, MemberErrorExtensionsType> = {
  'Must reactivate user first':
    MemberErrorExtensions.MUST_REACTIVATE_USER_FIRST,
  'Invalid email address': MemberErrorExtensions.BAD_EMAIL,
  'This email address is already confirmed':
    MemberErrorExtensions.ALREADY_CONFIRMED_EMAIL,
};
