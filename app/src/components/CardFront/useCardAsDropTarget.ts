import { useCallback, useContext, useEffect } from 'react';

import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { Analytics, formatContainers } from '@trello/atlassian-analytics';
import { optimisticIdManager } from '@trello/graphql';
import { useBoardId, useCardId, useListId } from '@trello/id-context';
import type { Card } from '@trello/model-types';

import { MemberState } from 'app/scripts/view-models/MemberState';
import { useCardCover } from 'app/src/components/CardCover';
import { isDraggableSticker } from 'app/src/components/StickerPicker/Sticker';
import { useAddMemberToCardShortcutMutation } from './AddMemberToCardShortcutMutation.generated';
import { useAddStickerToCardMutation } from './AddStickerToCardMutation.generated';
import { CardFrontContext } from './CardFrontContext';
import { getDroppableStickerPosition } from './getDroppableStickerPosition';
import { isDraggableMember } from './useDraggableMemberAvatar';

const STICKERS_CONTAINER_HEIGHT = 64;
const STICKERS_IMAGE_COVER_HEIGHT = 260;
const DETAILS_DEFAULT_HEIGHT = 36;

export function useCardAsDropTarget(
  stickerCount: number,
  stickerLimit: number,
  cardDetailsRef?: React.RefObject<HTMLDivElement>,
) {
  const { cardType, cardFrontRef } = useContext(CardFrontContext);
  const cardId = useCardId();
  const boardId = useBoardId();
  const listId = useListId();
  const [addMemberToCardShortcutMutation] =
    useAddMemberToCardShortcutMutation();
  const { hasImageCover, isFullCover, calculatedCoverHeight } = useCardCover();

  const getStickerContainerHeight = useCallback(() => {
    const cardDetailsHeight =
      cardDetailsRef?.current?.getBoundingClientRect().height ??
      DETAILS_DEFAULT_HEIGHT;
    if (!hasImageCover) {
      return STICKERS_CONTAINER_HEIGHT;
    }
    if (isFullCover) {
      return (
        (calculatedCoverHeight ?? STICKERS_IMAGE_COVER_HEIGHT) -
        cardDetailsHeight
      );
    }
    return calculatedCoverHeight ?? STICKERS_IMAGE_COVER_HEIGHT;
  }, [calculatedCoverHeight, cardDetailsRef, hasImageCover, isFullCover]);

  const [addSticker] = useAddStickerToCardMutation();
  const canAddStickers = stickerCount < stickerLimit;

  useEffect(() => {
    if (!cardFrontRef.current) {
      return;
    }

    return dropTargetForElements({
      element: cardFrontRef.current,
      onDrop: async ({ source, location }) => {
        if (
          isDraggableMember(source.data) &&
          !source.data.isDeactivated &&
          cardType === 'default'
        ) {
          const traceId = Analytics.startTask({
            taskName: 'edit-card/idMembers',
            source: 'cardView',
          });
          try {
            await addMemberToCardShortcutMutation({
              variables: {
                idMember: source.data.memberId,
                cardId,
                traceId,
              },
            });
            Analytics.taskSucceeded({
              taskName: 'edit-card/idMembers',
              source: 'cardView',
              traceId,
            });
          } catch (e) {
            Analytics.taskFailed({
              taskName: 'edit-card/idMembers',
              source: 'cardView',
              traceId,
              error: e,
            });
          }
        } else if (
          isDraggableSticker(source.data) &&
          canAddStickers // Cannot add a sticker when we reach the sticker limit on a card
        ) {
          const stickerOffset = {
            top: location.current.input.clientY,
            left: location.current.input.clientX,
          };

          const { image, imageUrl, imageScaled, rotate, top, left, zIndex } =
            getDroppableStickerPosition(
              cardFrontRef,
              source.data,
              stickerOffset,
              getStickerContainerHeight,
              stickerCount,
            );

          // Add a sticker to card
          const taskName = 'edit-card/stickers';
          const analyticSource = 'cardView';
          const traceId = Analytics.startTask({
            taskName,
            source: analyticSource,
            attributes: {
              action: 'added',
            },
          });

          try {
            const optimisticId =
              optimisticIdManager.generateOptimisticId('Sticker');

            await addSticker({
              variables: {
                cardId,
                image,
                imageUrl,
                left,
                rotate,
                top,
                zIndex,
              },
              optimisticResponse: {
                __typename: 'Mutation',
                addStickerToCard: {
                  __typename: 'Sticker',
                  id: optimisticId,
                  image,
                  imageScaled,
                  imageUrl,
                  left,
                  rotate,
                  top,
                  zIndex: stickerCount + 1,
                },
              },
              update(cache, result) {
                const newSticker = result.data?.addStickerToCard;

                if (!newSticker) {
                  return;
                }

                if (newSticker.id !== optimisticId) {
                  optimisticIdManager.resolveId(optimisticId, newSticker.id);
                }

                cache.modify<Card>({
                  id: cache.identify({ id: cardId, __typename: 'Card' }),
                  fields: {
                    stickers(currentStickers = [], { readField, toReference }) {
                      // Safety check - if the new sticker is already present in
                      // the cache, we don't need to add it again.
                      if (
                        currentStickers.some(
                          (ref) => readField('id', ref) === newSticker.id,
                        )
                      ) {
                        return currentStickers;
                      }
                      const stickerRef = toReference(newSticker);
                      if (!stickerRef) {
                        return currentStickers;
                      }
                      return [...currentStickers, stickerRef];
                    },
                  },
                });
              },
            });

            Analytics.taskSucceeded({
              taskName,
              source: analyticSource,
              traceId,
            });

            Analytics.sendUpdatedCardFieldEvent({
              field: 'stickers',
              source: analyticSource,
              containers: formatContainers({ cardId, boardId, listId }),
              attributes: {
                taskId: traceId,
                image,
                imageUrl,
                useAnimatedStickers: MemberState.getUseAnimatedStickers(),
              },
            });
          } catch (err) {
            Analytics.taskFailed({
              taskName,
              source: analyticSource,
              traceId,
              error: err,
            });
          }
        }
      },
    });
  }, [
    addMemberToCardShortcutMutation,
    cardId,
    cardFrontRef,
    stickerCount,
    stickerLimit,
    getStickerContainerHeight,
    addSticker,
    boardId,
    listId,
    canAddStickers,
    cardType,
  ]);
}
