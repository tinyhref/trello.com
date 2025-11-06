import cx from 'classnames';
import type { FunctionComponent } from 'react';
import { useCallback } from 'react';

import { Analytics } from '@trello/atlassian-analytics';
import { SearchIcon } from '@trello/nachos/icons/search';
import type { HeaderTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';
import { getSearchUrl } from '@trello/urls';

import { HeaderLink } from './HeaderLink';

import * as styles from './HeaderSearchButton.module.less';

interface HeaderSearchButtonProps {
  griffinNavEnabled?: boolean;
}

export const HeaderSearchButton: FunctionComponent<HeaderSearchButtonProps> = ({
  griffinNavEnabled,
}) => {
  const onClick = useCallback(() => {
    Analytics.sendClickedButtonEvent({
      buttonName: 'HeaderSearchButton',
      source: 'appHeader',
    });
  }, []);
  return (
    <span className={styles.searchButton}>
      <HeaderLink
        className={cx(styles.searchIcon, {
          [styles.griffin]: griffinNavEnabled,
        })}
        href={getSearchUrl()}
        onClick={onClick}
        testId={getTestId<HeaderTestIds>('header-search-button')}
      >
        <SearchIcon color="var(--dynamic-icon)" size="medium" />
      </HeaderLink>
    </span>
  );
};
