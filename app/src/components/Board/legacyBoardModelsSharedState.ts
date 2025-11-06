import { SharedState } from '@trello/shared-state';

import type { Board } from 'app/scripts/models/Board';
import type { Card } from 'app/scripts/models/Card';

type GenericBoardModelsError = 'ConfirmToView' | 'ServerError';

interface BoardModelInitializing {
  loading: false;
  error: null;
  model: null;
}

interface BoardModelLoading {
  loading: true;
  error: null;
  model: null;
}

interface BoardModelWithError<TModelErrors> {
  loading: false;
  error: {
    name: GenericBoardModelsError | TModelErrors;
    message?: string;
  };
  model: null;
}

interface BoardModelLoaded<TModel extends Board | Card> {
  loading: false;
  error: null;
  model: TModel;
}

type BoardModelBoardState =
  | BoardModelInitializing
  | BoardModelLoaded<Board>
  | BoardModelLoading
  | BoardModelWithError<'BoardNotFound'>;
type BoardModelCardState =
  | BoardModelInitializing
  | BoardModelLoaded<Card>
  | BoardModelLoading
  | BoardModelWithError<'CardNotFound' | 'CardNotFoundOnThisBoard'>;

/**
 * Shared state for board and card data, loading state, and errors.
 * This is meant to be a bridge state for the legacy -> react conversion
 * and not meant to exist long term, since we eventually should be relying on
 * background GraphQL queries and fragments in components.
 */
export const legacyBoardModelsSharedState = new SharedState<{
  board: BoardModelBoardState;
  card: BoardModelCardState;
}>({
  card: {
    error: null,
    loading: false,
    model: null,
  },
  board: {
    error: null,
    loading: false,
    model: null,
  },
});
