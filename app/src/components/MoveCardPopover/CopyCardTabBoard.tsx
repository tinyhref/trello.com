import type {
  ChangeEvent,
  ChangeEventHandler,
  FunctionComponent,
  KeyboardEventHandler,
} from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import type { SourceType } from '@trello/analytics-types';
import { Analytics, formatContainers } from '@trello/atlassian-analytics';
import { useBoardId, useCardId, useListId } from '@trello/id-context';
import { getKey, Key } from '@trello/keybindings';
import { Checkbox } from '@trello/nachos/checkbox';
import type { CardCopyMenuTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { AutosizeTextarea } from 'app/src/components/AutosizeTextarea';
import { BoardListPositionSelect } from './BoardListPositionSelect';
import { useCurrentCardAttributesFragment } from './CurrentCardFragment.generated';

import * as styles from './CopyCardTabBoard.module.less';

export interface CopyCardTabBoardProps {
  onClose: () => void;
  source?: SourceType;
}

export const CopyCardTabBoard: FunctionComponent<CopyCardTabBoardProps> = ({
  onClose,
  source,
}) => {
  const cardId = useCardId();
  const boardId = useBoardId();
  const listId = useListId();

  const { data: currentCardData } = useCurrentCardAttributesFragment({
    from: { id: cardId },
    optimistic: true,
  });

  const isMirrorCard = currentCardData?.cardRole === 'mirror';

  const textareaElement = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (textareaElement.current) {
      const timeoutId = setTimeout(() => textareaElement.current!.focus(), 1);
      textareaElement.current!.select();
      return () => clearTimeout(timeoutId);
    }
  }, []);

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

  const numLabels = currentCardData?.idLabels.length;
  const hasLabels = !!numLabels;

  const numMembers = currentCardData?.idMembers.length;
  const hasMembers = !!numMembers;

  const numAttachments = currentCardData?.attachments.length;
  const hasAttachments = !!numAttachments;

  const numComments = currentCardData?.badges.comments;
  const hasComments = !!numComments;

  const numCustomFields = currentCardData?.customFieldItems?.length;
  const hasCustomFields = !!numCustomFields;

  const numStickers = currentCardData?.stickers.length;
  const hasStickers = !!numStickers;

  const renderKeepChecklist =
    hasChecklists ||
    hasLabels ||
    hasMembers ||
    hasAttachments ||
    hasComments ||
    hasCustomFields ||
    hasStickers;

  const [keepChecklists, setKeepChecklists] = useState<boolean>(hasChecklists);
  const onKeepChecklistsChange: ChangeEventHandler<HTMLInputElement> =
    useCallback(() => {
      setKeepChecklists(!keepChecklists);
    }, [setKeepChecklists, keepChecklists]);

  const [keepLabels, setKeepLabels] = useState<boolean>(hasLabels);
  const onKeepLabelsChange: ChangeEventHandler<HTMLInputElement> =
    useCallback(() => {
      setKeepLabels(!keepLabels);
    }, [setKeepLabels, keepLabels]);

  const [keepMembers, setKeepMembers] = useState<boolean>(hasMembers);
  const onKeepMembersChange: ChangeEventHandler<HTMLInputElement> =
    useCallback(() => {
      setKeepMembers(!keepMembers);
    }, [setKeepMembers, keepMembers]);

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

  const [keepCustomFields, setKeepCustomFields] =
    useState<boolean>(hasCustomFields);
  const onKeepCustomFieldsChange: ChangeEventHandler<HTMLInputElement> =
    useCallback(() => {
      setKeepCustomFields(!keepCustomFields);
    }, [setKeepCustomFields, keepCustomFields]);

  const [keepStickers, setKeepStickers] = useState<boolean>(hasStickers);
  const onKeepStickersChange: ChangeEventHandler<HTMLInputElement> =
    useCallback(() => {
      setKeepStickers(!keepStickers);
    }, [setKeepStickers, keepStickers]);

  const keepOptions = useMemo(() => {
    if (!renderKeepChecklist) {
      return undefined;
    }

    return {
      checklists: keepChecklists,
      labels: keepLabels,
      members: keepMembers,
      attachments: keepAttachments,
      comments: keepComments,
      customFields: keepCustomFields,
      stickers: keepStickers,
    };
  }, [
    renderKeepChecklist,
    keepChecklists,
    keepLabels,
    keepMembers,
    keepAttachments,
    keepComments,
    keepCustomFields,
    keepStickers,
  ]);

  const copyCardInlineDialog = 'copyCardInlineDialog';
  const copyCardSource = source || copyCardInlineDialog;

  useEffect(() => {
    Analytics.sendScreenEvent({
      name: copyCardInlineDialog,
      containers: formatContainers({ boardId, cardId, listId }),
      attributes: {
        cardIsTemplate: currentCardData?.isTemplate,
        cardIsClosed: currentCardData?.closed,
        isModernizedCopyCardPopover: true,
      },
    });
  }, [
    boardId,
    cardId,
    listId,
    currentCardData?.isTemplate,
    currentCardData?.closed,
  ]);

  const onKeyDown = useCallback<KeyboardEventHandler<HTMLTextAreaElement>>(
    (e) => {
      const key = getKey(e);
      switch (key) {
        case Key.Enter:
          e.preventDefault();
          return;
        default:
          // Stop propagation of all other keys. This effectively enables keys
          // that are caught by components higher in the stack, like CardFront,
          // which would otherwise prevent default on shortcut keys like `e`.
          e.stopPropagation();
          return;
      }
    },
    [],
  );

  return (
    <>
      {!isMirrorCard && (
        <>
          <div>
            <label htmlFor="card-copy-name" className={styles.header}>
              <FormattedMessage
                id="templates.card_copy.name"
                defaultMessage="Name"
                description="Name text area label"
              />
            </label>
          </div>
          <AutosizeTextarea
            id="card-copy-name"
            value={title}
            onChange={onTitleChange}
            ref={textareaElement}
            minHeight={72}
            placeholder={currentCardData?.name}
            onKeyDown={onKeyDown}
            dir="auto"
            className={styles.titleEditor}
            testId={getTestId<CardCopyMenuTestIds>('card-copy-textarea')}
          />
        </>
      )}

      {renderKeepChecklist && (
        <>
          <h3 className={styles.header}>
            <FormattedMessage
              id="templates.card_copy.keep-ellipsis"
              defaultMessage="Keep…"
              description="Keep… checklist header on copy card popover"
            />
          </h3>
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
            {hasLabels && (
              <Checkbox
                label={
                  <>
                    <FormattedMessage
                      id="templates.card_copy.labels"
                      defaultMessage="Labels"
                      description="Keep Labels checkbox"
                    />
                    {` (${numLabels})`}
                  </>
                }
                isChecked={keepLabels}
                onChange={onKeepLabelsChange}
                className={styles.checklistItem}
              />
            )}
            {hasMembers && (
              <Checkbox
                label={
                  <>
                    <FormattedMessage
                      id="templates.card_copy.members"
                      defaultMessage="Members"
                      description="Keep Members checkbox"
                    />
                    {` (${numMembers})`}
                  </>
                }
                isChecked={keepMembers}
                onChange={onKeepMembersChange}
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
            {hasCustomFields && (
              <Checkbox
                label={
                  <>
                    <FormattedMessage
                      id="templates.card_copy.custom-fields"
                      defaultMessage="Custom Fields"
                      description="Keep Custom Fields checkbox"
                    />
                    {` (${numCustomFields})`}
                  </>
                }
                isChecked={keepCustomFields}
                onChange={onKeepCustomFieldsChange}
                className={styles.checklistItem}
              />
            )}
            {hasStickers && (
              <Checkbox
                label={
                  <>
                    <FormattedMessage
                      id="templates.card_copy.stickers"
                      defaultMessage="Stickers"
                      description="Keep Stickers checkbox"
                    />
                    {` (${numStickers})`}
                  </>
                }
                isChecked={keepStickers}
                onChange={onKeepStickersChange}
                className={styles.checklistItem}
              />
            )}
          </div>
        </>
      )}
      <div className={styles.popoverSection}>
        <h3 className={styles.header}>
          <FormattedMessage
            id="templates.card_copy.copy-to-ellipsis"
            defaultMessage="Copy to…"
            description="Copy to… header on copy card popover"
          />
        </h3>
        <BoardListPositionSelect
          isCopy={true}
          onClose={onClose}
          source={copyCardSource}
          title={title}
          keepOptions={keepOptions}
        />
      </div>
    </>
  );
};
