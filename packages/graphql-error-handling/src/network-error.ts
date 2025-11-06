import type { ErrorExtensionsType } from './errors';

export interface NetworkErrorExtension {
  code: ErrorExtensionsType;
  status: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}
export class NetworkError extends Error {
  message: string;
  code: ErrorExtensionsType;
  status: number;

  constructor(
    message: string,
    { code, status, ...meta }: NetworkErrorExtension,
  ) {
    super(message);
    this.message = message;
    this.code = code;
    this.status = status;
    Object.assign(this, meta);
  }
}
