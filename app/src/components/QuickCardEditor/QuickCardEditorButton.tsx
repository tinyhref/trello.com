import cx from 'classnames';
import type {
  ForwardedRef,
  HTMLAttributes,
  MouseEventHandler,
  PropsWithChildren,
} from 'react';
import { forwardRef } from 'react';

import type { PositionType } from '@atlaskit/tooltip';
import { Button } from '@trello/nachos/button';
import { RouterLink } from '@trello/router/router-link';
import type { QuickCardEditorTestIds } from '@trello/test-ids';

import { ShortcutTooltip } from 'app/src/components/ShortcutTooltip';

import * as styles from './QuickCardEditorButton.module.less';

interface QuickCardEditorButtonProps
  extends HTMLAttributes<HTMLAnchorElement | HTMLButtonElement> {
  icon: JSX.Element;
  onClick?: MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
  href?: string;
  testId?: QuickCardEditorTestIds;
  /**
   * Temporary prop in order to maintain style parity with the old stack.
   * When `QuickCardEditorView` is deleted, we can remove this prop.
   * @default false
   */
  isLegacyView?: boolean;
  isSelected?: boolean;
  shortcutText?: string;
  shortcutKey?: string;
  position?: PositionType;
}

export const QuickCardEditorButton = forwardRef<
  HTMLAnchorElement | HTMLButtonElement,
  PropsWithChildren<QuickCardEditorButtonProps>
>(
  (
    {
      children,
      href,
      icon,
      isLegacyView = false,
      isSelected,
      shortcutText,
      shortcutKey,
      position,
      ...props
    },
    ref,
  ) => {
    const className = cx(
      styles.button,
      isLegacyView && styles['button--legacy'],
      !isSelected && styles['button--hover'],
    );

    let editorButton = (
      <Button
        className={className}
        iconBefore={icon}
        ref={ref as ForwardedRef<HTMLButtonElement>}
        isSelected={isSelected}
        {...props}
      >
        {children}
      </Button>
    );

    if (href) {
      editorButton = (
        <RouterLink
          className={className}
          href={href}
          ref={ref as ForwardedRef<HTMLAnchorElement>}
          {...props}
        >
          <span className={styles.icon}>{icon}</span>
          {children}
        </RouterLink>
      );
    }

    if (shortcutText && shortcutKey && position) {
      editorButton = (
        <ShortcutTooltip
          shortcutText={shortcutText}
          shortcutKey={shortcutKey}
          position={position}
        >
          {editorButton}
        </ShortcutTooltip>
      );
    }

    return <li>{editorButton}</li>;
  },
);
