import { useCallback } from 'react';

import { intl } from '@trello/i18n';
import { dismissFlag, showFlag } from '@trello/nachos/experimental-flags';
import { throttle } from '@trello/time';
import { isUrl, parseTrelloUrl } from '@trello/urls';

import { attachmentTypeFromUrl } from 'app/scripts/lib/util/url/attachment-type-from-url';
import { useCanAddFileType } from 'app/src/components/BoardListView/useCanAddFileType';
import { useCopyPasteCard } from 'app/src/components/BoardListView/useCopyPasteCard';
import { usePasteUrl } from 'app/src/components/BoardListView/usePasteUrl';

const showRestrictedAttachmentFlag = throttle(() => {
  showFlag({
    id: 'attachment-restricted',
    appearance: 'error',
    title: intl.formatMessage({
      id: 'templates.card_detail.couldnt-attach-link',
      defaultMessage: 'Couldn’t attach link',
      description: 'Error message for a restricted attachment type',
    }),
    description: intl.formatMessage({
      id: 'templates.card_detail.attachments-restricted',
      defaultMessage: 'This attachment type is not allowed by your Enterprise.',
      description: 'Error message for a restricted attachment type',
    }),
  });
}, 5000);

export const usePasteTextOnCard = () => {
  const { pasteCardUrlOnCard } = useCopyPasteCard();
  const { canAddFileType } = useCanAddFileType();
  const { pasteUrlOnCard } = usePasteUrl();

  const canAddUrl = useCallback(
    (url: string) => {
      const attachmentType = attachmentTypeFromUrl(url);
      return canAddFileType(attachmentType);
    },
    [canAddFileType],
  );

  const pasteTextOnCard = useCallback(
    async (pastedText: string, idCard: string) => {
      if (isUrl(pastedText)) {
        const parsedTrelloText = parseTrelloUrl(pastedText);
        if (parsedTrelloText?.type === 'card' && parsedTrelloText?.shortLink) {
          await pasteCardUrlOnCard(pastedText, idCard);
          return;
        } else {
          if (!canAddUrl(pastedText)) {
            showRestrictedAttachmentFlag();
            return;
          }

          showFlag({
            id: 'attachment',
            appearance: 'normal',
            isAutoDismiss: false,
            title: intl.formatMessage({
              id: 'templates.clipboard.attaching-link',
              defaultMessage: 'Attaching link',
              description: 'Flag title for attaching a link',
            }),
          });

          try {
            await pasteUrlOnCard(pastedText, idCard);

            dismissFlag({
              id: 'attachment',
            });
            showFlag({
              id: 'attachment-success',
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
              id: 'attachment',
              appearance: 'error',
              isAutoDismiss: true,
              title: intl.formatMessage({
                id: 'templates.clipboard.unable-to-attach-link',
                defaultMessage: 'Unable to attach link',
                description: 'Error message for attaching a link',
              }),
            });
          }
        }
      }
    },
    [canAddUrl, pasteCardUrlOnCard, pasteUrlOnCard],
  );

  return { pasteTextOnCard };
};
