import classNames from 'classnames';
import type { Ref } from 'react';
import { forwardRef } from 'react';

import type { TooltipPrimitiveProps } from '@atlaskit/tooltip';
import { TooltipPrimitive } from '@atlaskit/tooltip';

import * as styles from './TooltipPrimitiveLight.module.less';

export const TooltipPrimitiveLight = forwardRef(
  (props, ref: Ref<HTMLDivElement>) => {
    // forwardRef expects props without ref: Omit<TooltipPrimitiveProps, "ref">
    // the code below looks like it was intentionally written to remove the ref prop
    // so I've used "as TooltipPrimitiveProps" to maintain original functionality
    const {
      className,
      ref: wrongRef,
      ...rest
    } = props as TooltipPrimitiveProps;
    return (
      <TooltipPrimitive
        // eslint-disable-next-line @atlaskit/design-system/no-unsafe-style-overrides
        className={classNames(className, styles.tooltipPrimitiveLight)}
        ref={ref}
        {...rest}
      />
    );
  },
);
