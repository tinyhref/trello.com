export const makeUrl = function (path: string, _query?: object) {
  let token;
  let query: { [key: string]: string };
  if (_query === undefined) {
    query = {};
  } else {
    query = { ..._query };
  }
  const invitationTokens = [];

  const inviteRegex = /invite-token-[-a-f0-9]*=([^;]+)/g;

  while ((token = inviteRegex.exec(document.cookie)?.[1]) !== undefined) {
    invitationTokens.push(unescape(token));
  }

  if (invitationTokens.length > 0) {
    // Note that this behavior should match what we're doing in model-loader,
    // where invitationTokens are added after everything else
    query.invitationTokens = invitationTokens.join(',');
  }

  if (new RegExp(`^/1/search(/|$)`).test(path)) {
    const dsc = /dsc=([^;]+)/.exec(document.cookie)?.[1];
    // We probably shouldn't be setting this to the string "undefined", but this
    // was to preserve the functionality of the code after conversion to TypeScript.
    if (dsc) {
      query.dsc = dsc;
    }
  }

  const result = [];
  for (const key in query) {
    const value = query[key];
    result.push([key, encodeURIComponent(value)].join('='));
  }

  const queryString = result.join('&');
  return [path, queryString].join('?');
};
