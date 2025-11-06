/**
 * Will look into the document cookies to find invitations tokens
 * sent by server. If they exist the member could be authenticated
 * for viewing pages anonymously, such as a board or workspace
 * that they were invited to.
 * @returns invitation tokens or void
 */
export const getInvitationTokens = (): string | void => {
  let token;
  const invitationTokens = [];

  const inviteRegex = /invite-token-[-a-f0-9]*=([^;]+)/g;

  while ((token = inviteRegex.exec(document.cookie)?.[1])) {
    invitationTokens.push(unescape(token));
  }

  if (invitationTokens.length > 0) {
    // Note that this behavior should match what we're doing in model-loader,
    // where invitationTokens are added after everything else
    return invitationTokens.join(',');
  }
};
