// See server: https://bitbucket.org/trello/server/src/5c33f0dbc2664b580b0f68061e9b47d2cbc1453e/app/helper/positioning.ts

export const MIN_SPACING = 0.125; // 2^-2
export const SPACING = 16384; // 2^14
export const MAX_POS = 2 ** 48; // 2^48, where 0.125 still has precision
export const INITIAL_POS = MAX_POS / 2; // Start at the midpoint of the range
export const NULL_POS = -1;
