import { SharedState } from '@trello/shared-state';

import type { FlagArgs } from './types';

export const flagsState = new SharedState<FlagArgs[]>([]);
