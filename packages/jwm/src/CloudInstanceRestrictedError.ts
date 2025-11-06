export class CloudInstanceRestrictedError extends Error {
  constructor() {
    const message = `Cloud instance restricted.`;
    super(message);
    this.name = 'CloudInstanceRestrictedError';
  }
}
