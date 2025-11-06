// (Mostly) lifted directly from @atlaskit/flag.

import cx from 'classnames';
import type { ReactElement } from 'react';
import { createContext, useContext, useMemo } from 'react';

import { ExitingPersistence, SlideIn } from '@atlaskit/motion';
import type { PIIString } from '@trello/privacy';

import type { DismissFlagArgs } from './types';

import * as styles from './Flag.module.less';

export const FLAG_GROUP_ID = 'FlagGroup';

interface ChildrenProps {
  id: number | string;
  seed?: PIIString | string;
}

interface Props {
  children?: Array<ReactElement<ChildrenProps>> | ReactElement<ChildrenProps>;
  onDismissed?: (args: DismissFlagArgs) => void;
}

interface FlagGroupAPI {
  onDismissed?: (args: DismissFlagArgs) => void;
  dismissAllowed: (id: number | string, seed?: PIIString | string) => boolean;
}

export const FlagGroupContext = createContext<FlagGroupAPI>({
  dismissAllowed: () => false,
});

export function useFlagGroup() {
  return useContext(FlagGroupContext);
}

export const FlagGroup = (props: Props) => {
  const { children, onDismissed } = props;

  const renderChildren = () => {
    if (!children) {
      return null;
    }

    // Handle children as an array or a single React Node
    const childrenArray = Array.isArray(children) ? children : [children];

    return childrenArray.map((flag, index) => {
      const isDismissAllowed: boolean = index === 0;
      return (
        <SlideIn
          // We're allowing PIIString to be used in a template literal here since it's just for a React key. (Consistent with Flags.tsx)
          // eslint-disable-next-line @trello/disallow-altering-privacy-fields
          key={`${flag.props.id}-${flag.props.seed}`}
          enterFrom="left"
          fade="inout"
          duration="medium"
          animationTimingFunction="ease-in"
        >
          {({ className: keyframeMotionClass }) => (
            <div
              className={cx(
                { [styles.dismissAllowed]: isDismissAllowed },
                keyframeMotionClass,
                styles.flagGroupChildren,
              )}
            >
              {flag}
            </div>
          )}
        </SlideIn>
      );
    });
  };

  const hasFlags = Array.isArray(children)
    ? children.length > 0
    : Boolean(children);

  let firstFlagId: number | string | null = null;
  let firstSeedId: PIIString | string | null | undefined = null;
  if (hasFlags && children) {
    firstFlagId = Array.isArray(children)
      ? children[0].props.id
      : children.props.id;
    firstSeedId = Array.isArray(children)
      ? children[0].props.seed
      : children.props.seed;
  }

  const api: FlagGroupAPI = useMemo(
    () => ({
      onDismissed,
      dismissAllowed: (id, seed) => id === firstFlagId && seed === firstSeedId,
    }),
    [firstFlagId, firstSeedId, onDismissed],
  );

  return (
    <FlagGroupContext.Provider value={api}>
      <div id={FLAG_GROUP_ID} className={styles.flagGroup}>
        {hasFlags ? (
          <h2 className={styles.flagGroupLabel}>Flag notifications</h2>
        ) : null}
        <ExitingPersistence appear={false}>
          {renderChildren()}
        </ExitingPersistence>
      </div>
    </FlagGroupContext.Provider>
  );
};
