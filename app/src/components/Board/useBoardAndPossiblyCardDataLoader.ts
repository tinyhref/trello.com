import type { ApolloQueryResult } from '@apollo/client';
// eslint-disable-next-line no-restricted-imports
import Bluebird from 'bluebird';
import { useEffect, useRef } from 'react';

import { Analytics } from '@trello/atlassian-analytics';
import { ApiError } from '@trello/error-handling';
import { dangerouslyGetFeatureGateSync } from '@trello/feature-gate-client';
import { client } from '@trello/graphql';
import { idCache, isShortLink } from '@trello/id-cache';
import { getScreenFromUrl } from '@trello/marketing-screens';
import {
  getPreloadHashKey,
  runGraphqlQuickloadQuery,
  waitForQuickloadPreload,
} from '@trello/quickload';
import type { TrelloBoardMirrorCardsQuery } from '@trello/quickload';
import { isActiveRoute, routerState, type RouterState } from '@trello/router';
import { navigationState } from '@trello/router/router-link';
import { RouteId, type RouteIdType } from '@trello/router/routes';

import { getUpToDateModel } from 'app/scripts/db/getUpToDateModel';
import { ModelLoader } from 'app/scripts/db/model-loader';
import { ModelCache } from 'app/scripts/db/ModelCache';
import type { Board } from 'app/scripts/models/Board';
import type { Card } from 'app/scripts/models/Card';
import {
  isNativeCurrentBoardInfoEnabled,
  subscribeToNativeCurrentBoardInfo,
} from 'app/src/components/App/isNativeCurrentBoardInfoEnabled';
import {
  isNativeCurrentBoardListsCardsEnabled,
  subscribeToNativeCurrentBoardListsCards,
} from 'app/src/components/App/isNativeCurrentBoardListsCardsEnabled';
import { legacyBoardModelsSharedState } from './legacyBoardModelsSharedState';
import { viewBoardTaskState } from './viewBoardTaskState';

const extractReasonFromApiError = (err: Error) =>
  err?.name?.replace(/^API::/, '');

const awaitModelCacheWaitForId = (model: Board | Card) => {
  return new Promise((resolve) => {
    return ModelCache.waitForId(model, resolve);
  });
};

const getUrlImageType = (url: string | undefined) => {
  try {
    if (!url) {
      return { hasImage: false, imageType: null };
    }
    const validExtensions = ['webp', 'png', 'jpg', 'jpeg', 'gif', 'bmp'];
    const imageParts = url.split('.');
    const imageExtension = imageParts[imageParts.length - 1];
    if (!imageExtension) {
      return { hasImage: true, imageType: 'unknown' };
    }
    const imageType =
      validExtensions.indexOf(imageExtension) !== -1
        ? imageExtension
        : 'unknown';
    return { hasImage: true, imageType };
  } catch {
    return { hasImage: false, imageType: 'error' };
  }
};

/**
 * Hook responsible for loading board and card data depending on initial route. It also handles
 * loading view data if applicable.
 * The reason this hook exists instead of one for board and one for card, is that it is complex
 * to manage loading a card route directly and waiting for card data to be resolved from server
 * before starting the board data request (since the board data request requires idBoard from card).
 * Ie, loading board is /b/shortLink and card is /c/shortLink, where its either the shortLink for the
 * board or the card.
 * Note, eventually all this should be done with Native GraphQL and useQuery or useBackgroundQuery,
 * but right now it uses ModelLoader.
 */
export function useBoardAndPossiblyCardDataLoader() {
  const lastPathname = useRef<string | null>(null);

  useEffect(() => {
    let cancelLoadBoardInfoPromise = () => {};
    let cancelLoadBoardListsCardsPromise = () => {};
    let cancelLoadCardPromise = () => {};

    const handleRouteChange = (route: RouterState<RouteIdType>) => {
      const isBoardRoute = isActiveRoute(route, RouteId.BOARD);
      const isCardRoute = isActiveRoute(route, RouteId.CARD);
      const isInviteAcceptBoardRoute = isActiveRoute(
        route,
        RouteId.INVITE_ACCEPT_BOARD,
      );
      if (!(isBoardRoute || isCardRoute || isInviteAcceptBoardRoute)) {
        return;
      }

      // We changed search parameters or something we don't need to worry about
      if (lastPathname.current === route.location.pathname) {
        return;
      }

      lastPathname.current = route.location.pathname;

      const lastBoard = legacyBoardModelsSharedState.value.board.model;
      const lastBoardId = lastBoard?.get('id') ?? null;
      const lastBoardShortLink = lastBoard?.get('shortLink') ?? null;

      if (
        lastBoardShortLink === null ||
        // If we are navigating to a different board, reset the board state;
        // otherwise, if we are navigating within the board (e.g. to a card),
        // persist the board state, and only reset the card state.
        (isBoardRoute && lastBoardShortLink !== route.params.shortLink)
      ) {
        legacyBoardModelsSharedState.setValue({
          card: {
            model: null,
            loading: isCardRoute,
            error: null,
          },
          board: {
            model: null,
            loading: true,
            error: null,
          },
        });
      } else {
        /**
         * Here we are navigating from an already initialized state.
         * Reset the card state and load the new data
         */
        legacyBoardModelsSharedState.setValue({
          card: {
            model: null,
            loading: isCardRoute,
            error: null,
          },
        });
      }

      navigationState.setValue({
        isNavigating: true,
      });

      const loadBoardData = (boardIdOrShortLink: string) => {
        // This is expected to exist because useViewBoardVitalStats runs before this function
        const traceId = viewBoardTaskState.value.traceId!;
        const startTime = Date.now();
        const boardShortLink = isShortLink(boardIdOrShortLink)
          ? boardIdOrShortLink
          : idCache.__getBoardShortLinkById__DO_NOT_USE(boardIdOrShortLink);
        const isBoardCached = !!getUpToDateModel('Board', boardIdOrShortLink);

        if (isBoardRoute && route.params?.view === 'calendar') {
          ModelLoader.loadBoardChecklists(boardIdOrShortLink, traceId)
            // It's possible the API request will fail due to there being too
            // many checklists - in this case it's better to at least show them
            // their cards instead of giving them a "Board not found" error
            // @ts-expect-error TS(2554): Expected 0-1 arguments, but got 2.
            .catch(ApiError, function () {});
        }

        const boardInfoPromise = ModelLoader.loadCurrentBoardInfo(
          boardIdOrShortLink,
          traceId,
        );

        // TrelloCurrentBoardInfo can handle shortLinks only
        if (boardShortLink) {
          runGraphqlQuickloadQuery({
            operationName: 'TrelloCurrentBoardInfo',
            variables: {
              id: boardShortLink,
            },
            shouldSkip: () => !isNativeCurrentBoardInfoEnabled(),
          });

          runGraphqlQuickloadQuery({
            operationName: 'TrelloCurrentBoardListsCards',
            variables: {
              id: boardShortLink,
            },
            shouldSkip: () => !isNativeCurrentBoardListsCardsEnabled(),
          });

          const mirrorCardsResult = runGraphqlQuickloadQuery({
            operationName: 'TrelloBoardMirrorCards',
            variables: {
              id: boardShortLink,
            },
            shouldSkip: () => false,
            returnErrors: true,
          });

          const shouldUseMirrorQuickloadErrors = dangerouslyGetFeatureGateSync(
            'ghost_use_mirror_quickload_errors',
          );
          const setAccessRestrictedMirrorCards = (
            item: ApolloQueryResult<TrelloBoardMirrorCardsQuery>,
          ) => {
            if (item?.errors) {
              item.errors.forEach((error) => {
                if (error.message === 'Board not accessible') {
                  const edgeNumber = error?.path?.[4];
                  if (edgeNumber !== undefined) {
                    const mirrorCard =
                      item?.data?.trello?.boardMirrorCardInfo?.mirrorCards
                        ?.edges?.[edgeNumber as number];
                    client.cache.modify({
                      id: client.cache.identify({
                        id: mirrorCard?.node?.id,
                        __typename: 'TrelloMirrorCard',
                      }),
                      fields: {
                        sourceCard: () => {
                          return {
                            __typename: 'TrelloCard',
                            objectId: '000000000000000000000000',
                          };
                        },
                      },
                      optimistic: true,
                    });
                  }
                }
              });
            }
          };
          if (shouldUseMirrorQuickloadErrors) {
            const preloadKey = getPreloadHashKey({
              url: '',
              graphQLPayload: {
                operationName: 'TrelloBoardMirrorCards',
                variables: {
                  id: boardShortLink,
                },
              },
            });
            const preloadObject = waitForQuickloadPreload(preloadKey);
            preloadObject
              .then((result) => {
                const data =
                  result as unknown as ApolloQueryResult<TrelloBoardMirrorCardsQuery>[];
                if (data?.length) {
                  data.forEach(setAccessRestrictedMirrorCards);
                }
              })
              .catch((err) => {
                if (err === 'Preload URL was never called') {
                  mirrorCardsResult.then((result) => {
                    if (result) {
                      setAccessRestrictedMirrorCards(result);
                    }
                  });
                }
              });
          }

          // If the config is currently off, we should subscribe to changes in case it turns on.
          // Since this config is evaluated early, it's possible that the true value hasn't been set yet.
          // In the event that it's actually true but incorrectly evaluated as false, we should still make
          // this request.
          if (!isNativeCurrentBoardInfoEnabled()) {
            const unsubscribe = subscribeToNativeCurrentBoardInfo(
              (current?: boolean) => {
                if (current) {
                  runGraphqlQuickloadQuery({
                    operationName: 'TrelloCurrentBoardInfo',
                    variables: {
                      id: boardShortLink,
                    },
                    shouldSkip: () => false,
                  });

                  // Unsubscribe after the first time the flag is true
                  unsubscribe();
                }
              },
            );
          }

          if (!isNativeCurrentBoardListsCardsEnabled()) {
            const unsubscribe = subscribeToNativeCurrentBoardListsCards(
              (current?: boolean) => {
                if (current) {
                  runGraphqlQuickloadQuery({
                    operationName: 'TrelloCurrentBoardListsCards',
                    variables: {
                      id: boardShortLink,
                    },
                    shouldSkip: () => false,
                  });

                  // Unsubscribe after the first time the flag is true
                  unsubscribe();
                }
              },
            );
          }
        }

        const boardListsCardsPromise = ModelLoader.loadCurrentBoardListsCards(
          boardIdOrShortLink,
          traceId,
        );

        Bluebird.all([boardInfoPromise, boardListsCardsPromise])
          .then((boards) => {
            awaitModelCacheWaitForId(boards[0]);
            return boards;
          })
          .then((boards) => {
            // By the time the Promise.all resolves, the boards will be identical
            // and we can just pick the first one.
            const board = boards[0];
            const { hasImage, imageType } = getUrlImageType(
              board.attributes?.prefs?.backgroundImageScaled?.[0].url,
            );
            const loadDuration = Date.now() - startTime;
            Analytics.sendOperationalEvent({
              action: 'loaded',
              actionSubject: 'board',
              containers: {
                board: {
                  id: board.id,
                },
              },
              attributes: {
                loadDuration,
                isBoardCached,
                hasImage,
                imageType,
              },
              source: getScreenFromUrl(),
            });

            legacyBoardModelsSharedState.setValue({
              board: {
                loading: false,
                error: null,
                model: board,
              },
            });
          })
          .catch(ApiError.Unconfirmed, () => {
            legacyBoardModelsSharedState.setValue({
              board: {
                loading: false,
                error: {
                  name: 'ConfirmToView',
                },
                model: null,
              },
            });
          })
          .catch(ApiError.Server, (err: Error) => {
            legacyBoardModelsSharedState.setValue({
              board: {
                loading: false,
                error: {
                  name: 'ServerError',
                  message: err.message,
                },
                model: null,
              },
            });
          })
          .catch(ApiError, (err: Error) => {
            const reason = extractReasonFromApiError(err);
            legacyBoardModelsSharedState.setValue({
              board: {
                loading: false,
                error: {
                  name: 'BoardNotFound',
                  message: reason,
                },
                model: null,
              },
            });
          })
          .finally(() => {
            navigationState.setValue({
              isNavigating: false,
            });
          });

        cancelLoadBoardInfoPromise =
          boardInfoPromise.cancel.bind(boardInfoPromise);
        cancelLoadBoardListsCardsPromise = boardListsCardsPromise.cancel.bind(
          boardListsCardsPromise,
        );
      };

      if (isCardRoute) {
        const promise = ModelLoader.loadCardData(route.params.shortLink, null)
          .then((card) => {
            awaitModelCacheWaitForId(card);
            return card;
          })
          .then((card) => {
            const nextState: Parameters<
              typeof legacyBoardModelsSharedState.setValue
            >[0] = {
              card: {
                model: card,
                error: null,
                loading: false,
              },
            };

            if (lastBoardId) {
              if (lastBoardId !== card.get('idBoard')) {
                nextState.board = {
                  model: null,
                  loading: true,
                  error: null,
                };
              }
            }

            legacyBoardModelsSharedState.setValue(nextState);

            loadBoardData(card.get('idBoard'));
          })
          .catch(ApiError, (err) => {
            const message = extractReasonFromApiError(err);
            legacyBoardModelsSharedState.setValue({
              card: {
                loading: false,
                error: {
                  name: 'CardNotFound',
                  message,
                },
                model: null,
              },
            });
            navigationState.setValue({
              isNavigating: false,
            });
          });

        cancelLoadCardPromise = promise.cancel.bind(promise);
      } else if (isInviteAcceptBoardRoute && lastBoardId) {
        loadBoardData(lastBoardId);
      } else if (isBoardRoute) {
        loadBoardData(route.params.shortLink);
      }
    };

    const unsubscribe = routerState.subscribe(handleRouteChange);
    handleRouteChange(routerState.value);

    return () => {
      unsubscribe();
      cancelLoadBoardInfoPromise();
      cancelLoadBoardListsCardsPromise();
      cancelLoadCardPromise();
      legacyBoardModelsSharedState.reset();
    };
  }, []);
}
