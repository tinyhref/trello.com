/**
 * Provides keyboard-accessible navigation shortcuts to help users bypass repetitive
 * header content and quickly jump to main sections of the application.
 *
 * - Positioned off-screen by default and becomes visible when receiving keyboard focus
 * - Appears when users press Shift+Tab to navigate backwards past the first interactive
 *   element in the Trello header
 * - Dynamically shows relevant navigation options based on currently open panels
 */

import type { FunctionComponent } from 'react';

import { intl } from '@trello/i18n';
import {
  useIsBoardPanelOpen,
  useIsInboxPanelOpen,
  useIsPlannerPanelOpen,
} from '@trello/split-screen';

import * as styles from './SkipNavigation.module.less';

export const SkipNavigation: FunctionComponent = () => {
  const isInboxOpen = useIsInboxPanelOpen();
  const isPlannerOpen = useIsPlannerPanelOpen();
  const isBoardOpen = useIsBoardPanelOpen();

  return (
    <div className={styles.skipNavigation}>
      <span className={styles.skipNavigationText}>
        {intl.formatMessage({
          id: 'templates.skip_navigation.skip-to-section',
          defaultMessage: 'Skip to: ',
          description: 'Skip navigation text',
        })}
      </span>
      <ol>
        {isInboxOpen && (
          <li>
            <a href="#trello-inbox-root">
              {intl.formatMessage({
                id: 'templates.skip_navigation.inbox',
                defaultMessage: 'Inbox',
                description: 'Skip navigation link to inbox',
              })}
            </a>
          </li>
        )}
        {isPlannerOpen && (
          <li>
            <a href="#trello-planner-root">
              {intl.formatMessage({
                id: 'templates.skip_navigation.planner',
                defaultMessage: 'Planner',
                description: 'Skip navigation link to planner',
              })}
            </a>
          </li>
        )}
        {isBoardOpen && (
          <li>
            <a href="#trello-board-root">
              {intl.formatMessage({
                id: 'templates.skip_navigation.board',
                defaultMessage: 'Board',
                description: 'Skip navigation link to board',
              })}
            </a>
          </li>
        )}
        <li>
          <a href="#island-nav">
            {intl.formatMessage({
              id: 'templates.skip_navigation.board-switcher',
              defaultMessage: 'Board switcher',
              description: 'Skip navigation link to board switcher',
            })}
          </a>
        </li>
      </ol>
    </div>
  );
};
