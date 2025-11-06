import cx from 'classnames';
import type { FunctionComponent, MouseEventHandler, ReactNode } from 'react';
import { forwardRef, useCallback, useEffect, useState } from 'react';
import FocusLock from 'react-focus-lock';

import { useForwardRef } from '@trello/dom-hooks';
import type { Layer } from '@trello/layer-manager';
import { Layers } from '@trello/layer-manager';
import { forNamespace } from '@trello/legacy-i18n';
import { Button } from '@trello/nachos/button';
import type { GlyphProps } from '@trello/nachos/icon';
import { CloseIcon } from '@trello/nachos/icons/close';
import type { OverlayAlignment, OverlayEffect } from '@trello/nachos/overlay';
import { Overlay } from '@trello/nachos/overlay';
import type { IconColor } from '@trello/theme';
import { token } from '@trello/theme';

import * as styles from './Dialog.module.less';

const format = forNamespace();

/**
 * Callback function fired when Dialog is shown
 * @callback onShowCallback
 */

/**
 * Callback function fired when Dialog is shown
 * @callback onHideCallback
 */

/**
 * @typedef UseDialogHookConfigOptions
 * @type {object}
 * @property {onShowCallback} onShow
 * @property {onHideCallback} onHide
 */
interface UseDialogHookConfigOptions {
  onShow?: () => void;
  onHide?: () => void;
}

/**
 * useDialog React hook. Used to manage show/hide state for a Dialog component
 *
 * @usage
 * ```js
 * const { show, dialogProps } = useDialog({
 *   onShow: () => console.log('dialog was shown'),
 *   onHide: () => console.log('dialog was hidden'),
 * });
 *
 * return (
 *  <div>
 *    <button onClick={show}>
 *      Click me to show the dialog!
 *    </button>
 *    <Dialog title="Example dialog" {...dialogProps}>
 *      I am a dialog
 *    </Dialog>
 *  </div>
 * );
 * ```
 *
 * @function useDialog
 * @param {UseDialogHookConfigOptions} [opts]
 */
export const useDialog = (opts?: UseDialogHookConfigOptions) => {
  const { onShow, onHide } = (opts ?? {}) as UseDialogHookConfigOptions;

  const [isOpen, setIsOpen] = useState(false);
  const show = useCallback(() => {
    setIsOpen(true);
    onShow?.();
  }, [setIsOpen, onShow]);

  const hide = useCallback(() => {
    setIsOpen(false);
    onHide?.();
  }, [setIsOpen, onHide]);

  const toggle = useCallback(() => {
    if (isOpen) {
      hide();
    } else {
      show();
    }
  }, [isOpen, show, hide]);

  return {
    show,
    hide,
    toggle,
    isOpen,
    dialogProps: {
      show,
      hide,
      toggle,
      isOpen,
    },
  };
};

interface DialogCloseButtonProps {
  className?: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
  size?: GlyphProps['size'];
  /**
   * Set the color of the CloseIcon component.
   *
   * @default token('color.text.accent.gray.bolder')
   */
  iconColor?: IconColor;
}

const defaultIconColor = token('color.text.accent.gray.bolder', '#091E42');

export const DialogCloseButton: FunctionComponent<DialogCloseButtonProps> = ({
  className,
  onClick,
  size = 'large',
  iconColor = defaultIconColor,
}) => (
  <Button
    aria-label={format('close dialog')}
    iconBefore={<CloseIcon color={iconColor} size={size} />}
    className={cx({
      [styles.closeButton]: true,
      [String(className)]: !!className,
    })}
    onClick={onClick}
    style={{ color: iconColor }}
  />
);

export interface DialogProps {
  /**
   * Optional classname applied to root Dialog container element
   */
  className?: string;

  /**
   * Width of the Dialog. Defaults to "medium"
   */
  size?: 'large' | 'medium' | 'small';

  /**
   * Contents of the Dialog
   */
  children: ReactNode;

  /**
   * Whether the Dialog is open. Provided by `useDialog` hook via `dialogProps`
   */
  isOpen?: boolean;

  /**
   * Callback function to show the Dialog. Provided by useDialog hook via `dialogProps`
   */
  show: () => void;

  /**
   * Callback function to hide the Dialog. Provided by useDialog hook via `dialogProps`
   */
  hide: () => void;

  /**
   * Callback function to toggle the Dialog. Provided by useDialog hook via `dialogProps`
   */
  toggle: () => void;

  /**
   * Should this Dialog close when the Escape key is pressed?
   */
  closeOnEscape?: boolean;

  /**
   * Should this Dialog close when the outside of the Dialog is clicked?
   */
  closeOnOutsideClick?: boolean;

  /**
   * Specify the alignment of the dialog.
   *
   * @default 'top'
   */
  alignment?: OverlayAlignment;

  /**
   * Visual effect of the overlay/blanket.
   *
   * @default 'default'
   */
  effect?: OverlayEffect;

  /**
   * Whether or not focus should be contained inside the Dialog so users cannot move focus outside without first closing the Dialog.
   *
   * @default false
   */
  dangerous_disableFocusTrapping?: boolean;

  /**
   * Defines the the layer to render the dialog in.
   * Was added as an exception for the Card Back
   */
  layer?: Layer;

  /**
   * https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-labelledby
   */
  labelledBy?: string;

  /**
   * The unique identifier for the FocusLock component.
   * Used to group focus lock instances together.
   */
  focusLockGroup?: string;
}

export const Dialog = forwardRef<HTMLDivElement, DialogProps>(
  (
    {
      className,
      size = 'medium',
      isOpen,
      show,
      hide,
      children,
      closeOnEscape = true,
      closeOnOutsideClick = true,
      alignment = 'top',
      effect,
      dangerous_disableFocusTrapping = false,
      layer = Layers.Overlay,
      labelledBy,
      focusLockGroup,
    },
    forwardedRef,
  ) => {
    const isBlurEnabled = document.body.classList.contains('overlay-blur');
    const ref = useForwardRef(forwardedRef);

    const overlayEffect = (effect ?? isBlurEnabled) ? 'blur' : 'default';

    // Autofocus the dialog container element when the Dialog is opened.
    useEffect(() => {
      if (isOpen) {
        ref.current?.focus({
          preventScroll: true,
        });
      }
    }, [ref, isOpen]);

    if (!isOpen) {
      return null;
    }

    return (
      <Overlay
        alignment={alignment}
        effect={overlayEffect}
        closeOnEscape={closeOnEscape}
        closeOnOutsideClick={closeOnOutsideClick}
        onClose={hide}
        layer={layer}
      >
        <FocusLock
          group={focusLockGroup}
          disabled={dangerous_disableFocusTrapping}
          returnFocus={true}
          autoFocus
        >
          <div
            className={cx({
              [styles.dialog]: true,
              [String(className)]: !!className,
              [styles[size]]: !!size,
            })}
            tabIndex={-1}
            ref={ref}
            role="dialog"
            aria-modal
            aria-labelledby={labelledBy}
            data-testid={labelledBy}
          >
            <div className={styles.body}>{children}</div>
          </div>
        </FocusLock>
      </Overlay>
    );
  },
);
