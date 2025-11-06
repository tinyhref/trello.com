// Essentially a client-side compatible wrapper for schema.Deployment
export class Client {
  head: string;
  patch: number = 0;
  version: number;
  constructor(versionStr: string) {
    const versionParts = versionStr.split('-');
    this.head = versionParts.slice(0, -1).join('-');
    this.version = parseFloat(versionParts.slice(-1)[0]);
  }

  toString() {
    return `${this.head}-${this.fullVersion()}`;
  }
  toJSON() {
    return this.toString();
  }

  fullVersion() {
    // If @version is 0, the compact will eat it
    return [this.version, this.patch].filter((a) => a).join('.') || 0;
  }
}
