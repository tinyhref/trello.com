import { SharedState } from '@trello/shared-state';

export const appRenderState = new SharedState<'afterPaint' | 'paint'>('paint');
