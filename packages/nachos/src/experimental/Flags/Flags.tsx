import type { FunctionComponent } from 'react';

import { useSharedState } from '@trello/shared-state';

import { AutoDismissFlag } from './AutoDismissFlag';
import { Flag } from './Flag';
import { FlagGroup } from './FlagGroup';
import { flagsState } from './flagsState';
import { dismissFlag } from './showFlag';

export const Flags: FunctionComponent = () => {
  const [flags] = useSharedState(flagsState);
  return (
    <FlagGroup onDismissed={dismissFlag}>
      {flags.map((flag) => {
        const { isAutoDismiss, ...restProps } = flag;
        const FlagType = isAutoDismiss ? AutoDismissFlag : Flag;
        // We're allowing PIIString to be used in a template literal here since it's just for a React key.
        // eslint-disable-next-line @trello/disallow-altering-privacy-fields
        return <FlagType key={`${flag.id}-${flag.seed}`} {...restProps} />;
      })}
    </FlagGroup>
  );
};
