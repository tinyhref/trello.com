import { memberId } from './memberId';

// We access memberId directly rather than calling getMemberId because the
// getMemberId function reads the cookie and this can degrade performance.
// eslint-disable-next-line @eslint-react/no-unnecessary-use-prefix
export const useMemberId = (): string => {
  return memberId ?? 'me';
};
