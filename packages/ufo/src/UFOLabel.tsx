import { kebabCase } from 'change-case';
import {
  useContext,
  type FunctionComponent,
  type PropsWithChildren,
} from 'react';

import _UFOLabel from '@atlaskit/react-ufo/label';
import _UFOLoadHold from '@atlaskit/react-ufo/load-hold';

import type { LabelExperienceKey } from './experiences';
import { UFOGateContext } from './UFOGate';

/**
 * Props for the UFOLabel component.
 */
type UFOLabelProps = {
  /**
   * The name identifier for this UFO label. Will be converted to kebab-case.
   */
  name: LabelExperienceKey;

  /**
   * Indicates if this label is currently in a loading state.
   * When true, a UFO load hold will be applied to this label.
   * @defaultValue false
   */
  isLoading?: boolean;
};

/**
 * A UFO Label component used to annotate part of the react tree with a name.
 * Used to annotate part of the react tree with a name.
 *
 * A feature gate can be specified in a parent {@link UFOGateContext} to return the children directly in cases where
 * the gate is false for incremental rollout.
 *
 * @param name - The name identifier for this label
 * @param isLoading - (Optional, defaults to `false`) Whether this label is currently loading
 *
 * @example
 * ```tsx
 * // Regular Label Wrapper
 * <UFOLabel name="sidebar">
 *   <Sidebar />
 * </UFOLabel>
 * ```
 */
export const UFOLabel: FunctionComponent<PropsWithChildren<UFOLabelProps>> = ({
  children,
  name,
  isLoading = false,
}) => {
  const featureGateEnabled = useContext(UFOGateContext);

  if (!featureGateEnabled) {
    return children;
  }

  const kebabedName = kebabCase(name);
  return (
    <_UFOLabel name={kebabedName}>
      {isLoading ? <_UFOLoadHold name={kebabedName} /> : null}
      {children}
    </_UFOLabel>
  );
};
