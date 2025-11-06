import { sendNetworkErrorEvent } from '@trello/error-reporting';
import { parseNetworkError } from '@trello/graphql-error-handling';
import { sanitizeUrl } from '@trello/safe-urls';
import { getCsrfRequestPayload } from '@trello/session-cookie/csrf';

import { safeFetch } from '../fetch';
import type { MutationAssignPersonalProductivityCohortArgs } from '../generated';
import type { TrelloRestResolver } from '../types';

export const assignPersonalProductivityCohort: TrelloRestResolver<
  MutationAssignPersonalProductivityCohortArgs
> = async (obj, { assignmentValue }, context, info) => {
  const apiUrl = sanitizeUrl`/1/members/me/cohorts/userCohortPersonalProductivity`;

  const response = await safeFetch(apiUrl, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({
      ...getCsrfRequestPayload(),
      assignmentValue,
    }),
  });

  if (!response.ok) {
    sendNetworkErrorEvent({
      url: apiUrl,
      response: await response.clone().text(),
      status: response.status,
      operationName: context.operationName,
    });
    throw await parseNetworkError(response);
  }

  const assignment = await response.json();

  return {
    cohorts: Object.keys(assignment).map((key) => ({
      name: key,
      value: assignment[key],
    })),
  };
};
