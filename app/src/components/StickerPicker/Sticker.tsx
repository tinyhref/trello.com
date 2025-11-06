import cx from 'classnames';
import type { PropsWithChildren } from 'react';
import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';

import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { disableNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview';
import { preserveOffsetOnSource } from '@atlaskit/pragmatic-drag-and-drop/element/preserve-offset-on-source';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
import { isSafari } from '@trello/browser';
import { useForwardRef } from '@trello/dom-hooks';
import type { Sticker as StickerType } from '@trello/stickers';

import * as styles from './Sticker.module.less';

export type DraggableStickerData = {
  type: 'trello/sticker';
  image: string;
  url: string;
  scaled: {
    width: number;
    height: number;
    url: string;
  }[];
  rotate: number;
};

export const isDraggableSticker = (
  data: Record<string | symbol, unknown>,
): data is DraggableStickerData => {
  return 'type' in data && data.type === 'trello/sticker';
};

export interface StickerProps extends StickerType {
  className?: string;
}

export const Sticker = forwardRef<
  HTMLDivElement,
  PropsWithChildren<StickerProps>
>(({ children, className, image, scaled, url }, ref) => {
  const forwardedRef = useForwardRef(ref);
  const imageRef = useRef<HTMLImageElement>(null);

  // Use React states to manage peeling effect, because CSS hover is imprecise
  // over our transformations:
  const [isPeeling, setIsPeeling] = useState(false);
  const onMouseEnter = useCallback(() => setIsPeeling(true), []);
  const onMouseLeave = useCallback(() => setIsPeeling(false), []);

  useEffect(() => {
    const containerElement = forwardedRef.current;
    const imageElement = imageRef.current;
    if (!containerElement || !imageElement) {
      return;
    }

    return draggable({
      element: containerElement,
      getInitialData: () => {
        const data: DraggableStickerData = {
          type: 'trello/sticker',
          image,
          url,
          scaled,
          rotate: Math.random() * 20 - 10,
        };
        return data;
      },
      onGenerateDragPreview({ nativeSetDragImage, source, location }) {
        disableNativeDragPreview({ nativeSetDragImage });
        setCustomNativeDragPreview({
          getOffset: preserveOffsetOnSource({
            element: source.element,
            input: location.current.input,
          }),
          render({ container }) {
            const preview = imageElement.cloneNode(true) as HTMLElement;
            if (!isSafari() && isDraggableSticker(source.data)) {
              preview.style.transform = `rotate(${source.data.rotate}deg)`;
            }
            preview.dataset.dragPreview = 'true';
            container.appendChild(preview);
          },
          nativeSetDragImage,
        });
      },
    });
  }, [forwardedRef, image, scaled, url]);

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className={cx(styles.sticker, isPeeling && styles.isPeeling, className)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      ref={forwardedRef}
    >
      <img src={url} alt={image} className={styles.shadow} draggable={false} />
      <img
        src={url}
        alt={image}
        className={styles.fixed}
        draggable={false}
        ref={imageRef}
      />
      <img src={url} alt={image} className={styles.peel} draggable={false} />

      {children}
    </div>
  );
});
