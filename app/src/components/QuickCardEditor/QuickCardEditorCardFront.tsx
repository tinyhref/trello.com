import cx from 'classnames';
import type {
  ChangeEventHandler,
  FocusEventHandler,
  FormEventHandler,
  FunctionComponent,
  KeyboardEventHandler,
} from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { ActionHistory } from '@trello/action-history';
import { Analytics, formatContainers } from '@trello/atlassian-analytics';
import {
  useBoardId,
  useCardId,
  useListId,
  useWorkspaceId,
} from '@trello/id-context';
import { getKey, Key } from '@trello/keybindings';
import { getScreenFromUrl } from '@trello/marketing-screens';
import { Button } from '@trello/nachos/button';
import { showFlag } from '@trello/nachos/experimental-flags';
import type { QuickCardEditorTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { AutosizeTextarea } from 'app/src/components/AutosizeTextarea';
import { CardFrontCover } from 'app/src/components/CardFront/CardFrontCover';
import { CardFrontLabels } from 'app/src/components/CardFront/CardFrontLabels';
import { CardFrontMembers } from 'app/src/components/CardFront/CardFrontMembers';
import { CardFrontBadges } from 'app/src/components/CardFrontBadges';
import { useQuickCardEditorCardFrontFragment } from './QuickCardEditorCardFrontFragment.generated';
import { useQuickEditUpdateCardNameMutation } from './QuickEditUpdateCardNameMutation.generated';

import * as styles from './QuickCardEditorCardFront.module.less';

interface QuickEditCardProps {
  width?: number;
  onClose: () => void;
}

export const QuickCardEditorCardFront: FunctionComponent<
  QuickEditCardProps
> = ({ onClose, width = 248 }) => {
  const cardId = useCardId();
  const boardId = useBoardId();
  const workspaceId = useWorkspaceId();
  const listId = useListId();

  const intl = useIntl();

  const { data } = useQuickCardEditorCardFrontFragment({
    from: { id: cardId },
    optimistic: true,
  });

  useEffect(() => {
    Analytics.sendScreenEvent({
      name: 'quickCardEditorInlineDialog',
      attributes: {
        view: getScreenFromUrl(),
        cardRole: data?.cardRole,
      },
      containers: formatContainers({
        idCard: cardId,
        idBoard: boardId,
        workspaceId,
      }),
    });
  }, [cardId, boardId, workspaceId, data?.cardRole]);
  const [name, setName] = useState(data?.name);

  // Restore name from cache when it's resolved.
  useEffect(() => {
    if (typeof name === 'undefined' && data?.name) {
      setName(data.name);
    }
  }, [data?.name, name]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const onChange = useCallback<ChangeEventHandler<HTMLTextAreaElement>>((e) => {
    setName(e.target.value);
  }, []);

  const [updateCardName] = useQuickEditUpdateCardNameMutation();
  const updateName = useCallback(async () => {
    if (!name?.trim()) {
      textareaRef.current?.focus();
      textareaRef.current?.select();
      return;
    }

    if (name === data?.name) {
      onClose();
      return;
    }

    const traceId = Analytics.startTask({
      taskName: 'edit-card/name',
      source: 'quickCardEditorInlineDialog',
    });

    try {
      const updateCardNamePromise = updateCardName({
        variables: { cardId, name, traceId },
        optimisticResponse: {
          __typename: 'Mutation',
          updateCardName: {
            __typename: 'Card',
            id: cardId,
            name,
          },
        },
      });

      // Close the overlay optimistically:
      onClose();
      await updateCardNamePromise;

      ActionHistory.append(
        { type: 'rename', name, previousName: data?.name ?? '' },
        {
          idCard: cardId,
          idBoard: boardId,
          idLabels: [],
          idList: '',
          idMembers: [],
        },
      );

      Analytics.taskSucceeded({
        taskName: 'edit-card/name',
        traceId,
        source: 'quickCardEditorInlineDialog',
      });
    } catch (error) {
      Analytics.taskFailed({
        taskName: 'edit-card/name',
        traceId,
        source: 'quickCardEditorInlineDialog',
        error,
      });
      showFlag({
        id: 'quick-card-editor',
        title: (
          <FormattedMessage
            id="templates.app_management.something-went-wrong"
            defaultMessage="Something went wrong. Please try again later."
            description="Quick card editor something went wrong"
          />
        ),
        appearance: 'error',
        isAutoDismiss: true,
      });
    }
  }, [name, updateCardName, cardId, onClose, data?.name, boardId]);

  const onSubmit = useCallback<FormEventHandler>(
    (e) => {
      e.preventDefault();
      updateName();
    },
    [updateName],
  );

  const onKeyDown = useCallback<KeyboardEventHandler<HTMLTextAreaElement>>(
    (e) => {
      const key = getKey(e);
      switch (key) {
        case Key.Enter:
          Analytics.sendPressedShortcutEvent({
            shortcutName: 'saveEditsShortcut',
            keyValue: Key.Enter,
            source: 'quickCardEditorInlineDialog',
            containers: formatContainers({
              idBoard: boardId,
              idList: listId,
              idCard: cardId,
              workspaceId,
            }),
          });
          onSubmit(e);

          return;
        case Key.Escape:
          Analytics.sendPressedShortcutEvent({
            shortcutName: 'closeEditorShortcut',
            keyValue: Key.Escape,
            source: 'quickCardEditorInlineDialog',
            containers: formatContainers({
              idBoard: boardId,
              idList: listId,
              idCard: cardId,
              workspaceId,
            }),
          });
          return;
        default:
          // Stop propagation of all other keys. This effectively enables keys
          // that are caught by components higher in the stack, like CardFront,
          // which would otherwise prevent default on shortcut keys like `e`.
          e.stopPropagation();
          return;
      }
    },
    [onSubmit, cardId, boardId, listId, workspaceId],
  );

  const onFocus = useCallback<FocusEventHandler<HTMLTextAreaElement>>(
    (e) => {
      Analytics.sendClickedButtonEvent({
        buttonName: 'quickCardEditorButton',
        source: 'cardView',
        containers: {
          card: { id: cardId },
          board: {
            id: boardId,
          },
          workspace: {
            id: workspaceId,
          },
        },
      });
      e.target.select();
    },
    [cardId, boardId, workspaceId],
  );

  const hasStickers = (data?.stickers?.length ?? 0) > 0;

  return (
    <form onSubmit={onSubmit}>
      <div
        data-testid={getTestId<QuickCardEditorTestIds>(
          'quick-card-editor-card-front',
        )}
        style={{ width: `${width}px` }}
        className={styles.cardFront}
      >
        <CardFrontCover />
        <div
          className={cx(styles.details, {
            [styles.stickersBackdrop]: hasStickers,
          })}
        >
          <CardFrontLabels />
          <AutosizeTextarea
            className={styles.cardNameEditor}
            ref={textareaRef}
            dir="auto"
            value={name}
            // A bit of a magic number, but matches the old stack.
            minHeight={56}
            shouldFocus={true}
            onFocus={onFocus}
            onKeyDown={onKeyDown}
            onChange={onChange}
            // Disable the input until we've resolved the name from cache.
            disabled={!data}
            data-testid={getTestId<QuickCardEditorTestIds>(
              'quick-card-editor-card-title',
            )}
            aria-label={intl.formatMessage({
              id: 'templates.quick_card_editor.edit-card-name',
              defaultMessage: 'Edit card name',
              description: 'Edit card name textarea label',
            })}
          />
          <CardFrontBadges />
          <CardFrontMembers />
        </div>
      </div>
      <Button appearance="primary" className={styles.saveButton} type="submit">
        <FormattedMessage
          id="templates.quick_card_editor.save"
          defaultMessage="Save"
          description="Quick card editor Save button"
        />
      </Button>
    </form>
  );
};
