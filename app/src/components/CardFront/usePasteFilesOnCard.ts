import { useCallback } from 'react';

import { Analytics } from '@trello/atlassian-analytics';
import { intl } from '@trello/i18n';
import { useBoardId } from '@trello/id-context';
import { dismissFlag, showFlag } from '@trello/nachos/experimental-flags';

import { useAddCardAttachmentMutation } from 'app/src/components/BoardListView/AddCardAttachmentMutation.generated';
import { useCanAddFileType } from 'app/src/components/BoardListView/useCanAddFileType';
import { useFileSizeAlert } from 'app/src/components/FileSizeAlert';

export const usePasteFilesOnCard = () => {
  const boardId = useBoardId();
  const { warnIfFileTooLarge } = useFileSizeAlert({ boardId });
  const { canAddFileType } = useCanAddFileType();
  const [addCardAttachment] = useAddCardAttachmentMutation();

  const pasteFilesOnCard = useCallback(
    async (pastedFiles: File[], idCard: string) => {
      // check board/ent file restrictions
      if (!canAddFileType('computer')) {
        showFlag({
          id: 'attachment-restricted',
          appearance: 'error',
          title: intl.formatMessage({
            id: 'templates.card_detail.couldnt-attach-file',
            defaultMessage: 'Couldn’t attach file',
            description: 'Error message for a restricted attachment type',
          }),
          description: intl.formatMessage({
            id: 'templates.card_detail.attachments-restricted',
            defaultMessage:
              'This attachment type is not allowed by your Enterprise.',
            description: 'Error message for a restricted attachment type',
          }),
        });
        return;
      }

      for (const file of pastedFiles) {
        const traceId = Analytics.startTask({
          taskName: 'create-attachment/file',
          source: 'cardViewAttachment',
        });

        // check file size restriction
        if (await warnIfFileTooLarge({ fileSizeInBytes: file.size })) {
          Analytics.taskAborted({
            taskName: 'create-attachment/file',
            source: 'cardViewAttachment',
            traceId,
          });
          continue;
        }

        showFlag({
          appearance: 'normal',
          id: 'upload',
          isAutoDismiss: false,
          title: intl.formatMessage({
            id: 'templates.clipboard.uploading-file',
            defaultMessage: 'Uploading file',
            description: 'Uploading file message',
          }),
          description: intl.formatMessage(
            {
              id: 'templates.clipboard.uploading-fileName',
              defaultMessage: 'Uploading {fileName}',
              description: 'Uploading file error',
            },
            { fileName: file.name },
          ),
        });

        try {
          await addCardAttachment({
            variables: {
              idCard,
              file,
              name: file.name || '',
              mimeType: file.type || '',
            },
            context: {
              traceId,
            },
          });

          Analytics.sendTrackEvent({
            action: 'uploaded',
            actionSubject: 'attachment',
            actionSubjectId: 'fileAttachment',
            source: 'cardViewAttachment',
            attributes: {
              taskId: traceId,
            },
          });

          Analytics.taskSucceeded({
            taskName: 'create-attachment/file',
            source: 'cardViewAttachment',
            traceId,
          });

          dismissFlag({
            id: 'upload',
          });
          showFlag({
            id: 'upload-success',
            appearance: 'success',
            isAutoDismiss: true,
            msTimeout: 3000,
            title: intl.formatMessage({
              id: 'templates.clipboard.success',
              defaultMessage: 'Success',
              description: 'Success message for attaching a link',
            }),
          });
        } catch (error) {
          showFlag({
            appearance: 'error',
            id: 'upload',
            isAutoDismiss: true,
            title: intl.formatMessage({
              id: 'templates.clipboard.unable-to-upload-file',
              defaultMessage: 'Unable to upload file',
              description: 'Uploading file error',
            }),
            description: intl.formatMessage(
              {
                id: 'templates.clipboard.uploading-fileName-failed',
                defaultMessage: 'Uploading {fileName} failed.',
                description: 'Uploading file error',
              },
              { fileName: file.name },
            ),
          });

          Analytics.taskFailed({
            taskName: 'create-attachment/file',
            source: 'cardViewAttachment',
            traceId,
            error,
          });
        }
      }
    },
    [addCardAttachment, canAddFileType, warnIfFileTooLarge],
  );
  return { pasteFilesOnCard };
};
