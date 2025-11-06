import cx from 'classnames';
import { type FunctionComponent, type ReactNode } from 'react';

import {
  SpotlightManager,
  SpotlightTarget,
  SpotlightTransition,
} from '@trello/nachos/experimental-onboarding';

interface ConditionalNewInviteeSpotlightWrapperProps {
  children: ReactNode;
  shouldWrap: boolean;
  renderSpotlight: () => ReactNode;
  spotlightTargetName: string;
  hasTintedBlanket?: boolean;
  wrapperClassName?: string;
}

/**
 * A reusable wrapper component that conditionally wraps children with a Spotlight.
 * This component can be used to display spotlights (such as onboarding tours)
 * while allowing the component to still render normally when spotlights are not needed.
 */
export const ConditionalNewInviteeSpotlightWrapper: FunctionComponent<
  ConditionalNewInviteeSpotlightWrapperProps
> = ({
  children,
  shouldWrap,
  renderSpotlight,
  spotlightTargetName,
  hasTintedBlanket = false,
  wrapperClassName,
}) => {
  if (shouldWrap) {
    return (
      <SpotlightManager blanketIsTinted={hasTintedBlanket}>
        <SpotlightTarget name={spotlightTargetName}>
          {wrapperClassName ? (
            <div className={cx(wrapperClassName)}>{children}</div>
          ) : (
            children
          )}
        </SpotlightTarget>
        <SpotlightTransition>{renderSpotlight()}</SpotlightTransition>
      </SpotlightManager>
    );
  }
  return children;
};
