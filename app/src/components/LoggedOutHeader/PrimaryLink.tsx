import type { FunctionComponent, MouseEventHandler } from 'react';

import { token } from '@trello/theme';

import { ArrowRight } from './icons/ArrowRight';

import * as styles from './PrimaryLink.module.less';

interface PrimaryLinkProps {
  url: string;
  text: string;
  onClick?: MouseEventHandler;
  tabIndex?: number;
}

export const PrimaryLink: FunctionComponent<PrimaryLinkProps> = ({
  url,
  text,
  onClick,
  tabIndex,
}) => {
  return (
    <a
      className={styles.primaryLink}
      href={url}
      onClick={onClick}
      tabIndex={tabIndex}
    >
      {text}
      <ArrowRight color={token('color.icon.accent.blue', '#1D7AFC')} />
    </a>
  );
};
