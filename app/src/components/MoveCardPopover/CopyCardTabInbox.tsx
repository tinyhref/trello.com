import {
  useCallback,
  useState,
  type ChangeEvent,
  type ChangeEventHandler,
  type FunctionComponent,
} from 'react';
import { FormattedMessage } from 'react-intl';

import type { SourceType } from '@trello/analytics-types';
import { useCardId } from '@trello/id-context';
import { Checkbox } from '@trello/nachos/checkbox';
import { useMemberInboxIds } from '@trello/personal-workspace';

import { AutosizeTextarea } from 'app/src/components/AutosizeTextarea';
import { useCurrentCardAttributesFragment } from './CurrentCardFragment.generated';
import { InboxPositionSelector } from './InboxPositionSelector';
import { useSubmitCopy } from './useSubmitCopy';

// eslint-disable-next-line @trello/less-matches-component
import * as styles from './CopyCardTabBoard.module.less';

export interface CopyCardTabInboxProps {
  onClose: () => void;
  source?: SourceType;
}

export const CopyCardTabInbox: FunctionComponent<CopyCardTabInboxProps> = ({
  onClose,
}) => {
  const cardId = useCardId();
  const { submitCopy } = useSubmitCopy();
  const { idBoard: inboxId, idList: inboxListId } = useMemberInboxIds();

  const { data: currentCardData } = useCurrentCardAttributesFragment({
    from: { id: cardId },
    optimistic: true,
  });

  const isMirrorCard = currentCardData?.cardRole === 'mirror';

  // card name
  const [title, setTitle] = useState<string>(currentCardData?.name || '');
  const onTitleChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      setTitle(e.target.value);
    },
    [setTitle],
  );

  // card attributes
  const numChecklists = currentCardData?.checklists?.length;
  const hasChecklists = !!numChecklists;

  const numAttachments = currentCardData?.attachments.length;
  const hasAttachments = !!numAttachments;

  const numComments = currentCardData?.badges.comments;
  const hasComments = !!numComments;

  const [keepChecklists, setKeepChecklists] = useState<boolean>(hasChecklists);
  const onKeepChecklistsChange: ChangeEventHandler<HTMLInputElement> =
    useCallback(() => {
      setKeepChecklists(!keepChecklists);
    }, [setKeepChecklists, keepChecklists]);

  const [keepAttachments, setKeepAttachments] =
    useState<boolean>(hasAttachments);
  const onKeepAttachmentsChange: ChangeEventHandler<HTMLInputElement> =
    useCallback(() => {
      setKeepAttachments(!keepAttachments);
    }, [setKeepAttachments, keepAttachments]);

  const [keepComments, setKeepComments] = useState<boolean>(hasComments);
  const onKeepCommentsChange: ChangeEventHandler<HTMLInputElement> =
    useCallback(() => {
      setKeepComments(!keepComments);
    }, [setKeepComments, keepComments]);

  const onCopy = useCallback(
    async (index: number) => {
      const keepOptions = {
        checklists: keepChecklists,
        attachments: keepAttachments,
        comments: keepComments,
        labels: false,
        customFields: false,
        members: false,
        stickers: false,
      };

      submitCopy(
        inboxId!,
        inboxListId!,
        index,
        title,
        'copyCardInlineInboxDialog',
        keepOptions,
      );
      onClose();
    },
    [
      keepChecklists,
      keepAttachments,
      keepComments,
      onClose,
      inboxId,
      inboxListId,
      title,
      submitCopy,
    ],
  );

  return (
    <>
      {!isMirrorCard && (
        <>
          <div>
            <span className={styles.header}>
              <FormattedMessage
                id="templates.card_copy.name"
                defaultMessage="Name"
                description="Name text area label"
              />
            </span>
          </div>
          <AutosizeTextarea
            value={title}
            onChange={onTitleChange}
            minHeight={72}
            placeholder={currentCardData?.name}
            dir="auto"
            className={styles.titleEditor}
          />
        </>
      )}

      {(hasChecklists || hasAttachments || hasComments) && (
        <h3 className={styles.header}>
          <FormattedMessage
            id="templates.card_copy.keep-ellipsis"
            defaultMessage="Keep…"
            description="Keep… checklist header on copy card popover"
          />
        </h3>
      )}

      <div className={styles.keepChecklist}>
        {hasChecklists && (
          <Checkbox
            label={
              <>
                <FormattedMessage
                  id="templates.card_copy.checklists"
                  defaultMessage="Checklists"
                  description="Keep Checklists checkbox"
                />
                {` (${numChecklists})`}
              </>
            }
            isChecked={keepChecklists}
            onChange={onKeepChecklistsChange}
            className={styles.checklistItem}
          />
        )}

        {hasAttachments && (
          <Checkbox
            label={
              <>
                <FormattedMessage
                  id="templates.card_copy.attachments"
                  defaultMessage="Attachments"
                  description="Keep Attachments checkbox"
                />
                {` (${numAttachments})`}
              </>
            }
            isChecked={keepAttachments}
            onChange={onKeepAttachmentsChange}
            className={styles.checklistItem}
          />
        )}

        {hasComments && (
          <Checkbox
            label={
              <>
                <FormattedMessage
                  id="templates.card_copy.comments"
                  defaultMessage="Comments"
                  description="Keep Comments checkbox"
                />
                {` (${numComments})`}
              </>
            }
            isChecked={keepComments}
            onChange={onKeepCommentsChange}
            className={styles.checklistItem}
          />
        )}
      </div>

      <InboxPositionSelector variation="copy" onAction={onCopy} />
    </>
  );
};
