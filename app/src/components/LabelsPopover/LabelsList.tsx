import type {
  FunctionComponent,
  KeyboardEventHandler,
  RefObject,
  SyntheticEvent,
} from 'react';
import { useCallback, useMemo, useRef } from 'react';
import FocusLock, { useFocusScope } from 'react-focus-lock';

import type { SourceType } from '@trello/analytics-types';
import { intl } from '@trello/i18n';
import { getKey, Key } from '@trello/keybindings';
import { CardLabel, formatLabelTooltip } from '@trello/labels';
import type { CardLabelType } from '@trello/labels';
import { Button } from '@trello/nachos/button';
import { Checkbox } from '@trello/nachos/checkbox';
import { EditIcon } from '@trello/nachos/icons/edit';

import { useSelectLabel } from './useSelectLabel';

import * as styles from './LabelsList.module.less';

interface LabelsListItemProps {
  label: CardLabelType;
  isBoardEditable: boolean;
  isSelected: boolean;
  isSelectable: boolean;
  onSelectLabel: (label: CardLabelType) => void;
  onClickEdit?: (
    label: CardLabelType,
    editButtonRef: RefObject<HTMLButtonElement>,
  ) => void;
}

const LabelsListItem: FunctionComponent<LabelsListItemProps> = ({
  label,
  isBoardEditable,
  isSelected,
  isSelectable,
  onSelectLabel,
  onClickEdit,
}) => {
  const onChange = useCallback(() => {
    onSelectLabel(label);
  }, [onSelectLabel, label]);

  const shouldShowEditButton = Boolean(isBoardEditable && onClickEdit);
  const editButtonRef = useRef<HTMLButtonElement>(null);
  const onClickEditButton = useCallback(
    (e: SyntheticEvent) => {
      if (onClickEdit) {
        e.stopPropagation();
        onClickEdit(label, editButtonRef);
      }
    },
    [onClickEdit, label],
  );

  const focusScope = useFocusScope();
  const onKeyDown = useCallback<KeyboardEventHandler<HTMLElement>>(
    (e) => {
      switch (getKey(e)) {
        // Handle submit keypresses manually. We need to do this here rather
        // than relying on checkbox/button defaults in order to prevent
        // the default event, which can open a card back if a card is "selected"
        // via the aggressive card selection keyboard events.
        case Key.Enter:
        case Key.LineFeed:
          if (!isBoardEditable) {
            break;
          }
          if (e.currentTarget === editButtonRef.current || !isSelectable) {
            onClickEditButton(e);
          } else if (isSelectable) {
            onChange();
          }
          break;

        // The left/right arrow keys should move to the previous/next element in
        // the labels list.
        case Key.ArrowLeft:
          focusScope.focusPrev();
          break;
        case Key.ArrowRight:
          focusScope.focusNext();
          break;

        // The up/down arrow keys should skip to the previous/next row of
        // elements in the labels list. For example, when focused on a checkbox,
        // if the down arrow is pressed, we want to focus the 3rd element from
        // the current target, skipping the associated label and edit button to
        // focus the next checkbox.
        case Key.ArrowUp:
          focusScope.focusPrev({
            cycle: true,
          });
          break;
        case Key.ArrowDown:
          focusScope.focusNext({
            cycle: true,
          });
          break;

        default:
          return; // Continue; don't prevent default event loop.
      }

      e.preventDefault();
    },
    [focusScope, isBoardEditable, isSelectable, onChange, onClickEditButton],
  );

  const labelComponent = (
    <div className={styles.labelContainer}>
      <CardLabel
        label={label}
        className={styles.label}
        fullWidth={true}
        isHoverable={isBoardEditable}
        // If selectable, delegate the onClick event to the parent Checkbox.
        onClick={
          !isSelectable && isBoardEditable ? onClickEditButton : undefined
        }
        onKeyDown={onKeyDown}
        tabIndex={-1}
      />
      {shouldShowEditButton && (
        <Button
          appearance="subtle"
          className={styles.editButton}
          iconBefore={<EditIcon size="small" />}
          onClick={onClickEditButton}
          onKeyDown={onKeyDown}
          ref={editButtonRef}
          aria-label={intl.formatMessage(
            {
              id: 'templates.card_detail.edit-label',
              defaultMessage: 'Edit {labelName}',
              description: 'Aria label for editting a label',
            },
            {
              labelName: formatLabelTooltip(label),
            },
          )}
          id={label.id}
        />
      )}
    </div>
  );

  return (
    <li>
      {isSelectable && isBoardEditable ? (
        <Checkbox
          className={styles.checkbox}
          isChecked={isSelected}
          onChange={onChange}
          labelClassName={styles.labelContent}
          label={labelComponent}
          onKeyDown={onKeyDown}
        />
      ) : (
        labelComponent
      )}
    </li>
  );
};
export interface LabelsListProps {
  source: SourceType;
  labels: CardLabelType[];
  labelsSelectedOnCard?: CardLabelType[];
  idBoard?: string;
  idCard?: string | null;
  idList?: string | null;
  isBoardEditable: boolean;
  onClickEditButton?: (
    label: CardLabelType,
    ref: RefObject<HTMLButtonElement>,
  ) => void;
  onLabelSelected?: (
    label: CardLabelType,
    action: 'deselect' | 'select',
  ) => void;
}

const emptyLabelsSelectedOnCard: CardLabelType[] = [];
/**
 * A context-agnostic representation of a list of Labels. Has multiple branching
 * UI options depending on props:
 * - Labels are "selectable" if either idCard or onLabelSelected are defined;
 *   if so, a Checkbox component is rendered to the left of the Label.
 * - Labels are "editable" if onClickEditButton is defined; if so, an edit icon
 *   button is rendered to the right of the Label.
 * - If idCard is defined, this component will automatically handle the mutation
 *   request to toggle the selected label on the card on click.
 */

export const LabelsList: FunctionComponent<LabelsListProps> = ({
  source,
  labels,
  labelsSelectedOnCard = emptyLabelsSelectedOnCard,
  idBoard,
  idCard,
  idList,
  isBoardEditable,
  onClickEditButton,
  onLabelSelected,
}) => {
  const selectedLabelIds = useMemo(
    () => new Set(labelsSelectedOnCard.map(({ id }) => id)),
    [labelsSelectedOnCard],
  );

  const selectLabel = useSelectLabel({
    idBoard,
    idCard,
    idList,
    isBoardEditable,
    labelsSelectedOnCard,
    onLabelSelected,
    source: 'cardLabelsScreen',
    popoverSource: source,
  });

  if (!labels.length) {
    return null;
  }

  return (
    <FocusLock disabled={true}>
      <ul className={styles.labelsList}>
        {labels.map((label) => (
          <LabelsListItem
            key={label.id}
            label={label}
            isBoardEditable={isBoardEditable}
            isSelected={selectedLabelIds.has(label.id) ?? false}
            isSelectable={Boolean(idCard || onLabelSelected)}
            onSelectLabel={selectLabel}
            onClickEdit={onClickEditButton}
          />
        ))}
      </ul>
    </FocusLock>
  );
};
