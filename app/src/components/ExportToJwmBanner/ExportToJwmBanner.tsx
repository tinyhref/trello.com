import type { FunctionComponent } from 'react';
import { useCallback, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';

import { JiraLogo } from '@atlaskit/logo';
import { Analytics } from '@trello/atlassian-analytics';
import { useOneTimeMessagesDismissed } from '@trello/business-logic-react/member';
import { getImportBoardUrl, shouldHideLinkingDetails } from '@trello/jwm';
import { Button } from '@trello/nachos/button';
import { HeaderBanner } from '@trello/nachos/header-banner';
import { useWorkspace } from '@trello/workspaces';

import { useBoardIdFromBoardOrCardRoute } from 'app/src/components/Board/useBoardIdFromBoardOrCardRoute';
import { useExportToJwmBannerFragment } from './ExportToJwmBannerFragment.generated';

import * as styles from './ExportToJwmBanner.module.less';

export const messageKey = (orgId?: string) => `import-board-to-jwm-${orgId}`;

export const ExportToJwmBanner: FunctionComponent = () => {
  const boardId = useBoardIdFromBoardOrCardRoute() || '';
  const { workspaceId } = useWorkspace();

  const { dismissOneTimeMessage } = useOneTimeMessagesDismissed();

  const { data } = useExportToJwmBannerFragment({
    from: { id: workspaceId },
  });

  const onJwmExportLinkClick = useCallback(() => {
    Analytics.sendClickedLinkEvent({
      linkName: 'exportToJwmLink',
      source: 'exportToJwmBanner',
    });
  }, []);

  const onDismissButtonClick = useCallback(() => {
    Analytics.sendClickedButtonEvent({
      buttonName: 'dismissButton',
      source: 'exportToJwmBanner',
    });
    dismissOneTimeMessage(messageKey(workspaceId as string));
  }, [dismissOneTimeMessage, workspaceId]);

  const jwmSiteUrl = data?.jwmLink?.entityUrl;
  const online = !data?.jwmLink?.inaccessible;

  const hideLinkingDetails = shouldHideLinkingDetails(workspaceId as string);

  useEffect(() => {
    if (jwmSiteUrl && online && !hideLinkingDetails) {
      Analytics.sendViewedBannerEvent({
        bannerName: 'exportToJwmBanner',
        source: 'boardScreen',
      });
    }
  }, [jwmSiteUrl, hideLinkingDetails, online]);
  // Technically we should only fall into this case for NUWL workspaces, because
  // otherwise we only render this component if the workspace has a linked JWM
  if (!jwmSiteUrl || !workspaceId || !online || hideLinkingDetails) {
    return null;
  }

  return (
    <HeaderBanner className={styles.banner} onDismiss={onDismissButtonClick}>
      <div className={styles.jwmBannerContents}>
        <div className={styles.jwmBannerHeading}>
          <div className={styles.JWMLogoContainer}>
            <JiraLogo size="small" appearance="brand" />
          </div>
        </div>
        <span className={styles.jwmBannerDesc}>
          <b>
            <FormattedMessage
              id="templates.jwm_site_workspace_link.export-to-jwm-banner-header"
              defaultMessage="Quickly and easily turn this board into a project."
              description="Call to action for converting board into JWM project"
            />
          </b>{' '}
          <FormattedMessage
            id="templates.jwm_site_workspace_link.export-to-jwm-banner-description"
            defaultMessage="Add more structure and Project Management features like views, forms, and reports."
            description="Description explaining benefits of JWM"
          />
        </span>
        <div className={styles.jwmBannerButtons}>
          <Button
            href={getImportBoardUrl({ jwmSiteUrl, boardId, workspaceId })}
            linkTarget="_blank"
            className={styles.jwmBannerPrimaryButton}
            onClick={onJwmExportLinkClick}
          >
            <FormattedMessage
              id="templates.jwm_site_workspace_link.export-to-jwm-button"
              defaultMessage="Export board"
              description="Button to export board to JWM"
            />
          </Button>
        </div>
      </div>
    </HeaderBanner>
  );
};
