import type { FunctionComponent } from 'react';
import { startTransition, Suspense, useEffect, useState } from 'react';

import { dontUpsell } from '@trello/browser';
import { useIsBoardPremiumFeatureEnabled } from '@trello/business-logic-react/board';
import { PremiumFeatures } from '@trello/entitlements';
import {
  ChunkLoadErrorBoundary,
  ErrorBoundary,
} from '@trello/error-boundaries';
import { intl } from '@trello/i18n';
import { useWorkspaceId } from '@trello/id-context';
import {
  PopoverSection,
  usePersistentCollapsiblePopoverSection,
} from '@trello/nachos/experimental-popover-section';
import { PopoverMenuItemSeparator } from '@trello/nachos/popover-menu';
import { useLazyComponent } from '@trello/use-lazy-component';

import {
  MaybePremiumLozenge,
  useFreeTrialEligibilityRules,
} from 'app/src/components/FreeTrial';
import { ListColorPickerSkeleton } from './ListColorPickerSkeleton';
import { ListColorPickerUpgradePrompt } from './ListColorPickerUpgradePrompt';

import * as styles from './LazyListColorPicker.module.less';

interface LazyListColorPickerProps {
  onHide?: () => void;
}

export const LazyListColorPicker: FunctionComponent<
  LazyListColorPickerProps
> = ({ onHide }) => {
  const workspaceId = useWorkspaceId();

  const isListColorsEnabled = useIsBoardPremiumFeatureEnabled(
    PremiumFeatures.listColors,
  );

  const { isCollapsed, onToggleCollapsed } =
    usePersistentCollapsiblePopoverSection('listActionsPopoverColorPicker');

  // Defer rendering the lazy color picker behind a non-blocking transition:
  const [shouldRenderContent, setShouldRenderContent] = useState(false);
  useEffect(() => {
    if (!shouldRenderContent && !isCollapsed) {
      startTransition(() => setShouldRenderContent(true));
    }
  }, [isCollapsed, shouldRenderContent]);

  const ListColorPicker = useLazyComponent(
    () =>
      import(/* webpackChunkName: "list-color-picker" */ './ListColorPicker'),
    {
      namedImport: 'ListColorPicker',
      preload: isListColorsEnabled && shouldRenderContent,
    },
  );

  const { isEligible } = useFreeTrialEligibilityRules(workspaceId ?? undefined);
  if (!isListColorsEnabled && (dontUpsell() || !isEligible)) {
    return null;
  }

  return (
    <ErrorBoundary
      tags={{
        ownershipArea: 'trello-web-eng',
        feature: 'List Color Picker',
      }}
    >
      <PopoverMenuItemSeparator fullWidth={true} />

      <PopoverSection
        title={
          <div>
            {intl.formatMessage({
              id: 'templates.list_menu.change-list-color',
              defaultMessage: 'Change list color',
              description: 'Header for the list color picker section',
            })}
            <MaybePremiumLozenge
              className={styles.premiumLozenge}
              featureHighlighted="list-color-picker"
            />
          </div>
        }
        isCollapsible={true}
        isCollapsed={isCollapsed}
        onToggleCollapsed={onToggleCollapsed}
      >
        <ChunkLoadErrorBoundary fallback={null}>
          <Suspense fallback={<ListColorPickerSkeleton />}>
            {isListColorsEnabled ? (
              <ListColorPicker />
            ) : (
              <ListColorPickerUpgradePrompt onClickCta={onHide} />
            )}
          </Suspense>
        </ChunkLoadErrorBoundary>
      </PopoverSection>
    </ErrorBoundary>
  );
};
