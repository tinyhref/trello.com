import type { FocusEventHandler, TextareaHTMLAttributes } from 'react';
import { forwardRef, useCallback, useEffect } from 'react';

import { useForwardRef } from '@trello/dom-hooks';
import type { TestId } from '@trello/test-ids';

import { setHeight } from './setHeight';

export type AutosizeTextareaProps =
  TextareaHTMLAttributes<HTMLTextAreaElement> & {
    shouldFocus?: boolean;
    bufferHeight?: number;
    minHeight?: number;
    testId?: TestId;
  };

export const AutosizeTextarea = forwardRef<
  HTMLTextAreaElement,
  AutosizeTextareaProps
>(
  (
    {
      value,
      onChange,
      onFocus: _onFocus,
      shouldFocus,
      testId,
      bufferHeight = 0,
      minHeight = 0,
      ...props
    },
    ref,
  ) => {
    const forwardedRef = useForwardRef(ref);
    useEffect(() => {
      if (shouldFocus && forwardedRef.current) {
        const textarea = forwardedRef.current;
        const timeout = setTimeout(
          () => textarea.focus({ preventScroll: true }),
          0,
        );
        return () => clearTimeout(timeout);
      }
    }, [shouldFocus, forwardedRef]);

    const resize = useCallback(() => {
      const textarea = forwardedRef.current;
      if (!textarea) return;

      // We need to reset the height briefly so that we can correctly
      // recalculate the element's scrollHeight.
      setHeight(textarea, 0);

      // We then set the height directly, outside of the render loop.
      if (minHeight && minHeight >= textarea.scrollHeight) {
        setHeight(textarea, minHeight + bufferHeight);
      } else {
        setHeight(textarea, textarea.scrollHeight + bufferHeight);
      }
    }, [forwardedRef, bufferHeight, minHeight]);

    // Automatically resize the textarea as the value is updated.
    useEffect(() => {
      resize();
    }, [resize, value]);

    const onFocus = useCallback<FocusEventHandler<HTMLTextAreaElement>>(
      (e) => {
        resize();
        _onFocus?.(e);
      },
      [_onFocus, resize],
    );

    return (
      <textarea
        ref={forwardedRef}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        data-testid={testId}
        {...props}
      />
    );
  },
);
