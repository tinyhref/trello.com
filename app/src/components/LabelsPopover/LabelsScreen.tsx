import type { ChangeEvent, FunctionComponent, RefObject } from 'react';
import {
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import { FormattedMessage } from 'react-intl';

import { VisuallyHidden } from '@trello/a11y';
import { ActionHistory } from '@trello/action-history';
import { Analytics, formatContainers } from '@trello/atlassian-analytics';
import { isMemberLoggedIn } from '@trello/authentication';
import { useIsColorBlind } from '@trello/colorblind-support';
import { intl } from '@trello/i18n';
import type { CardLabelType, LabelColor } from '@trello/labels';
import { formatLabelColor, sortLabels } from '@trello/labels';
import { Button } from '@trello/nachos/button';
import { SparkleIcon } from '@trello/nachos/icons/sparkle';
import { Textfield } from '@trello/nachos/textfield';
import { normalizeDiacritics } from '@trello/strings';
import type { LabelsPopoverTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';
import { useLazyComponent } from '@trello/use-lazy-component';

import { Auth } from 'app/scripts/db/Auth';
import { MemberState } from 'app/scripts/view-models/MemberState';
import { LabelKeyHelper } from 'app/scripts/views/label/LabelKeyHelper';
import { BoardMenuScreen } from 'app/src/components/BoardMenuPopover/BoardMenuScreen';
import { Screens as AddToCardPopoverScreens } from 'app/src/components/CardBackAddToCardMenu/Screens';
import { LabelsList } from './LabelsList';
import { LabelsPopoverContext } from './LabelsPopoverContext';
import { LabelsPopoverHeader } from './LabelsPopoverHeader';
import { LabelsPopoverScreen } from './LabelsPopoverScreen';

import * as styles from './LabelsScreen.module.less';

export const NUM_LABELS_PER_PAGE = 8;
const MAX_SUGGESTIONS = 4;

/**
 * Allow fuzzier matches for color variants (e.g. 'green' should surface
 * 'dark green', 'green', and 'light green').
 */
const fuzzyMatchLabelColor = (color: string, query: string): boolean =>
  color
    .toLowerCase()
    .split(/[\s_]/)
    .some((str) => str.startsWith(query));

interface LabelsScreenProps {
  /**
   * When embedded in the BoardSidebarLabelsScreen, the whole screen is animated
   * in from offscreen. This causes conflicts with the autofocus flow, as the
   * DOM gets wonky when trying to focus an offscreen element. As a workaround,
   * the BoardSidebarLabelsScreen has to delay the autofocus implementation
   * until after the slide animation has resolved.
   * @default 0
   */
  autofocusDelayMs?: number;
}

export const LabelsScreen: FunctionComponent<LabelsScreenProps> = ({
  autofocusDelayMs = 0,
}) => {
  const {
    source,
    idBoard,
    idOrganization,
    idCard,
    idList,
    isEditable,
    isSourceSidebarMenu,
    isOnAddToCardPopover,
    labelsOnBoard,
    labelsSelectedOnCard,
    labelsLimitPerBoard,
    setCurrentLabel,
    searchQuery,
    setSearchQuery,
    onLabelSelected,
    shouldSetFocusOnCreateNewLabelButton,
    push,
  } = useContext(LabelsPopoverContext);

  const selectedLabelIds = useMemo(
    () => new Set(labelsSelectedOnCard.map(({ id }) => id)),
    [labelsSelectedOnCard],
  );

  const [numVisibleLabels, setNumVisibleLabels] = useState(NUM_LABELS_PER_PAGE);
  const [isPoppingFromEdit, setIsPoppingFromEdit] = useState(false);
  const onClickShowMoreButton = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (e: any) => {
      e.stopPropagation();
      setNumVisibleLabels((current) => current + NUM_LABELS_PER_PAGE);
      Analytics.sendClickedButtonEvent({
        buttonName: 'showMoreLabelsButton',
        source: 'labelsInlineDialog',
        containers: formatContainers({
          idBoard,
          idOrganization,
          idCard,
          idList,
        }),
        attributes: {
          popoverSource: source,
          numTimesClicked: Math.ceil(numVisibleLabels / NUM_LABELS_PER_PAGE),
        },
      });
    },
    [idBoard, idOrganization, idCard, idList, numVisibleLabels, source],
  );

  const isSearching = !!searchQuery.trim().length;
  const onChangeSearchQuery = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    [setSearchQuery],
  );

  const filteredLabels = useMemo(() => {
    const sortedLabels = sortLabels(labelsOnBoard);
    if (!isSearching) {
      return sortedLabels;
    }

    const query = searchQuery.toLowerCase();
    // Cache color matches. We don't need to reevaluate query to color name
    // matches for every label, just once per color type, so we can store colors
    // as keys and match results (true, false, or undefined) as values.
    const knownColorMatches: Partial<Record<NonNullable<LabelColor>, boolean>> =
      {};
    // If the input is numeric, also search for labels by color index
    // (e.g. 1 filters green labels, 9 pink, 0 black, etc).
    // Matches whitespace and leading zeros (e.g. ' 1 ', '01') but not non-numeric characters (e.g. '0 - a', '01jpg')
    const numericQuery = !isNaN(Number(query)) ? parseInt(query, 10) : NaN;
    const labelColorAtSearchedIndex: LabelColor = !Number.isNaN(numericQuery)
      ? LabelKeyHelper.colorForKey(numericQuery)
      : null;

    return sortedLabels.filter(({ name, color }) => {
      if (name) {
        const lowercasedName = name.toLowerCase();
        // Remove diacritic marks for searching
        // (e.g. "Crème" will still come up as a result for "creme").
        const normalizedName = normalizeDiacritics(lowercasedName);

        if (lowercasedName.includes(query) || normalizedName.includes(query)) {
          return true;
        }
      }

      if (color) {
        if (!Object.prototype.hasOwnProperty.call(knownColorMatches, color)) {
          knownColorMatches[color] =
            fuzzyMatchLabelColor(color, query) ||
            fuzzyMatchLabelColor(formatLabelColor(color), query) ||
            color === labelColorAtSearchedIndex;
        }
        if (knownColorMatches[color]) {
          return true;
        }
      }
    });
  }, [labelsOnBoard, searchQuery, isSearching]);

  const visibleLabels = useMemo(() => {
    if (filteredLabels.length <= numVisibleLabels) {
      return filteredLabels;
    }
    const selectedLabels = filteredLabels.filter(({ id }) =>
      selectedLabelIds.has(id),
    );
    // Fill up the page with filtered labels, but prioritize selected labels.
    let remaining = numVisibleLabels - selectedLabels.length;
    return filteredLabels.filter((label) => {
      if (selectedLabelIds.has(label.id)) {
        return true;
      }
      if (remaining > 0) {
        remaining--;
        return true;
      }
      return false;
    });
  }, [filteredLabels, numVisibleLabels, selectedLabelIds]);

  const canSelectLabel = idCard || onLabelSelected;
  const canShowMore = numVisibleLabels < filteredLabels.length;

  const canShowSuggestions =
    !isSearching && idList && canSelectLabel && canShowMore;

  const suggestedLabels = useMemo(() => {
    if (!canShowSuggestions || MemberState.get('showSuggestions') === false) {
      return null;
    }
    const history = ActionHistory.get();
    const seenLabelIds = new Set<string>();

    const suggestions = history.reduce((acc, { action, context }) => {
      if (action.type !== 'add-label' || context.idList !== idList) {
        return acc;
      }
      if (seenLabelIds.has(action.idLabel)) {
        return acc;
      }
      seenLabelIds.add(action.idLabel);
      if (selectedLabelIds.has(action.idLabel)) {
        return acc;
      }
      const label = labelsOnBoard.find(({ id }) => id === action.idLabel);
      if (label) {
        acc.push(label);
      }
      return acc;
    }, [] as CardLabelType[]);

    return suggestions.slice(0, MAX_SUGGESTIONS);
  }, [canShowSuggestions, idList, selectedLabelIds, labelsOnBoard]);

  const autofocusRef = useRef<HTMLInputElement>(null);
  const onClickEditButton = useCallback(
    (label: CardLabelType, editButtonRef: RefObject<HTMLButtonElement>) => {
      setCurrentLabel(label);
      const onPopCallback = () => {
        setIsPoppingFromEdit(true);
        const labelStillExists = labelsOnBoard.some((l) => l.id === label.id);

        if (labelStillExists) {
          // eslint-disable-next-line @trello/no-query-selector
          const editButton: HTMLElement | null = document.querySelector(
            `button[id="${label.id}"]`,
          );

          return editButton;
        }

        return null;
      };

      if (isSourceSidebarMenu) {
        push(BoardMenuScreen.LabelsEdit, onPopCallback);
      } else if (isOnAddToCardPopover) {
        push(AddToCardPopoverScreens.EditLabel, onPopCallback);
      } else {
        push(LabelsPopoverScreen.Edit, onPopCallback);
      }
    },
    [
      setCurrentLabel,
      setIsPoppingFromEdit,
      isSourceSidebarMenu,
      isOnAddToCardPopover,
      labelsOnBoard,
      push,
    ],
  );

  const isLabelsLimitExceeded =
    labelsLimitPerBoard?.status === 'disabled' ||
    labelsLimitPerBoard?.status === 'maxExceeded';

  const LabelsLimitExceededMessage = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "labels-limit-exceeded-message" */ './LabelsLimitExceededMessage'
      ),
    { namedImport: 'LabelsLimitExceededMessage' },
  );

  const createButtonRef = useRef<HTMLButtonElement>(null);
  const onClickCreateButton = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (e: any) => {
      if (isLabelsLimitExceeded) {
        return;
      }
      e.stopPropagation();
      setCurrentLabel(null);
      if (isSourceSidebarMenu) {
        push(BoardMenuScreen.LabelsCreate);
      } else if (isOnAddToCardPopover) {
        push(AddToCardPopoverScreens.CreateLabel);
      } else {
        push(LabelsPopoverScreen.Create, createButtonRef);
      }
    },
    [
      isLabelsLimitExceeded,
      setCurrentLabel,
      isSourceSidebarMenu,
      isOnAddToCardPopover,
      push,
    ],
  );

  // Handle focus management for textfield and create button
  useEffect(() => {
    if (isPoppingFromEdit) {
      setIsPoppingFromEdit(false);
      return;
    }

    if (shouldSetFocusOnCreateNewLabelButton) {
      requestAnimationFrame(() => {
        if (createButtonRef.current) {
          createButtonRef.current.focus();
        }
      });
    } else {
      if (autofocusRef.current) {
        const timeoutId = setTimeout(() => {
          autofocusRef.current?.focus();
        }, autofocusDelayMs);

        return () => clearTimeout(timeoutId);
      }
    }
  }, [
    shouldSetFocusOnCreateNewLabelButton,
    autofocusDelayMs,
    isPoppingFromEdit,
  ]);

  const me = Auth.me();
  const isColorBlind = useIsColorBlind();
  const onClickToggleColorBlindMode = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (e: any) => {
      e.stopPropagation();
      Analytics.sendTrackEvent({
        action: 'toggled',
        actionSubject: 'colorBlindFriendlyMode',
        source: 'labelsInlineDialog',
        containers: formatContainers({
          idBoard,
          idOrganization,
          idCard,
          idList,
        }),
        attributes: { popoverSource: source, value: !isColorBlind },
      });
      me.toggleColorBlindMode();
    },
    [me, isColorBlind, source, idBoard, idOrganization, idCard, idList],
  );

  const containers = formatContainers({
    idBoard,
    idOrganization,
    idCard,
    idList,
  });

  useEffect(() => {
    Analytics.sendScreenEvent({
      name: 'labelsInlineDialog',
      containers,
      attributes: { source },
    });
  }, [containers, source]);

  const searchInputDescriptionId = useId();

  return (
    <div>
      <Textfield
        placeholder={intl.formatMessage({
          id: 'templates.labels_popover.search-labels',
          defaultMessage: 'Search labels…',
          description: 'Placeholder text for searching labels',
        })}
        value={searchQuery}
        onChange={onChangeSearchQuery}
        autoFocus={!shouldSetFocusOnCreateNewLabelButton && !isPoppingFromEdit}
        ref={autofocusRef}
        aria-label={intl.formatMessage({
          id: 'templates.labels_popover.search-labels',
          defaultMessage: 'Search labels…',
          description: 'Placeholder text for searching labels',
        })}
        aria-describedby={searchInputDescriptionId}
      />
      <VisuallyHidden id={searchInputDescriptionId}>
        <FormattedMessage
          id="templates.labels_popover.search-labels-usage"
          defaultMessage="Typing automatically updates the search results below"
          description="Describes how the search input field works, for users of assistive technology"
        />
      </VisuallyHidden>

      {suggestedLabels?.length ? (
        <div
          data-testid={getTestId<LabelsPopoverTestIds>(
            'labels-popover-suggested-labels',
          )}
        >
          <LabelsPopoverHeader>
            <SparkleIcon size="small" dangerous_className={styles.headerIcon} />
            &nbsp;
            <FormattedMessage
              id="templates.labels_popover.suggestions"
              defaultMessage="Suggestions"
              description="Header for suggested labels"
            />
          </LabelsPopoverHeader>
          <LabelsList
            source={source}
            labels={suggestedLabels}
            labelsSelectedOnCard={labelsSelectedOnCard}
            idBoard={idBoard}
            idCard={idCard}
            idList={idList}
            isBoardEditable={isEditable}
            onLabelSelected={onLabelSelected}
            onClickEditButton={onClickEditButton}
          />
        </div>
      ) : null}

      <LabelsPopoverHeader>
        <FormattedMessage
          id="templates.labels_popover.labels"
          defaultMessage="Labels"
          description="Header for labels"
        />
      </LabelsPopoverHeader>
      <LabelsList
        source={source}
        labels={visibleLabels}
        labelsSelectedOnCard={labelsSelectedOnCard}
        idBoard={idBoard}
        idCard={idCard}
        idList={idList}
        isBoardEditable={isEditable}
        onLabelSelected={onLabelSelected}
        onClickEditButton={onClickEditButton}
      />

      {isEditable && (
        <Button
          size="fullwidth"
          className={styles.button}
          onClick={onClickCreateButton}
          ref={createButtonRef}
          aria-disabled={isLabelsLimitExceeded}
          aria-describedby={
            isLabelsLimitExceeded ? 'labels-limit-exceeded-message' : undefined
          }
          aria-haspopup="dialog"
        >
          <FormattedMessage
            id="templates.labels_popover.create-a-new-label"
            defaultMessage="Create a new label"
            description="Button text for creating a new label"
          />
        </Button>
      )}

      {canShowMore && (
        <Button
          size="fullwidth"
          className={styles.button}
          onClick={onClickShowMoreButton}
        >
          <FormattedMessage
            id="templates.labels_popover.show-more-labels"
            defaultMessage="Show more labels"
            description="Button text for showing more labels"
          />
        </Button>
      )}

      {isMemberLoggedIn() && (
        <>
          <hr role="presentation" className={styles.divider} />
          <Button
            size="fullwidth"
            className={styles.button}
            onClick={onClickToggleColorBlindMode}
          >
            {isColorBlind ? (
              <FormattedMessage
                id="templates.labels_popover.disable-color-blind-friendly-mode"
                defaultMessage="Disable colorblind friendly mode"
                description="Button text for disabling colorblind friendly mode"
              />
            ) : (
              <FormattedMessage
                id="templates.labels_popover.enable-color-blind-friendly-mode"
                defaultMessage="Enable colorblind friendly mode"
                description="Button text for enabling colorblind friendly mode"
              />
            )}
          </Button>
        </>
      )}

      {isLabelsLimitExceeded && (
        <Suspense fallback={null}>
          <LabelsLimitExceededMessage
            disableAt={labelsLimitPerBoard?.disableAt ?? 1000}
          />
        </Suspense>
      )}
    </div>
  );
};
