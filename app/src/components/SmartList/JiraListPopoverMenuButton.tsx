import { useCallback, type FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';

import { JiraIcon } from '@atlaskit/logo';
import { Analytics } from '@trello/atlassian-analytics';
import { PopoverMenuButton } from '@trello/nachos/popover-menu';
import { NewPill, useNewFeature } from '@trello/new-feature';

import * as styles from './JiraListPopoverMenuButton.module.less';

interface ListSourcesPopoverProps {
  onClick: () => void;
}

export const JiraListPopoverMenuButton: FunctionComponent<
  ListSourcesPopoverProps
> = ({ onClick }) => {
  const { isNewFeature, acknowledgeNewFeature } =
    useNewFeature('trello-smart-lists');

  const onClickJiraOption = useCallback(() => {
    onClick();
    Analytics.sendUIEvent({
      action: 'clicked',
      actionSubject: 'menuItem',
      actionSubjectId: 'addFromJiraIssuesMenuItem',
      source: 'listSourcesInlineDialog',
    });
    acknowledgeNewFeature({
      source: 'inlineListComposerJiraListPopoverMenuButton',
    });
  }, [acknowledgeNewFeature, onClick]);

  return (
    <PopoverMenuButton
      onClick={onClickJiraOption}
      iconBefore={
        <div className={styles.iconContainer}>
          <JiraIcon appearance="brand" size="small" label="" />
        </div>
      }
    >
      <FormattedMessage
        id="templates.smart_lists.jira-work-items"
        defaultMessage="Jira work items"
        description="Product option in the list of products to create a List from"
      />

      {isNewFeature && (
        <div className={styles.textPadding}>
          <NewPill
            featureId="trello-smart-lists"
            source="inlineListComposerInlineDialog"
          />
        </div>
      )}
    </PopoverMenuButton>
  );
};
