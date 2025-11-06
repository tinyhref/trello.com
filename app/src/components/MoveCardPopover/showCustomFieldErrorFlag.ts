import type { ApolloError } from '@apollo/client';

import type { FlagId } from '@trello/analytics-types';
import { client } from '@trello/graphql';
import {
  ErrorExtensions,
  getNetworkError,
} from '@trello/graphql-error-handling';
import { intl } from '@trello/i18n';
import { showFlag } from '@trello/nachos/experimental-flags';

import type { CustomFieldsErrorTargetBoardNameFragment } from './CustomFieldsErrorTargetBoardNameFragment.generated';
import { CustomFieldsErrorTargetBoardNameFragmentDoc } from './CustomFieldsErrorTargetBoardNameFragment.generated';

interface ParseCustomFieldsError {
  error: ApolloError | Error | unknown;
  targetBoardId: string;
  flagId: FlagId;
}

/**
 * This function handles server errors related to custom fields limits
 * for moving a list to another board and moving/copying a card to another board.
 * If a custom field limits error is thrown by server then the function
 * calls showFlag with the relevant message and returns true, otherwise
 * it returns false and showFlag is not called.
 *
 * In other cases, we check limits on the frontend before the user makes
 * a network request, but for custom fields there is additional logic
 * in server to match custom fields across boards, so in this instance we
 * need to handle the errors after the network request is made.
 */
export const showCustomFieldErrorFlag = ({
  error,
  targetBoardId,
  flagId,
}: ParseCustomFieldsError) => {
  const targetBoard =
    client.readFragment<CustomFieldsErrorTargetBoardNameFragment>(
      {
        id: `Board:${targetBoardId}`,
        fragment: CustomFieldsErrorTargetBoardNameFragmentDoc,
      },
      true,
    );

  if (!targetBoard) {
    return;
  }

  const boardName = targetBoard.name;
  const networkError = getNetworkError(error);

  if (networkError?.code === ErrorExtensions.BOARD_TOO_MANY_CUSTOM_FIELDS) {
    showFlag({
      id: flagId,
      title: intl.formatMessage(
        {
          id: 'templates.limits_error.too-many-custom-fields-per-board',
          defaultMessage:
            'You have too many custom fields on “{boardName}“. Delete some to add more.',
          description: 'Board limit too many custom fields',
        },
        { boardName },
      ),
      appearance: 'error',
      msTimeout: 8000,
    });
    return true;
  } else if (
    networkError?.code === ErrorExtensions.CUSTOM_FIELD_TOO_MANY_OPTIONS
  ) {
    showFlag({
      id: flagId,
      title: intl.formatMessage(
        {
          id: 'templates.limits_error.too-many-custom-field-options-per-field',
          defaultMessage:
            'You have too many options on a custom field on “{boardName}“. Delete some options to add more.',
          description: 'Board limit too many custom field dropdown options',
        },
        { boardName },
      ),
      appearance: 'error',
      msTimeout: 8000,
    });
    return true;
  } else {
    return false;
  }
};
