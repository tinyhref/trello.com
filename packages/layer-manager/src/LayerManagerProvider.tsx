/* eslint-disable @eslint-react/no-create-ref -- Ref must be created in the module scope, so reuse always points to the same refs */
import type { FunctionComponent, PropsWithChildren, RefObject } from 'react';
import { createContext, createRef } from 'react';

import * as styles from './LayerManagerProvider.module.less';

const LayerManagerContext = createContext({
  alertLayerRef: createRef<HTMLDivElement>(),
  flagLayerRef: createRef<HTMLDivElement>(),
  overlayLayerRef: createRef<HTMLDivElement>(),
  popoverLayerRef: createRef<HTMLDivElement>(),
  tooltipLayerRef: createRef<HTMLDivElement>(),
});

type Ref = RefObject<HTMLDivElement>;

interface LayerManagerRefs {
  alertLayerRef: Ref;
  flagLayerRef: Ref;
  overlayLayerRef: Ref;
  popoverLayerRef: Ref;
  tooltipLayerRef: Ref;
}

export const Layers = {
  Alert: 'layer-manager-alert',
  Flag: 'layer-manager-flag',
  Overlay: 'layer-manager-overlay',
  CardBack: 'layer-manager-card-back',
  DiscoveryAd: 'layer-manager-discovery-ad',
  Popover: 'layer-manager-popover',
  Tooltip: 'layer-manager-tooltip',
} as const;
export type Layer = (typeof Layers)[keyof typeof Layers];

const layerRefs: LayerManagerRefs = {
  alertLayerRef: createRef<HTMLDivElement>(),
  flagLayerRef: createRef<HTMLDivElement>(),
  overlayLayerRef: createRef<HTMLDivElement>(),
  popoverLayerRef: createRef<HTMLDivElement>(),
  tooltipLayerRef: createRef<HTMLDivElement>(),
};

export const LayerManagerProvider: FunctionComponent<
  PropsWithChildren<unknown>
> = ({ children }) => (
  <LayerManagerContext.Provider value={layerRefs}>
    <div className={styles.appLayer}>{children}</div>
    {/*
     * Wrap these elements in a parent with the magic class that suppresses
     * the global click-handling logic (see doc-init.js#domReady method)
     */}
    <div className="js-react-root">
      <div className={styles.alertLayer} id={Layers.Alert} />
      <div className={styles.flagLayer} id={Layers.Flag} />
      <div className={styles.overlayLayer} id={Layers.Overlay} />
      <div
        // 'window-wrapper' class is temporarily here to make dropzone related css work.
        // See app/stylesheets/components/views/application/dialog.less
        // If should be removed after CardDetailView will be migrated to react
        className={`${styles.cardBackLayer} window-wrapper`}
        id={Layers.CardBack}
      />
      <div className={styles.discoveryAdLayer} id={Layers.DiscoveryAd} />
      <div tabIndex={-1} className={styles.popoverLayer} id={Layers.Popover} />
      <div className={styles.tooltipLayerRef} id={Layers.Tooltip} />
    </div>
  </LayerManagerContext.Provider>
);
