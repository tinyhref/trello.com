import cx from 'classnames';
import { forwardRef } from 'react';
import type { ReactNode } from 'react';

import { SpotlightTarget } from '@trello/nachos/experimental-onboarding';

import * as styles from './IslandNav.module.less';

export interface ButtonGroup {
  id: string;
  content: ReactNode;
  groupClassName?: string;
}

interface BaseIslandNavProps {
  buttonGroupClassName?: string;
  className?: string;
  isFullWidth?: boolean;
  testId?: string;
  spotlightTargetName?: string;
  hideSpotlight?: boolean;
}

interface SingleGroupIslandNavProps extends BaseIslandNavProps {
  children: ReactNode;
  buttonGroups?: never;
}

interface MultiGroupIslandNavProps extends BaseIslandNavProps {
  children?: never;
  buttonGroups: ButtonGroup[];
}

// Using discriminated union to allow either a single group or multiple groups
// but not both to match the behavior of renderButtonGroups
type IslandNavProps = MultiGroupIslandNavProps | SingleGroupIslandNavProps;

export const IslandNav = forwardRef<HTMLElement, IslandNavProps>(
  (
    {
      children,
      buttonGroups,
      buttonGroupClassName,
      className,
      isFullWidth = false,
      testId,
      spotlightTargetName,
      hideSpotlight,
    },
    ref,
  ) => {
    const renderButtonGroups = () => {
      if (buttonGroups?.length) {
        return buttonGroups.map((group) => (
          <div
            key={group.id}
            className={cx(
              styles.buttonGroup,
              buttonGroupClassName,
              group.groupClassName,
            )}
            role="group"
          >
            {group.content}
          </div>
        ));
      }

      return (
        <div
          // the id is used for the skip navigation link to allow users to jump to this section of the page
          id="island-nav"
          className={cx(styles.buttonGroup, buttonGroupClassName)}
          role="group"
        >
          {children}
        </div>
      );
    };

    /**
     * If a spotlight target name is provided, wrap the children in a
     * spotlight and pass the spotlight target name to the spotlight.
     *
     * Normally we would wrap this component in a SpotlightTarget but
     * in this case the nav element would be the target which
     * doesn't result in the correct targeting for the spotlight.
     *
     * We only want to target the children of the nav element with the
     * spotlight.
     *
     *  */
    if (spotlightTargetName && !hideSpotlight) {
      return (
        <nav
          className={cx(
            {
              [styles.islandNav]: true,
              [styles.fullWidth]: isFullWidth,
            },
            className,
          )}
          ref={ref}
          data-testid={testId}
        >
          <SpotlightTarget name={spotlightTargetName}>
            {renderButtonGroups()}
          </SpotlightTarget>
        </nav>
      );
    }

    return (
      <nav
        className={cx(
          {
            [styles.islandNav]: true,
            [styles.fullWidth]: isFullWidth,
          },
          className,
        )}
        ref={ref}
        data-testid={testId}
      >
        {renderButtonGroups()}
      </nav>
    );
  },
);
