import type { ComponentProps, FunctionComponent, Ref } from 'react';
import { forwardRef } from 'react';

import type { PositionType } from '@atlaskit/tooltip';
import { Tooltip, TooltipPrimitive } from '@trello/nachos/tooltip';

import * as styles from './NotificationTooltip.module.less';

const CustomNotificationTooltip = forwardRef(
  (
    props: ComponentProps<typeof TooltipPrimitive>,
    ref: Ref<HTMLDivElement>,
  ) => {
    const { children, ...rest } = props;
    return (
      <TooltipPrimitive
        {...rest}
        ref={ref}
        className={styles.notificationTooltip}
      >
        {children}
      </TooltipPrimitive>
    );
  },
);

interface NotificationTooltipProps
  extends Omit<ComponentProps<typeof Tooltip>, 'content'> {
  shortcutText: string;
  shortcutKey: string;
  shortcutKeyDescription?: string;
  position?: PositionType;
}

export const NotificationTooltip: FunctionComponent<
  NotificationTooltipProps
> = ({
  children,
  shortcutText,
  shortcutKey,
  shortcutKeyDescription,
  position,
  ...rest
}) => {
  return (
    <Tooltip
      content={
        <>
          {shortcutText}
          <span className={styles.tooltipShortcut}>{shortcutKey}</span>
        </>
      }
      component={CustomNotificationTooltip}
      position={position}
      hideTooltipOnClick
      {...rest}
    >
      {children}
    </Tooltip>
  );
};
