import { defineMessages, type MessageDescriptor } from 'react-intl';

/**
 * Attempts to parse a JSON string and extract the message property.
 * @param str - The string to parse as JSON
 * @returns The message property from the parsed JSON, or null if parsing fails
 */
const tryParseJsonMessage = (str: string) => {
  try {
    return JSON.parse(str).message;
  } catch (e) {
    return null;
  }
};

/**
 * Gets all server error messages organized by error string.
 * @returns A record containing server error message descriptors keyed by error strings.
 */
const getServerErrorMessages = (): Record<string, MessageDescriptor> =>
  defineMessages({
    'Member has too many orgs': {
      id: 'server error.member_has_too_many_orgs',
      defaultMessage: 'The member belongs to too many Workspaces.',
      description: 'Error message when member belongs to too many workspaces',
    },
    'Org has too many members': {
      id: 'server error.org_has_too_many_members',
      defaultMessage: 'The Workspace has too many members.',
      description: 'Error message when workspace has too many members',
    },
    'Board has too many members': {
      id: 'server error.board_has_too_many_members',
      defaultMessage: 'The board has too many members.',
      description: 'Error message when board has too many members',
    },
    'No Enterprise licenses available. Please contact your Trello administrator for additional licenses.':
      {
        id: 'server error.no_enterprise_licenses',
        defaultMessage:
          'No Enterprise licenses available. Please contact your Trello administrator for additional licenses.',
        description: 'Error message when no enterprise licenses are available',
      },
    'No seats available. Please contact Support for additional seats.': {
      id: 'server error.no_seats_available',
      defaultMessage:
        'No seats available. Please contact Support for additional seats.',
      description: 'Error message when no seats are available',
    },
    'Member account must belong to enterprise before adding to team': {
      id: 'server error.member_must_belong_to_enterprise',
      defaultMessage:
        'Member account must belong to enterprise before adding to Workspace',
      description:
        'Error message when member must belong to enterprise before adding to workspace',
    },
    'Member email restricted by organization administrators': {
      id: 'server error.member_email_restricted',
      defaultMessage: 'Member email is restricted by Workspace administrators',
      description:
        'Error message when member email is restricted by workspace administrators',
    },
    'Member must be a managed enterprise member or have valid email in approved domains':
      {
        id: 'server error.member_must_be_managed_or_valid_email',
        defaultMessage:
          'Member must be a managed enterprise member or have valid email in approved domains',
        description:
          'Error message when member must be managed or have valid email in approved domains',
      },
    'Member must be a managed enterprise member': {
      id: 'server error.member_must_be_managed_enterprise',
      defaultMessage: 'Member must be a managed enterprise member',
      description:
        'Error message when member must be a managed enterprise member',
    },
    'Image cannot be processed': {
      id: 'server error.image_cannot_be_processed',
      defaultMessage: 'Image cannot be processed',
      description: 'Error message when image cannot be processed',
    },
    'username is taken': {
      id: 'server error.username_taken',
      defaultMessage: 'Username is taken',
      description: 'Error message when username is already taken',
    },
    'username must be at least 3 characters': {
      id: 'server error.username_too_short',
      defaultMessage: 'Username must be at least 3 characters',
      description: 'Error message when username is too short',
    },
    'username is invalid: only lowercase letters, underscores, and numbers are allowed':
      {
        id: 'server error.username_invalid_format',
        defaultMessage:
          'Username is invalid: only lowercase letters, underscores, and numbers are allowed',
        description: 'Error message when username format is invalid',
      },
    'full name must be at least 1 character': {
      id: 'server error.full_name_too_short',
      defaultMessage: 'Full name must be at least 1 character',
      description: 'Error message when full name is too short',
    },
    'full name must not contain a url': {
      id: 'server error.full_name_no_url',
      defaultMessage: 'Full name must not contain a URL',
      description: 'Error message when full name contains a URL',
    },
    'initials must contain 1-4 characters': {
      id: 'server error.initials_invalid_length',
      defaultMessage: 'Initials must contain 1-4 characters',
      description: 'Error message when initials length is invalid',
    },
    'organization short name is taken': {
      id: 'server error.org_short_name_taken',
      defaultMessage: 'Workspace short name is taken',
      description: 'Error message when workspace short name is taken',
    },
    'organization short name must be at least 3 characters': {
      id: 'server error.org_short_name_too_short',
      defaultMessage: 'Workspace short name must be at least 3 characters',
      description: 'Error message when workspace short name is too short',
    },
    'organization short name is invalid: only lowercase letters, underscores, and numbers are allowed':
      {
        id: 'server error.org_short_name_invalid_format',
        defaultMessage:
          'Workspace short name is invalid: only lowercase letters, underscores, and numbers are allowed',
        description:
          'Error message when workspace short name format is invalid',
      },
    'display name must be at least 1 character': {
      id: 'server error.display_name_too_short',
      defaultMessage: 'Display name must be at least 1 character',
      description: 'Error message when display name is too short',
    },
    'Not a valid image format': {
      id: 'server error.invalid_image_format',
      defaultMessage: 'Not a valid image format',
      description: 'Error message when image format is invalid',
    },
    'This organization is already in another enterprise': {
      id: 'server error.org_already_in_enterprise',
      defaultMessage: 'This Workspace is already in another enterprise.',
      description:
        'Error message when workspace is already in another enterprise',
    },
    'This team is already owned by this enterprise.': {
      id: 'server error.team_already_owned_by_enterprise',
      defaultMessage: 'This Workspace is already owned by this enterprise.',
      description:
        'Error message when workspace is already owned by enterprise',
    },
    'does not have an account': {
      id: 'server error.no_account_to_reactivate',
      defaultMessage: 'You do not have an account to reactivate.',
      description:
        'Error message when user does not have an account to reactivate',
    },
    'outdated product': {
      id: 'server error.outdated_product',
      defaultMessage: 'The product you are attempting to purchase is outdated.',
      description: 'Error message when attempting to purchase outdated product',
    },
    '401: invites restricted to org or managed members': {
      id: 'server error.invites_restricted_to_org_or_managed',
      defaultMessage:
        'Enterprise permissions prevent this user from joining this board.',
      description:
        'Error message when enterprise permissions prevent user from joining board',
    },
    '401: invites restricted to managed members': {
      id: 'server error.invites_restricted_to_managed',
      defaultMessage:
        'Enterprise permissions prevent this user from joining this board.',
      description:
        'Error message when enterprise permissions restrict invites to managed members',
    },
    "Looks like you've exceeded your invitation quota. Please wait 60 minutes and try again":
      {
        id: 'server error.invitation_quota_exceeded',
        defaultMessage: 'Too many people were added at once',
        description: 'Error message when invitation quota is exceeded',
      },
    'Must reactivate user first': {
      id: 'server error.must_reactivate_user_first',
      defaultMessage: 'Reactivate member first',
      description: 'Error message when user must be reactivated first',
    },
    'confirm account to send more invitations': {
      id: 'server error.confirm_account_for_invitations',
      defaultMessage: 'Confirm your account to send more invitations',
      description:
        'Error message when account must be confirmed to send invitations',
    },
  });

/**
 * Gets a server error message descriptor for the given error message string.
 * @param message - The server error message string to localize
 * @returns A message descriptor, or null if no match is found
 */
const getServerError = (message: string): MessageDescriptor | null => {
  const serverErrorMessages = getServerErrorMessages();
  const errorMessage = serverErrorMessages[message];

  if (errorMessage) {
    return errorMessage;
  }

  return null;
};

/**
 * Localizes server error messages from various error sources.
 *
 * This function takes different types of error inputs (Error objects, XMLHttpRequest objects,
 * or strings) and returns a message descriptor that can be used with intl.formatMessage().
 * It handles JSON parsing of error messages and falls back to a default message descriptor
 * if no localization is found.
 *
 * @param resOrString - The error source, which can be:
 *   - A string containing the error message (possibly JSON)
 *   - An Error object with a message property
 *   - An XMLHttpRequest object with responseText
 *   - An object with responseJSON property (deprecated jQuery.jqXHR)
 * @returns A message descriptor that can be used with intl.formatMessage()
 *
 * @example
 * ```typescript
 * // String input
 * const error1 = localizeServerError('Member has too many orgs');
 * // Returns: { id: 'server error.member_has_too_many_orgs', defaultMessage: 'The member belongs to too many Workspaces.' }
 *
 * // Error object input
 * const error2 = localizeServerError(new Error('username is taken'));
 * // Returns: { id: 'server error.username_taken', defaultMessage: 'Username is taken' }
 *
 * // JSON string input
 * const error3 = localizeServerError('{"message": "Org has too many members"}');
 * // Returns: { id: 'server error.org_has_too_many_members', defaultMessage: 'The Workspace has too many members.' }
 *
 * // Unknown error
 * const error4 = localizeServerError('Unknown error message');
 * // Returns: { id: 'server error.unknown', defaultMessage: 'Unknown error message' }
 *
 * // Can be called in this way
 * intl.formatMessage(localizeServerError(error))
 * ```
 */
export const localizeServerError = (
  resOrString: Error | XMLHttpRequest | string,
): MessageDescriptor => {
  let message = '';

  if (typeof resOrString === 'string') {
    message = tryParseJsonMessage(resOrString) || resOrString;
    // NOTE: JQuery.jqXHR is returned from ApiAjax, which is deprecated.
    // Once the types of all consumers of this method are strictly typed,
    // we should aim to deprecate this branch.
  } else if (
    Object.prototype.hasOwnProperty.call(resOrString, 'responseJSON')
  ) {
    const jqxhr = resOrString as { responseJSON?: { message?: string } };
    message = jqxhr.responseJSON?.message ?? '';
  } else if (resOrString instanceof XMLHttpRequest) {
    message = resOrString.responseText;
  } else {
    // Error message was passed in
    const error = resOrString as Error;
    message = tryParseJsonMessage(error?.message ?? '') || error.message;
  }

  const localizedError = getServerError(message);
  if (localizedError) {
    return localizedError;
  } else {
    return {
      id: 'server error.unknown',
      defaultMessage: 'Unknown error',
      description: 'Default error message for unknown server errors',
    };
  }
};
