import { SharedState } from '@trello/shared-state';

export const shouldRefetchPlannerDataState = new SharedState<boolean>(false);
