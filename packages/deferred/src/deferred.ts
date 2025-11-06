const deferred = <T>() => {
  let resolve!: (value: T) => void;
  let reject!: (reason?: string) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return {
    resolve,
    reject,
    promise,
  };
};

export class Deferred<TValue> {
  value: TValue | null;
  deferral: ReturnType<typeof deferred>;
  msUntilFallback?: number;
  timeout?: NodeJS.Timeout;

  constructor({
    msUntilFallback,
    value,
  }: { msUntilFallback?: number; value?: TValue } = {}) {
    this.value = null;
    this.deferral = deferred();
    this.msUntilFallback = msUntilFallback;

    if (this.msUntilFallback && value) {
      this.timeout = setTimeout(() => {
        this.setValue(value);
      }, this.msUntilFallback);
    }
  }

  public setValue(value: TValue) {
    this.value = value;
    this.deferral.resolve(value);

    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  public async getValueAsync(): Promise<TValue> {
    return (await this.deferral.promise) as Promise<TValue>;
  }
}
