import cx from 'classnames';
import type {
  ChangeEvent,
  FunctionComponent,
  PropsWithChildren,
  SyntheticEvent,
} from 'react';
import { useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import { FormattedMessage } from 'react-intl';

import { announceToLiveRegion } from '@trello/a11y';
import { chunk } from '@trello/arrays';
import { intl } from '@trello/i18n';
import { isSubmitEvent } from '@trello/keybindings';
import type { CardLabelType, LabelColor } from '@trello/labels';
import { CardLabel, formatLabelColor, LABEL_COLORS } from '@trello/labels';
import { Button } from '@trello/nachos/button';
import { CloseIcon } from '@trello/nachos/icons/close';
import { Textfield } from '@trello/nachos/textfield';
import { Tooltip } from '@trello/nachos/tooltip';

import { ColorPalette } from 'app/src/components/ColorPalette/ColorPalette';
import { nonNullable } from 'app/src/nonNullable';
import { LabelsPopoverContext } from './LabelsPopoverContext';
import { LabelsPopoverHeader } from './LabelsPopoverHeader';

import * as styles from './EditLabelContent.module.less';

/**
 * When creating a new label, we want to pre-select a label color for the user
 * if possible. The logic here is as follows:
 * - If the user typed in a search query on the previous screen that is a match
 *   for a label color name (localized or raw, e.g. "blue" or "bleu"), select
 *   that. This is most commonly used in a flow where a user presses a numeric
 *   keyboard shortcut on a card and there are multiple labels belonging to the
 *   same color index. For example, if I have three green labels and press the
 *   `1` key on a card, we'll open the LabelsPopover with the search query pre-
 *   filled to "green" (localized). If the user then clicks "Create label",
 *   pre-select green here.
 * - Otherwise, iterate through the user's existing labels to see if there are
 *   any currently unused colors, and return the first unused color if so.
 */
export const getNextLabelColor = (
  existingLabels: CardLabelType[],
  searchQuery: string,
): LabelColor => {
  const colors = LABEL_COLORS.filter(Boolean) as LabelColors[];

  // If the user was searching for a specific label color in the previous
  // screen, pre-select that color.
  if (searchQuery.length) {
    const localizedMatch = formatLabelColor(searchQuery);
    if (localizedMatch) {
      return colors.find((color) => color === localizedMatch) ?? null;
    }
    const rawMatch = colors.find((color) => color === searchQuery);
    if (rawMatch) {
      return rawMatch;
    }
  }

  const existingColors = new Set<LabelColor>(
    existingLabels.map(({ color }) => color ?? null),
  );
  return (
    colors
      // Prioritize different base colors before suggesting variants.
      .sort((a, b) => Number(a.includes('_')) - Number(b.includes('_')))
      .find((color) => !existingColors.has(color)) ?? null
  );
};

const NUM_COLUMNS = 5;

const getSortedPremiumColors = (): LabelColors[] => {
  const NUM_VARIANTS = 3; // light, normal, dark
  const CHUNK_SIZE = NUM_COLUMNS * NUM_VARIANTS;

  const colors = LABEL_COLORS.filter(nonNullable);
  const sortedColors: typeof colors = [];

  chunk(colors, CHUNK_SIZE).forEach((chunkedColors) => {
    for (let variant = 0; variant < NUM_VARIANTS; variant++) {
      for (let color = 0; color < chunkedColors.length; color += NUM_VARIANTS) {
        sortedColors.push(chunkedColors[variant + color]);
      }
    }
  });

  return sortedColors;
};

type LabelColors = NonNullable<LabelColor>;

interface EditLabelContentProps {
  /**
   * Indicates whether the Save button should be marked loading.
   */
  isSaving: boolean;
  onSave: (label: CardLabelType) => void;
  /**
   * A cheap override to let us control the Save button within this component,
   * but allow consumers to use their own label for the button. Namely, this is
   * used by the CreateLabelScreen to render "Create" instead of "Save".
   * @default 'Save'
   */
  saveText?: string;
}

const defaultSaveText = (
  <FormattedMessage
    id="templates.labels_popover.save"
    defaultMessage="Save"
    description="Save"
  />
);
/**
 * Shared content for CreateLabelPopoverScreen and EditLabelPopoverScreen.
 * Uses `children` prop for additional buttons in the footer.
 */
export const EditLabelContent: FunctionComponent<
  PropsWithChildren<EditLabelContentProps>
> = ({ isSaving, onSave, saveText = defaultSaveText, children }) => {
  const {
    currentLabel,
    isSourceSidebarMenu,
    labelsOnBoard,
    searchQuery,
    setCurrentLabel,
  } = useContext(LabelsPopoverContext);

  /**
   * The currentLabel in context state is optional, but required for this screen.
   * This light abstraction returns an empty label if the label is undefined,
   * which is useful for type safety but also relied upon in the create screen.
   */
  const editableLabel = useMemo(() => {
    if (currentLabel) {
      return currentLabel;
    }
    const color = getNextLabelColor(labelsOnBoard, searchQuery);
    // Set the name to the search query from the previous screen, unless there
    // was a color name match.
    let name = searchQuery;
    if (color && name && [name, formatLabelColor(name)].includes(color)) {
      name = '';
    }
    return {
      id: '', // wiped pre-create, generated post-create
      name,
      color,
    };
    // The only dependency that matters for this value is the currentLabel.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLabel]);

  const updateName = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setCurrentLabel({ ...editableLabel, name: e.target.value });
    },
    [editableLabel, setCurrentLabel],
  );

  const updateColor = useCallback(
    (color: LabelColors | null) => {
      setCurrentLabel({ ...editableLabel, color });
    },
    [editableLabel, setCurrentLabel],
  );

  const onClickSave = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (e: any) => {
      e.stopPropagation();
      onSave(editableLabel);
    },
    [editableLabel, onSave],
  );

  const submitOnKeyDown = useCallback(
    (e: Parameters<typeof isSubmitEvent>[0]) => {
      if (isSubmitEvent(e)) {
        onSave(editableLabel);
      }
    },
    [editableLabel, onSave],
  );

  const colors = useMemo(() => getSortedPremiumColors(), []);
  const currentColor = editableLabel.color ? editableLabel.color : null;
  const onClickTooltipRef = useRef<(e: SyntheticEvent) => void>();

  useEffect(() => {
    announceToLiveRegion(
      currentColor
        ? intl.formatMessage({
            id: 'templates.labels_popover.color-selected',
            defaultMessage: 'The label color was selected',
            description: 'The label color was selected',
          })
        : intl.formatMessage({
            id: 'templates.labels_popover.color-removed',
            defaultMessage: 'The label color was removed',
            description: 'The label color was removed',
          }),
    );
  }, [currentColor]);

  return (
    <>
      <div
        className={cx(styles.labelPreview, {
          [styles.isSourceSidebarMenu]: isSourceSidebarMenu,
        })}
      >
        <CardLabel label={editableLabel} fullWidth={true} tabIndex={-1} />
      </div>
      <LabelsPopoverHeader>
        <label htmlFor="edit-label-title-input">
          <FormattedMessage
            id="templates.labels_popover.title"
            defaultMessage="Title"
            description="Title"
          />
        </label>
      </LabelsPopoverHeader>
      <Textfield
        id="edit-label-title-input"
        onChange={updateName}
        onKeyDown={submitOnKeyDown}
        value={editableLabel.name}
        autoFocus
      />
      <LabelsPopoverHeader>
        <FormattedMessage
          id="templates.labels_popover.select-a-color"
          defaultMessage="Select a color"
          description="Select a color"
        />
      </LabelsPopoverHeader>
      <div>
        <ColorPalette
          onClick={updateColor}
          colorOptions={colors}
          selectedColor={currentColor}
          isSourceSidebarMenu={isSourceSidebarMenu}
        />
        <Tooltip
          content={intl.formatMessage({
            id: 'templates.labels_popover.remove-color-tooltip',
            defaultMessage:
              'Labels without a color selected will only appear on the card back.',
            description: 'Label remove color tooltip',
          })}
          hideTooltipOnClick={true}
        >
          {({ onClick: onClickTooltip, ...tooltipProps }) => {
            // @ts-expect-error
            onClickTooltipRef.current = onClickTooltip;
            return (
              <Button
                size="fullwidth"
                onClick={() => updateColor(null)}
                iconBefore={<CloseIcon size="small" />}
                isDisabled={!currentColor}
                // Conditionally spread tooltipProps. This is a workaround for a
                // bug where disabled Nachos buttons don't show tooltips,
                // but their icons still do.
                {...(currentColor ? tooltipProps : {})}
              >
                <FormattedMessage
                  id="templates.labels_popover.remove-color"
                  defaultMessage="Remove color"
                  description="Remove color button"
                />
              </Button>
            );
          }}
        </Tooltip>
      </div>
      <hr role="presentation" />
      <div className={styles.footer}>
        <Button
          appearance="primary"
          isDisabled={!editableLabel.color && !editableLabel.name}
          isLoading={isSaving}
          onClick={onClickSave}
        >
          {saveText}
        </Button>
        {children}
      </div>
    </>
  );
};
