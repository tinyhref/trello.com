import type { UGCString } from './privacy';

function convertToUGCString(str: string): UGCString;
function convertToUGCString(str: string | null): UGCString | null;
function convertToUGCString(str?: string): UGCString | undefined;
function convertToUGCString(str?: string | null): UGCString | null | undefined;

function convertToUGCString(str?: string | null) {
  if (str === undefined || str === null) {
    return str;
  }
  return str as unknown as UGCString;
}

export { convertToUGCString };
