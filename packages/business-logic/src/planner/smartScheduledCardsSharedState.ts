import { SharedState } from '@trello/shared-state';

export type SmartScheduledCardPlannerEvent = {
  id: string;
  start: string;
  end: string;
  eventId: string;
  title: string;
  durationEditable: true;
  startEditable: true;
};

const initialState: {
  activeIndex: number | null;
  isLoading: boolean;
  proposedEvents: SmartScheduledCardPlannerEvent[];
} = {
  activeIndex: null,
  isLoading: false,
  proposedEvents: [],
};

export const smartScheduledCardsSharedState = new SharedState<
  typeof initialState
>(initialState);
