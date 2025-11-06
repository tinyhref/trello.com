import type { PIIString } from './privacy';

function convertToPIIString(str: string): PIIString;
function convertToPIIString(str: string | null): PIIString | null;
function convertToPIIString(str?: string): PIIString | undefined;
function convertToPIIString(str?: string | null): PIIString | null | undefined;

function convertToPIIString(str?: string | null) {
  if (str === undefined || str === null) {
    return str;
  }
  return str as unknown as PIIString;
}

export { convertToPIIString };
