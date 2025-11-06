type Options = {
  autoStart?: boolean;
};
type ProcessingState = 'notStarted' | 'started' | 'stopped';

/**
 * This class is a queue for processing async functions in order, and on demand.
 */
class PromiseQueue<TReturn = void> {
  /** Indicates the current state of processing for the queue */
  private currentState: ProcessingState = 'notStarted';

  /** Whether we have a promise currently pending */
  private isPromisePending = false;

  private readonly queue: {
    promise: () => Promise<TReturn>;
    resolve: (value: TReturn) => void;
    reject: (reason: unknown) => void;
  }[] = [];
  private options: Options;

  constructor(options: Options) {
    this.options = options;
    if (this.options.autoStart) {
      this.start();
    }
  }

  /**
   * Add a promise to the queue and dequeue the next, if we've already started processing.
   * @returns a Promise that will resolve when the provided Promise resolves.
   */
  public enqueue(promise: () => Promise<TReturn>): Promise<TReturn> {
    return new Promise((resolve, reject) => {
      this.queue.push({
        promise,
        resolve,
        reject,
      });

      if (this.currentState === 'started') {
        this.dequeue();
      }
    });
  }

  /**
   * Process the next item in the queue.
   * @returns true if an item was processed, false if there are no items to process or there is already
   * a promise pending.
   */
  public dequeue(): boolean {
    if (this.isPromisePending) {
      return false;
    }

    // Pull the next item off the queue
    const item = this.queue.shift();
    if (!item) {
      return false;
    }

    this.isPromisePending = true;
    item
      .promise()
      .then((value) => {
        this.isPromisePending = false;
        item.resolve(value);

        if (this.currentState === 'started') {
          this.dequeue();
        }
      })
      .catch((err) => {
        this.isPromisePending = false;
        item.reject(err);

        if (this.currentState === 'started') {
          this.dequeue();
        }
      });
    return true;
  }

  /**
   * Start processing the queue.
   */
  public start(): void {
    if (this.currentState === 'started') {
      return;
    }
    this.currentState = 'started';
    this.dequeue();
  }

  /**
   * Stop processing the queue.
   */
  public stop(): void {
    this.currentState = 'stopped';
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let clientInitQueue: PromiseQueue<any> | undefined;

/**
 * Get the client init queue, or create one if it doesn't exist.
 * This will return the same instance of the queue each time it is called.
 * @param options Options for the queue (default: { autoStart: true })
 */
export const getClientInitQueue = <TReturn = void>(
  options: Options & { createNewInstance?: boolean } = { autoStart: true },
): PromiseQueue<TReturn> => {
  if (!clientInitQueue || options.createNewInstance) {
    clientInitQueue = new PromiseQueue<TReturn>(options);
  }
  return clientInitQueue;
};
