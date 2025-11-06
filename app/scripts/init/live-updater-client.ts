import type {
  Callback,
  GenericLiveUpdate,
  Publish,
} from 'app/scripts/init/live-updater';
import { subscribe } from 'app/scripts/init/live-updater';

export class LiveUpdaterClient {
  callbacks: Callback[] = [];
  broadcast: Publish;

  constructor() {
    this.broadcast = subscribe((update: GenericLiveUpdate) => {
      this.callbacks.forEach((fx) => fx(update));
    });
  }

  subscribe(callback: Callback) {
    this.callbacks.push(callback);
  }

  unsubscribe(callback: Callback) {
    this.callbacks = this.callbacks.filter((cb) => cb !== callback);
  }
}
