import cx from 'classnames';
import type { PropsWithChildren } from 'react';
import { forwardRef } from 'react';
import { FormattedMessage } from 'react-intl';

import { DRAG_SCROLL_DISABLED_ATTRIBUTE } from 'app/src/enableDragScroll';

import * as styles from './ListComposerLimitMessage.module.less';

interface ListComposerLimitMessageProps {
  hasTooManyTotalLists: boolean;
  className?: string;
}

export const ListComposerLimitMessage = forwardRef<
  HTMLDivElement,
  PropsWithChildren<ListComposerLimitMessageProps>
>(({ className, hasTooManyTotalLists }, ref) => (
  <div
    className={cx(styles.limitMessage, className)}
    ref={ref}
    {...{ [DRAG_SCROLL_DISABLED_ATTRIBUTE]: true }}
    data-testid="list-composer-limit-message"
  >
    {hasTooManyTotalLists ? (
      <FormattedMessage
        id="templates.list_add.you-have-too-many-lists"
        defaultMessage="You have too many lists"
        description="The message displayed when a user has too many lists"
      />
    ) : (
      <FormattedMessage
        id="templates.list_add.you-have-too-many-open-lists"
        defaultMessage="You have too many open lists"
        description="The message displayed when a user has too many open lists"
      />
    )}
  </div>
));
