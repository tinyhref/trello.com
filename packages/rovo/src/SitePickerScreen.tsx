import cx from 'classnames';
import { useEffect, useState } from 'react';

import { Button } from '@trello/nachos/button';

import { getUserSites, type Site } from './getUserSites';

import * as styles from './SitePickerScreen.module.less';

interface SitePickerProps {
  onConfirmSite: (siteId: string | null) => void;
}

// This is only being used for local and staging environments right now
// On prod we will hardcode the site id for "hello" for now. In the future
// something like this will be needed for prod as well.
export const SitePickerScreen = ({ onConfirmSite }: SitePickerProps) => {
  const [sites, setSites] = useState<Site[]>([]);
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);

  useEffect(() => {
    const fetchSites = async () => {
      const userSites = await getUserSites();
      setSites(userSites);
    };

    fetchSites();
  }, []);

  // TODO: i18n
  return (
    <div className={styles.sitePickerContainer}>
      <div className={styles.sitePickerHeader}>
        <h3>Select a site to continue</h3>
        <p>Choose which site you want to use with Rovo</p>
      </div>

      <div className={styles.siteList}>
        {sites.length === 0 ? (
          <p className={styles.noSites}>
            No sites found. You need access to at least one Jira or Confluence
            site to use Rovo.
          </p>
        ) : (
          sites.map((site) => (
            <Button
              appearance="subtle"
              key={site.cloudId}
              className={cx({
                [styles.siteItem]: true,
                [styles.selected]: selectedSiteId === site.cloudId,
              })}
              onClick={() => setSelectedSiteId(site.cloudId)}
            >
              <div className={styles.siteInfo}>
                <div className={styles.siteName}>{site.displayName}</div>
                <div className={styles.siteUrl}>{site.cloudUrl}</div>
              </div>
            </Button>
          ))
        )}
      </div>

      {sites.length > 0 && (
        <div className={styles.sitePickerActions}>
          <Button appearance="danger" onClick={() => onConfirmSite(null)}>
            Cancel
          </Button>
          <Button
            appearance="primary"
            isDisabled={!selectedSiteId}
            onClick={() => onConfirmSite(selectedSiteId)}
          >
            Continue
          </Button>
        </div>
      )}
    </div>
  );
};
