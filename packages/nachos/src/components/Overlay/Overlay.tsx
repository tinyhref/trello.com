import classNames from 'classnames';
import type { FunctionComponent, PropsWithChildren } from 'react';
import { useCallback, useEffect, useMemo, useRef } from 'react';

import { useCallbackRef } from '@trello/dom-hooks';
import { Key, Scope, useShortcut } from '@trello/keybindings';
import type { Layer } from '@trello/layer-manager';
import {
  activeAkPortals,
  ELEVATION_ATTR,
  getHighestVisibleElevation,
  LayerManagerPortal,
  Layers,
  useClickOutsideHandler,
} from '@trello/layer-manager';

import { addActiveOverlay, removeActiveOverlay } from './overlayState';

import * as styles from './Overlay.module.less';

export type OverlayAlignment = 'bottom' | 'center' | 'top';
export type OverlayEffect = 'blur' | 'default';

interface OverlayProps {
  alignment?: OverlayAlignment;
  effect?: OverlayEffect;
  className?: string;
  closeOnEscape?: boolean;
  closeOnOutsideClick?: boolean;
  layer?: Layer;
  onClose: () => void;
}

const noop = () => {};

export const Overlay: FunctionComponent<PropsWithChildren<OverlayProps>> = ({
  alignment,
  effect = 'default',
  className = '',
  closeOnEscape,
  closeOnOutsideClick = true,
  layer = Layers.Overlay,
  onClose = noop,
  children,
}) => {
  const [contentsElement, contentsRef] = useCallbackRef<HTMLDivElement>();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    addActiveOverlay(ref);
    return () => {
      removeActiveOverlay(ref);
    };
  }, []);

  const handleEscape = useCallback(() => {
    // Certain Atlaskit component wire up their own escape handlers,
    // and they're set up as event listeners directly on the document, so we
    // should ignore keypresses when this is true.
    if (
      activeAkPortals.has('blanket') ||
      activeAkPortals.has('dialog') ||
      activeAkPortals.has('modal') ||
      activeAkPortals.has('spotlight')
    ) {
      return;
    }
    onClose();
  }, [onClose]);

  useShortcut(handleEscape, {
    enabled: closeOnEscape,
    key: Key.Escape,
    scope: Scope.Overlay,
  });

  // Set up an 'elevation aware' outside click handler
  // to detect clicks outside the content of the overlay
  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (event.defaultPrevented) {
        return;
      }
      onClose();
    },
    [onClose],
  );

  useClickOutsideHandler({
    element: contentsElement,
    handleClickOutside,
    skip: !closeOnOutsideClick,
  });

  // Taking advantage of lazy state initialization here, as we want to
  // calculate this value on first render and persist it for the entire life-
  // cycle
  const elevation = useMemo(() => getHighestVisibleElevation() + 1, []);

  useEffect(() => {
    document.body.classList.add('react-overlay-up');

    return () => {
      document.body.classList.remove('react-overlay-up');
    };
  }, []);

  return (
    <LayerManagerPortal layer={layer}>
      <div
        ref={ref}
        className={classNames(
          { [styles.alignTop]: alignment === 'top' },
          { [styles.alignCenter]: alignment === 'center' },
          { [styles.alignBottom]: alignment === 'bottom' },
          { [styles.effectBlur]: effect === 'blur' },
          styles.overlay,
          className,
        )}
      >
        <div
          ref={contentsRef}
          className={styles.contents}
          {...{ [ELEVATION_ATTR]: elevation }}
        >
          {children}
        </div>
      </div>
    </LayerManagerPortal>
  );
};
