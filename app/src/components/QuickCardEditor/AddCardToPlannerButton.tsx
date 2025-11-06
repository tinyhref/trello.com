import type { FunctionComponent } from 'react';
import { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';

import { Button } from '@trello/nachos/button';
import { CalendarIcon } from '@trello/nachos/icons/calendar';
import { usePopover } from '@trello/nachos/popover';
import { usePlannerAccounts } from '@trello/planner';
import type { QuickCardEditorTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { LazyAddCardToPlannerPopover } from 'app/src/components/Planner/AddCardToPlannerPopover/LazyAddCardToPlannerPopover';
import { PresentationalUpgradePill } from 'app/src/components/Planner/AddCardToPlannerPopover/PresentationalUpgradePill';
import {
  UpsellCohort,
  useUpsellData,
} from 'app/src/components/Planner/useUpsellData';
import { useUpsellFlags } from 'app/src/components/Planner/useUpsellFlags';
import { hasAdvancedPlanner } from 'app/src/components/Planner/utils/hasAdvancedPlanner';
import { QuickCardEditorButton } from './QuickCardEditorButton';

import * as styles from './AddCardToPlannerButton.module.less';

interface AddCardToPlannerButtonProps {
  onClose: () => void;
}

export const AddCardToPlannerButton: FunctionComponent<
  AddCardToPlannerButtonProps
> = ({ onClose }) => {
  const { popoverProps, toggle, triggerRef, hide } = usePopover();

  const { upsellCohort } = useUpsellData();
  const { showPaygatingFlag } = useUpsellFlags(upsellCohort);

  const { validAccounts } = usePlannerAccounts();

  const showUpsellFlag =
    !hasAdvancedPlanner(upsellCohort) && validAccounts.length > 0;

  const onClick = useCallback(() => {
    if (showUpsellFlag) {
      showPaygatingFlag();
      onClose();
    } else {
      toggle();
    }
  }, [onClose, showPaygatingFlag, showUpsellFlag, toggle]);

  if (upsellCohort === UpsellCohort.CohortLoading) {
    return (
      <Button
        iconBefore={<CalendarIcon size="small" />}
        className={styles.placeholderButton}
        isDisabled
      >
        <FormattedMessage
          id="templates.planner.schedule-focus-time"
          defaultMessage="Schedule focus time"
          description="Text for the button to schedule focus time from card quick actions."
        />
      </Button>
    );
  }

  // In this case the user has no workspaces that they could upgrade to enable this feature
  // or they are in desktop with no free trials available
  if (
    upsellCohort === UpsellCohort.NoUpgradeAvailable ||
    upsellCohort === UpsellCohort.UpgradeAvailableWithoutUpsell
  ) {
    return null;
  }

  return (
    <>
      <QuickCardEditorButton
        icon={<CalendarIcon size="small" />}
        onClick={onClick}
        ref={triggerRef}
        testId={getTestId<QuickCardEditorTestIds>(
          'quick-card-editor-add-card-to-planner',
        )}
        isSelected={popoverProps.isVisible}
        aria-expanded={popoverProps.isVisible}
      >
        <div className={styles.buttonContent}>
          <FormattedMessage
            id="templates.planner.schedule-focus-time"
            defaultMessage="Schedule focus time"
            description="Text for the button to schedule focus time from card quick actions."
          />
          {showUpsellFlag && <PresentationalUpgradePill />}
        </div>
      </QuickCardEditorButton>

      {popoverProps.isVisible && (
        <LazyAddCardToPlannerPopover
          popoverProps={popoverProps}
          onClose={onClose}
          hide={hide}
        />
      )}
    </>
  );
};
