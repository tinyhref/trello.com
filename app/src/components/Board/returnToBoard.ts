import { makeSlug } from '@trello/urls';

import { legacyBoardModelsSharedState } from './legacyBoardModelsSharedState';
import { switchCurrentBoardView } from './switchCurrentBoardView';
import { boardPageState } from './useBoardPageState';

export const returnToBoard = () => {
  let shortLink: string | null = null;
  let shortName: string | null = null;
  if (legacyBoardModelsSharedState.value.board.model) {
    shortLink =
      legacyBoardModelsSharedState.value.board.model.get('shortLink') ?? null;
    const name =
      legacyBoardModelsSharedState.value.board.model.get('name') ?? null;

    if (name) {
      shortName = makeSlug(name);
    }
  }

  if (
    boardPageState.value.secondaryViewParams &&
    boardPageState.value.isShowingOverlay
  ) {
    switchCurrentBoardView({
      routeParams: {
        ...boardPageState.value.secondaryViewParams,
        shortLink,
        shortName,
      },
      navigateOptions: {
        trigger: true,
      },
    });
  } else if (boardPageState.value.primaryViewParams) {
    switchCurrentBoardView({
      routeParams: {
        ...boardPageState.value.primaryViewParams,
        shortLink,
        shortName,
      },
      navigateOptions: {
        trigger: true,
      },
    });
  } else {
    switchCurrentBoardView({
      routeParams: {
        view: 'board',
      },
      navigateOptions: {
        trigger: true,
      },
    });
  }
};
