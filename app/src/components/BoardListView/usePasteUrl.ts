import { useCallback } from 'react';

import { Analytics, formatContainers } from '@trello/atlassian-analytics';
import { useBoardId } from '@trello/id-context';
import { getSmartCardClient } from '@trello/smart-card/smart-card-client';

import { ModelCache } from 'app/scripts/db/ModelCache';
import { sendPluginTrackEvent } from 'app/scripts/lib/plugins/plugin-behavioral-analytics';
import { attachmentTypeFromUrl } from 'app/scripts/lib/util/url/attachment-type-from-url';
import type { List as ListModelType } from 'app/scripts/models/List';
import { pluginRunner } from 'app/scripts/views/internal/plugins/PluginRunner';
import { useIsInboxBoard } from 'app/src/components/Inbox';
import { useAddCardAttachmentMutation } from './AddCardAttachmentMutation.generated';
import { useClipboardAddCardToListMutation } from './ClipboardAddCardToListMutation.generated';
import { useCanAddFileType } from './useCanAddFileType';

export const usePasteUrl = () => {
  const idBoard = useBoardId();
  const isInboxBoard = useIsInboxBoard();
  const [addCardToListMutation] = useClipboardAddCardToListMutation();
  const { canAddFileType } = useCanAddFileType();
  const [addCardAttachmentMutation] = useAddCardAttachmentMutation();

  const getDataFromPlugin = useCallback(
    async (pastedText: string, idList: string) => {
      /**
       * The list model for the inbox board is not available in the cache
       * and so this step will hang indefinitely. We could either add support for inbox
       * in backbone but that feels like a step backwards.
       *
       * Instead we can just return an empty object since we know that inbox boards should
       * not have any plugins enabled.
       */
      if (isInboxBoard) {
        return {};
      }
      const listModelPromise = new Promise<ListModelType>(function (
        resolve,
        reject,
      ) {
        ModelCache.waitFor('List', idList, (err, list) => {
          if (err) {
            return reject(err);
          }
          resolve(list);
        });
      });
      const listModel = await listModelPromise;
      const dataFromPlugin = await pluginRunner
        .one({
          timeout: 2000,
          command: 'card-from-url',
          list: listModel,
          board: listModel.getBoard(),
          options: {
            url: pastedText,
          },
        })
        .catch(Error, () => ({}));
      const { name, desc, idPlugin } = dataFromPlugin as {
        name?: string;
        desc?: string;
        idPlugin?: string;
      };
      return { name, desc, idPlugin };
    },
    [isInboxBoard],
  );

  const pasteUrlOnCard = useCallback(
    async (pastedText: string, idCard: string) => {
      if (!canAddFileType('link')) {
        return;
      }
      const type = attachmentTypeFromUrl(pastedText);
      if (!canAddFileType(type)) {
        return;
      }

      const traceId = Analytics.startTask({
        taskName: 'create-attachment/link',
        source: 'cardViewAttachment',
      });

      try {
        await addCardAttachmentMutation({
          variables: {
            idCard,
            url: pastedText,
          },
          context: {
            traceId,
          },
        });

        Analytics.sendTrackEvent({
          action: 'uploaded',
          actionSubject: 'attachment',
          actionSubjectId: 'linkAttachment',
          source: 'cardViewAttachment',
          attributes: {
            taskId: traceId,
          },
        });

        Analytics.taskSucceeded({
          taskName: 'create-attachment/link',
          source: 'cardViewAttachment',
          traceId,
        });
      } catch (error) {
        Analytics.taskFailed({
          taskName: 'create-attachment/link',
          source: 'cardViewAttachment',
          traceId,
          error,
        });
        throw error;
      }
    },
    [addCardAttachmentMutation, canAddFileType],
  );

  const pasteBoardUrlOnList = useCallback(
    async (pastedText: string, idList: string, pos: number) => {
      const traceId = Analytics.startTask({
        taskName: 'create-card/paste-url',
        source: 'powerUpCardFromUrl',
        containers: formatContainers({
          idBoard,
          idList,
        }),
      });

      try {
        const { data } = await addCardToListMutation({
          variables: {
            idList,
            traceId,
            name: pastedText,
            desc: '',
            pos,
            cardRole: 'board',
          },
        });
        Analytics.taskSucceeded({
          taskName: 'create-card/paste-url',
          traceId,
          source: 'powerUpCardFromUrl',
          containers: formatContainers({
            idBoard,
            idList,
            idCard: data?.createCard?.id,
          }),
        });
        Analytics.sendTrackEvent({
          action: 'created',
          actionSubject: 'card',
          source: 'powerUpCardFromUrl',
          containers: formatContainers({
            idBoard,
            idList,
            idCard: data?.createCard?.id,
          }),
          attributes: {
            taskId: traceId,
          },
        });
      } catch (err) {
        Analytics.taskFailed({
          taskName: 'create-card/paste-url',
          traceId,
          source: 'powerUpCardFromUrl',
          containers: formatContainers({
            idBoard,
            idList,
          }),
          error: err,
        });
      }
    },
    [addCardToListMutation, idBoard],
  );

  const pasteUrlOnList = useCallback(
    async (pastedText: string, idList: string, pos: number) => {
      const smartCardClient = getSmartCardClient();

      const traceId = Analytics.startTask({
        taskName: 'create-card/paste-url',
        source: 'powerUpCardFromUrl',
        containers: formatContainers({
          idBoard,
          idList,
        }),
      });

      try {
        const cardData = await getDataFromPlugin(pastedText, idList);
        if (!cardData.name && !cardData.desc) {
          const resolvedUrl = await smartCardClient
            .fetchData(pastedText)
            .catch(() => {});

          if (resolvedUrl) {
            const { data } = await addCardToListMutation({
              variables: {
                idList,
                traceId,
                name: pastedText,
                desc: '',
                pos,
                cardRole: 'link',
              },
            });
            Analytics.taskSucceeded({
              taskName: 'create-card/paste-url',
              traceId,
              source: 'powerUpCardFromUrl',
              containers: formatContainers({
                idBoard,
                idList,
                idCard: data?.createCard?.id,
              }),
            });
            return;
          }
        }

        const { data } = await addCardToListMutation({
          variables: {
            idList,
            traceId,
            name: cardData.name || '',
            desc: cardData.desc || '',
            pos,
            urlSource: pastedText,
          },
        });

        if (cardData?.idPlugin) {
          sendPluginTrackEvent({
            idPlugin: cardData.idPlugin,
            idBoard,
            idCard: data?.createCard?.id,
            event: {
              action: 'created',
              actionSubject: 'card',
              source: 'powerUpCardFromUrl',
              attributes: {
                taskId: traceId,
              },
            },
          });
        } else {
          Analytics.sendTrackEvent({
            action: 'created',
            actionSubject: 'card',
            source: 'powerUpCardFromUrl',
            containers: formatContainers({
              idBoard,
              idList,
              idCard: data?.createCard?.id,
            }),
            attributes: {
              taskId: traceId,
            },
          });
        }
        Analytics.taskSucceeded({
          taskName: 'create-card/paste-url',
          traceId,
          source: 'powerUpCardFromUrl',
          containers: formatContainers({
            idBoard,
            idList,
            idCard: data?.createCard?.id,
          }),
        });
      } catch (err) {
        Analytics.taskFailed({
          taskName: 'create-card/paste-url',
          traceId,
          source: 'powerUpCardFromUrl',
          containers: formatContainers({
            idBoard,
            idList,
          }),
          error: err,
        });
      }
    },
    [addCardToListMutation, getDataFromPlugin, idBoard],
  );
  return { pasteUrlOnCard, pasteBoardUrlOnList, pasteUrlOnList };
};
