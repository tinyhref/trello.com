import type { FunctionComponent } from 'react';
import { useCallback, useRef } from 'react';
import { FormattedMessage } from 'react-intl';

import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';
import type {
  DatasourceAdf,
  JiraIssuesDatasourceAdf,
} from '@atlaskit/link-datasource';
import { Analytics } from '@trello/atlassian-analytics';
import { mergeRefs } from '@trello/dom-hooks';
import { intl } from '@trello/i18n';
import { Button } from '@trello/nachos/button';
import type { PopoverProps } from '@trello/nachos/popover';
import type { PIIString } from '@trello/privacy';
import { convertToPIIString } from '@trello/privacy';
import type { InlineCardAdf } from '@trello/smart-card';

import {
  LazySmartListJiraIssueModal,
  ListSourcesPopover,
} from 'app/src/components/SmartList';
import {
  closeCreateJiraListModal,
  useIsCreateJiraListModalOpen,
} from 'app/src/components/SmartList/jiraIssueModalState';

import * as styles from './CreateSmartListButton.module.less';

export interface CreateSmartListButtonProps {
  saveList: (list: {
    name: string;
    datasourceLink: PIIString;
    datasourceFilter: boolean;
    type: 'datasource';
  }) => Promise<void>;
  hide(): void;
  triggerRef: (node: HTMLButtonElement | null) => void;
  popoverProps: PopoverProps<HTMLButtonElement>;
  toggle(): void;
}

export const CreateSmartListButton: FunctionComponent<
  CreateSmartListButtonProps
> = ({
  saveList,
  hide,
  toggle,
  triggerRef,
  popoverProps,
}: CreateSmartListButtonProps) => {
  const showJiraModal = useIsCreateJiraListModalOpen();

  const onClickAddFrom = useCallback(() => {
    Analytics.sendClickedButtonEvent({
      buttonName: 'addSmartListFromDatasourceButton',
      source: 'inlineListComposerInlineDialog',
    });
    toggle();
  }, [toggle]);

  const onInsert = useCallback(
    async (adf: DatasourceAdf<Record<string, unknown>> | InlineCardAdf) => {
      closeCreateJiraListModal();
      const JiraIssuesAdf = adf as JiraIssuesDatasourceAdf;
      if (
        JiraIssuesAdf?.attrs?.datasource?.parameters &&
        JiraIssuesAdf.attrs.url
      ) {
        const datasourceUrl = JiraIssuesAdf.attrs.url;
        await saveList({
          name: intl.formatMessage({
            id: 'templates.smart_lists.jira-list',
            defaultMessage: 'Jira list',
            description: 'Default name for new Jira lists',
          }),
          datasourceLink: convertToPIIString(datasourceUrl),
          datasourceFilter: false,
          type: 'datasource',
        });
      }
    },
    [saveList],
  );

  const onClose = useCallback(() => {
    closeCreateJiraListModal();
  }, []);

  const popoverId = 'add-from-list-popover';

  const addFromButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <Button
        ref={mergeRefs(triggerRef, addFromButtonRef)}
        appearance="subtle"
        className={styles.createSmartListButton}
        iconAfter={<ChevronDownIcon label="" size="small" />}
        onClick={onClickAddFrom}
        type="button"
        aria-expanded={popoverProps.isVisible}
        aria-controls={popoverProps.isVisible ? popoverId : undefined}
        aria-label={intl.formatMessage({
          id: 'templates.smart_lists.list-from-jira-work-items',
          defaultMessage: 'Add list from Jira work items',
          description:
            'Button to create a List from other product data sources',
        })}
      >
        <FormattedMessage
          id="templates.smart_lists.add-from"
          defaultMessage="Add from"
          description="Button to create a List from other product data sources"
        />
      </Button>
      <ListSourcesPopover
        hide={hide}
        popoverProps={popoverProps}
        popoverId={popoverId}
      />
      {showJiraModal && (
        <LazySmartListJiraIssueModal
          onClose={onClose}
          onInsert={onInsert}
          triggerButtonRef={addFromButtonRef}
        />
      )}
    </>
  );
};
