import classNames from 'classnames';
import type {
  FunctionComponent,
  MouseEventHandler,
  PropsWithChildren,
  KeyboardEvent as ReactKeyboardEvent,
} from 'react';

import { Key } from '@trello/keybindings';
import { CheckIcon } from '@trello/nachos/icons/check';
import { token } from '@trello/theme';
import { unsplashClient } from '@trello/unsplash';

import type { BackgroundItemProps } from './BackgroundItem';

// eslint-disable-next-line @trello/less-matches-component
import * as styles from './BackgroundPickerPopover.module.less';

const stopPropagationHandler: MouseEventHandler = (e) => e.stopPropagation();

const keyHandler = (cb: () => void) => (e: ReactKeyboardEvent) => {
  const { key } = e;
  if (key === Key.Enter) {
    cb();
  }
};

export const BackgroundPopoverItem: FunctionComponent<
  PropsWithChildren<BackgroundItemProps>
> = ({
  children,
  color,
  image,
  isPhoto,
  title,
  selected,
  onSelect,
  user,
  testId,
}) => (
  <li className={classNames(styles.backgroundGridItem)} data-testid={testId}>
    <div
      className={classNames(styles.backgroundGridTrigger, {
        [styles.selectedPhoto]: isPhoto && selected,
      })}
      role="radio"
      aria-checked={selected}
      tabIndex={0}
      title={title}
      style={{
        backgroundColor: color,
        backgroundImage: image && `url("${image}")`,
      }}
      onClick={onSelect}
      onKeyDown={keyHandler(onSelect)}
    >
      {children}
      {selected && (
        <CheckIcon
          size="small"
          color={token('color.icon.inverse', '#FFFFFF')}
          block
        />
      )}
      {!!user && (
        <a
          title={user.name}
          target="_blank"
          rel="noopener noreferrer"
          href={unsplashClient.appendAttribution(user.links.html)}
          className={styles.photoAttributionLink}
          onClick={stopPropagationHandler}
        >
          {user.name}
        </a>
      )}
    </div>
  </li>
);
