export class NoopError extends Error {
  constructor() {
    super('noop');
    this.name = 'NoopError';
  }
}
