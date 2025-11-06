import type { FunctionComponent, PropsWithChildren } from 'react';
import { createPortal } from 'react-dom';

import type { Layer } from './LayerManagerProvider';

interface LayerManagerPortalProps {
  layer: Layer;
}

export const LayerManagerPortal: FunctionComponent<
  PropsWithChildren<LayerManagerPortalProps>
> = ({ layer, children }) => {
  const portalElement = document.getElementById(layer);

  return portalElement ? createPortal(children, portalElement) : null;
};
