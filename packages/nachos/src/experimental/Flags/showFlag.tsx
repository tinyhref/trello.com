import type { ReactNode } from 'react';

import ErrorIcon from '@atlaskit/icon/core/status-error';
import { Analytics } from '@trello/atlassian-analytics';
import { getScreenFromUrl } from '@trello/marketing-screens';
import { CheckCircleIcon } from '@trello/nachos/icons/check-circle';
import { InformationIcon } from '@trello/nachos/icons/information';
import { WarningIcon } from '@trello/nachos/icons/warning';
import { token } from '@trello/theme';

import { flagsState } from './flagsState';
import type { AppearanceTypes, DismissFlagArgs, FlagArgs } from './types';

import * as styles from './Flag.module.less';

export const dismissFlag = ({
  id,
  seed,
  dismissedVia = 'programmatic',
}: DismissFlagArgs) => {
  flagsState.setValue((current: FlagArgs[]) => {
    const filtered = current.filter(
      (flag) => flag.id !== id || flag.seed !== seed,
    );

    // Only track manual dismissals; tracking auto just doubles our event load.
    if (dismissedVia !== 'auto' && current.length !== filtered.length) {
      Analytics.sendDismissedComponentEvent({
        componentType: 'flag',
        componentName: id,
        source: getScreenFromUrl(),
        attributes: { dismissedVia },
      });
    }

    return filtered;
  });
};

interface FlagImage {
  src: string;
  alt?: string;
}

export interface ShowFlagArgs extends Omit<FlagArgs, 'icon'> {
  /**
   * Matches appearances defined in Atlaskit, but we always use the default
   * appearance under the hood to opt out of opinionated presets. Instead,
   * this maps to a commonly paired icon for convenience.
   */
  appearance?: AppearanceTypes;
  /**
   * Custom icon to pass in. Overrides whatever is mapped to `appearance`.
   */
  icon?: ReactNode;
  /** Convenience option to pass in an image asset to use as an icon.
   * Overrides `icon` and `appearance` props.
   */
  image?: FlagImage;
}

const getFlagIconForImage = ({ src, alt }: FlagImage): ReactNode => (
  <img className={styles.imageIcon} src={src} alt={alt} />
);

/** Most of the time, rendering an icon when dispatching a flag is too bulky;
 * this maps the existing appearance icon to a common icon. Custom icons are
 * still supported where desired.
 */
const mapAppearanceToIcon = (appearance?: AppearanceTypes): ReactNode => {
  switch (appearance) {
    case 'error':
      return (
        <ErrorIcon label="" color={token('color.icon.danger', '#C9372C')} />
      );
    case 'success':
      return (
        <CheckCircleIcon
          color={token('color.icon.accent.green', '#22A06B')}
          size="large"
        />
      );
    case 'warning':
      return (
        <WarningIcon
          label="Warning"
          color={token('color.icon.accent.yellow', '#B38600')}
          size="large"
        />
      );
    case 'info':
    case 'normal':
    default:
      return <InformationIcon size="large" />;
  }
};

export const showFlag = ({
  appearance,
  icon,
  image,
  isAutoDismiss,
  msTimeout,
  truncateDescription,
  ...args
}: ShowFlagArgs) => {
  const flag: FlagArgs = {
    ...args,
    icon: image
      ? getFlagIconForImage(image)
      : (icon ?? mapAppearanceToIcon(appearance)),
    isAutoDismiss: isAutoDismiss ?? !!msTimeout,
    msTimeout,
    truncateDescription,
  };
  flagsState.setValue((current: FlagArgs[]) => {
    const index = current.findIndex(
      ({ id, seed }) => id === flag.id && seed === flag.seed,
    );
    // If flag is not found, add it
    if (index === -1) {
      Analytics.sendOperationalEvent({
        actionSubject: 'flag',
        actionSubjectId: flag.id,
        action: 'shown',
        source: getScreenFromUrl(),
        attributes: {
          appearance,
          concurrentCount: current.length,
          isReplacement: false,
        },
      });
      return [flag, ...current];
    }
    // If flag already exists, replace it
    const shallow: FlagArgs[] = [...current];
    Analytics.sendOperationalEvent({
      actionSubject: 'flag',
      actionSubjectId: flag.id,
      action: 'shown',
      source: getScreenFromUrl(),
      attributes: {
        appearance,
        // If we're replacing the current flag, don't count it as concurrent,
        // since we're not adding to the number of flags currently visible.
        concurrentCount: current.length - 1,
        isReplacement: true,
      },
    });
    shallow[index] = flag;
    return shallow;
  });
  return () => dismissFlag({ id: flag.id, seed: flag.seed });
};
