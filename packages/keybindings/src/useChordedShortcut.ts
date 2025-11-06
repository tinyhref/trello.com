import { useCallback, useEffect, useState } from 'react';

import {
  pauseShortcuts,
  registerShortcut,
  resumeShortcuts,
  unregisterShortcut,
} from './shortcuts';
import type {
  RegisterShortcutOptions,
  ShortcutEvent,
  ShortcutHandler,
} from './types';
import { Scope } from './types';

interface RegisterChordedShortcutOptions extends RegisterShortcutOptions {
  /**
   * Use this to perform any side effects when the chording sequence starts,
   * e.g. showing a flag to indicate that we're listening for the next key.
   */
  onStartChording?: () => void;
}

export const useChordedShortcut = (
  callback: ShortcutHandler,
  {
    key,
    enabled = true,
    scope = Scope.Default,
    onStartChording,
  }: RegisterChordedShortcutOptions,
) => {
  const [isChording, setIsChording] = useState(false);

  const startChording = useCallback(() => {
    pauseShortcuts();
    setIsChording(true);
    onStartChording?.();
  }, [onStartChording]);

  const stopChording = useCallback(() => {
    resumeShortcuts();
    setIsChording(false);
  }, []);

  useEffect(() => {
    if (enabled) {
      registerShortcut(startChording, { scope, key });
      return () => {
        unregisterShortcut(startChording);
      };
    }
  }, [enabled, scope, key, startChording]);

  useEffect(() => {
    if (!isChording) {
      return;
    }

    const chordedKeyListener = (e: ShortcutEvent) => {
      // Prevent default to ensure that the key event doesn't trigger other
      // shortcuts that are listening for the same key.
      e.preventDefault();

      callback(e);
      stopChording();
    };

    document.addEventListener('keydown', chordedKeyListener, { once: true });
    document.addEventListener('keypress', chordedKeyListener, { once: true });

    return () => {
      document.removeEventListener('keydown', chordedKeyListener);
      document.removeEventListener('keypress', chordedKeyListener);
      resumeShortcuts();
    };
  }, [callback, isChording, stopChording]);
};
