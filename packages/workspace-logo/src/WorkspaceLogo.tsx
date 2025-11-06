import classnames from 'classnames';
import { useCallback, useEffect, useState } from 'react';

import { logoDomain } from '@trello/config';
import { forTemplate } from '@trello/legacy-i18n';
import { OrganizationIcon } from '@trello/nachos/icons/organization';
import type { WorkspaceNavigationTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { WorkspaceDefaultLogo } from './WorkspaceDefaultLogo';

import * as styles from './WorkspaceLogo.module.less';

const format = forTemplate('workspace_navigation');
type Size = 'medium' | 'small' | 'xsmall' | 'xxsmall';

export const WorkspaceLogo = ({
  logoHash,
  name,
  size,
  desaturate = false,
}: {
  logoHash?: string | null;
  name?: string | null;
  size?: Size;
  desaturate?: boolean;
}) => {
  // .gif files have to be accessed with the .gif extension
  // we try to load the logoHash with the .png extension, if that fails
  // we try again with the .gif extension, if that fails, we show
  // the default logo
  const [showPNG, setShowPNG] = useState(true);
  const [showDefaultLogo, setShowDefaultLogo] = useState(false);
  const logoExt = showPNG ? 'png' : 'gif';

  // reset the state whenever logoHash changes
  useEffect(() => {
    setShowPNG(true);
    setShowDefaultLogo(false);
  }, [logoHash]);

  const handleImageError = useCallback(() => {
    // if we're current trying the .png exention, try .gif
    // if we're trying .gif, fallback to default logo
    showPNG ? setShowPNG(false) : setShowDefaultLogo(true);
  }, [showPNG, setShowPNG, setShowDefaultLogo]);

  return (
    <div
      data-testid={getTestId<WorkspaceNavigationTestIds>('workspace-logo')}
      className={classnames(styles.logoContainer, {
        [styles.xxsmallLogoContainer]: size === 'xxsmall',
        [styles.xsmallLogoContainer]: size === 'xsmall',
        [styles.smallLogoContainer]: size === 'small',
        [styles.mediumLogoContainer]: size === 'medium',
      })}
    >
      {logoHash && !showDefaultLogo ? (
        <img
          className={classnames(styles.workspaceLogo, {
            [styles.desaturateLogo]: desaturate,
          })}
          src={`${logoDomain}/${logoHash}/30.${logoExt}`}
          srcSet={`${logoDomain}/${logoHash}/30.${logoExt} 1x, ${logoDomain}/${logoHash}/170.${logoExt} 2x`}
          alt={format('logo-for-team', { name: name || '' })}
          onError={handleImageError}
        />
      ) : // WorkspaceDefaultLogo uses the first letter of the name
      // if that's not present, just show the organization icon
      name ? (
        <WorkspaceDefaultLogo name={name} desaturate={desaturate} size={size} />
      ) : (
        <OrganizationIcon />
      )}
    </div>
  );
};
