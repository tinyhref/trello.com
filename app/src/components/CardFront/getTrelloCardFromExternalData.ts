import type { ExternalDragPayload } from '@atlaskit/pragmatic-drag-and-drop/external/adapter';
import type { CardRole } from '@trello/card-roles';

export interface ExternalCardData {
  cardId: string;
  listId: string;
  boardId: string;
  position?: number;
  cardRole?: CardRole;
  previewHeight?: number;
  pinned?: boolean;
  name?: string;
  dueComplete?: boolean;
}

export const getTrelloCardFromExternalData = async function (
  source: ExternalDragPayload,
): Promise<ExternalCardData> {
  const cardString = source.items.filter(
    (item) => item.type === 'application/vnd.trello.card',
  )[0];
  try {
    const card = await new Promise<ExternalCardData>((resolve, reject) => {
      if (!cardString) {
        reject();
      }
      cardString?.getAsString((s) => {
        if (typeof s === 'string') {
          try {
            resolve(JSON.parse(s));
          } catch (e) {
            reject(e);
          }
        }
        reject();
      });
    });

    return card;
  } catch (e) {
    return {
      cardId: '',
      listId: '',
      boardId: '',
    };
  }
};
