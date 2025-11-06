export interface Login {
  claimable: boolean;
}

/**
 * Returns 'business' if any login is claimable. Otherwise, returns 'personal'.
 */
export const getAccountType = (logins: Login[]) =>
  logins?.some((login) => login.claimable) ? 'business' : 'personal';
