import { SharedState } from '@trello/shared-state';
import type { Photo } from '@trello/unsplash';

export interface BackgroundItemState {
  type: 'default' | 'gradient' | 'unsplash' | null;
  id: string | null;
}

interface BackgroundState {
  selected: BackgroundItemState;
  preSelected: BackgroundItemState;
  shifted: BackgroundItemState;
}

export interface CreateMenuState {
  currentPhotosQuery: string;
  background: BackgroundState;
  name: string;
  isCreatingBoard: boolean;
  isLoadingPhotos: boolean;
  keepFromSource: string[];
  photos: Photo[];
  totalPhotos: number;
  selectedTeamId: string | null;
  selectedVisibility: 'enterprise' | 'org' | 'private' | 'public' | null;
}

export const initialState: CreateMenuState = {
  currentPhotosQuery: '',
  background: {
    preSelected: {
      type: 'default',
      id: 'blue',
    },
    selected: {
      type: null,
      id: null,
    },
    shifted: {
      type: null,
      id: null,
    },
  },
  name: '',
  isCreatingBoard: false,
  isLoadingPhotos: true,
  photos: [],
  totalPhotos: 0,
  selectedTeamId: null,
  selectedVisibility: null,
  keepFromSource: ['cards'],
};

export const createMenuState = new SharedState<CreateMenuState>(initialState);
