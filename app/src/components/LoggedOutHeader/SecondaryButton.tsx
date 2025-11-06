import type { FunctionComponent, MouseEventHandler } from 'react';

import * as styles from './SecondaryButton.module.less';

interface SecondaryButtonProps {
  url: string;
  text: string;
  onClick?: MouseEventHandler;
  tabIndex?: number;
}

export const SecondaryButton: FunctionComponent<SecondaryButtonProps> = ({
  url,
  text,
  onClick,
  tabIndex,
}) => {
  return (
    <a
      className={styles.buttonLink}
      href={url}
      onClick={onClick}
      tabIndex={tabIndex}
    >
      {text}
    </a>
  );
};
