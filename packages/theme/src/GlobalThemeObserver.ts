import type { GlobalThemeState } from './globalThemeState';
import { globalThemeState } from './globalThemeState';

/**
 * A thin wrapper that can be used to subscribe to changes in the global theme.
 */
export class GlobalThemeObserver {
  public unsubscribe: () => void;

  constructor(callback: (state: GlobalThemeState) => void) {
    this.unsubscribe = globalThemeState.subscribe(callback, {
      onlyUpdateIfChanged: true,
    });
  }
}
