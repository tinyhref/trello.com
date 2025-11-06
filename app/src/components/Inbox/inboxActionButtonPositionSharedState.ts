import type { Placement } from '@atlaskit/popper';
import { SharedState } from '@trello/shared-state';

export const inboxActionButtonPositionSharedState = new SharedState({
  position: 'right-start' as Placement,
});
