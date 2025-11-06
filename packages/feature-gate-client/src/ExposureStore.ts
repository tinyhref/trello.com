const FIVE_MINUTES_MS = 300_000;
// Exporting for testing
export const DEFAULT_EXPOSURE_MAX_AGE_MS = FIVE_MINUTES_MS;
/**
 * Store for tracking feature exposure events
 */
export class ExposureStore {
  private static instance: ExposureStore | null = null;

  private exposures: { [key: string]: { value: unknown; time: number } } = {};

  public static getInstance(): ExposureStore {
    if (!ExposureStore.instance) {
      ExposureStore.instance = new ExposureStore();
    }
    return ExposureStore.instance;
  }

  public static resetInstance(): void {
    ExposureStore.instance = null;
  }

  getExposure<T>(key: string): { value: T; time: number } | undefined {
    const record = this.exposures[key];
    if (!record) return undefined;
    return {
      value: record.value as T,
      time: record.time,
    };
  }

  setExposure<T>(key: string, value: T): void {
    this.exposures[key] = {
      value,
      time: Date.now(),
    };
  }

  hasRecentExposure<T extends string>(
    key: string,
    value: T,
    maxAgeMs: number = DEFAULT_EXPOSURE_MAX_AGE_MS,
  ): boolean {
    const record = this.getExposure<T>(key);
    if (!record) return false;
    const isSameValue = record.value === value;
    const isRecent = Date.now() - record.time < maxAgeMs;

    return isSameValue && isRecent;
  }
}
