import { useCallback } from 'react';

import { Analytics, formatContainers } from '@trello/atlassian-analytics';
import { intl } from '@trello/i18n';
import { useBoardId } from '@trello/id-context';
import { dismissFlag, showFlag } from '@trello/nachos/experimental-flags';

import { useClipboardAddCardFromFileMutation } from 'app/src/components/BoardListView/ClipboardAddCardFromFileMutation.generated';
import { useCanAddFileType } from 'app/src/components/BoardListView/useCanAddFileType';
import { useFileSizeAlert } from 'app/src/components/FileSizeAlert';
import { readListVisibleCardsFromCache } from './readListVisibleCardsFromCache';
import { useIsOverCardLimits } from './useIsOverCardLimits';

const pastedFileName = () => {
  const date = new Date();
  const dateString: string = date.toLocaleDateString(undefined, {
    dateStyle: 'short',
  });
  const timeString: string = date.toLocaleTimeString(undefined, {
    timeStyle: 'medium',
  });
  const name = intl.formatMessage(
    {
      id: 'templates.clipboard.pasted-file-name',
      defaultMessage: 'upload {dateString} at {timeString}',
      description: 'The name of the file pasted on the list',
    },
    {
      dateString,
      timeString,
    },
  );
  return name;
};

export const usePasteFilesOnList = () => {
  const boardId = useBoardId();

  const [addCardFromFileMutation] = useClipboardAddCardFromFileMutation();
  const { warnIfFileTooLarge } = useFileSizeAlert({ boardId });
  const { isOverCardLimits } = useIsOverCardLimits();
  const { canAddFileType } = useCanAddFileType();

  const pasteFileOnList = useCallback(
    async (file: File, idList: string, pos: number) => {
      const name = file.name || pastedFileName();
      const traceId = Analytics.startTask({
        taskName: 'create-card/paste-file',
        source: 'cardFromClipboard',
      });

      showFlag({
        appearance: 'normal',
        id: 'upload',
        isAutoDismiss: false,
        title: intl.formatMessage({
          id: 'templates.clipboard.uploading-file',
          defaultMessage: 'Uploading file',
          description: 'Message displayed while uploading a file',
        }),
        description: intl.formatMessage(
          {
            id: 'templates.clipboard.uploading-fileName',
            defaultMessage: 'Uploading {fileName}',
            description: 'Message details when uploading a file',
          },
          { fileName: name },
        ),
      });

      try {
        const { data } = await addCardFromFileMutation({
          variables: {
            idList,
            traceId,
            name,
            pos,
            file,
          },
        });
        Analytics.taskSucceeded({
          taskName: 'create-card/paste-file',
          traceId,
          source: 'cardFromClipboard',
        });
        Analytics.sendTrackEvent({
          action: 'created',
          actionSubject: 'card',
          source: 'cardFromClipboard',
          containers: formatContainers({
            boardId,
            idList,
            idCard: data?.createCardFromFile?.id,
          }),
          attributes: {
            taskId: traceId,
          },
        });
        dismissFlag({
          id: 'upload',
        });
      } catch (err) {
        showFlag({
          appearance: 'error',
          id: 'upload',
          isAutoDismiss: true,
          title: intl.formatMessage({
            id: 'templates.clipboard.unable-to-upload-file',
            defaultMessage: 'Unable to upload file',
            description: 'Error message shown when unable to upload file',
          }),
          description: intl.formatMessage(
            {
              id: 'templates.clipboard.uploading-fileName-failed',
              defaultMessage: 'Uploading {fileName} failed.',
              description: 'Error message details when unable to upload file',
            },
            { fileName: name },
          ),
        });

        Analytics.taskFailed({
          taskName: 'create-card/paste-file',
          traceId,
          error: err,
          source: 'cardFromClipboard',
        });
        return;
      }
    },
    [addCardFromFileMutation, boardId],
  );

  const pasteFilesOnList = useCallback(
    async (files: File[], idList: string) => {
      const cards = readListVisibleCardsFromCache({
        listId: idList,
        boardId,
      });

      const pos = (idList && cards?.at(-1)?.pos) || 0;

      // show error if at limits
      if (isOverCardLimits(idList)) {
        return;
      }
      // check board/ent file restrictions
      if (!canAddFileType('computer')) {
        return;
      }

      for (const file of files) {
        // check file size restriction
        if (await warnIfFileTooLarge({ fileSizeInBytes: file.size })) {
          continue;
        }
        await pasteFileOnList(file, idList, pos);
      }
    },
    [
      canAddFileType,
      isOverCardLimits,
      boardId,
      pasteFileOnList,
      warnIfFileTooLarge,
    ],
  );

  return { pasteFileOnList, pasteFilesOnList };
};
