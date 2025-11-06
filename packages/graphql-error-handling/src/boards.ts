export const BoardErrorExtensions = {
  FREE_BOARD_LIMIT_REACHED: 'FREE_BOARD_LIMIT_REACHED',
} as const;
type BoardErrorExtensionsType =
  (typeof BoardErrorExtensions)[keyof typeof BoardErrorExtensions];

export const BoardErrors: Record<string, BoardErrorExtensionsType> = {
  'Free boards limit exceeded': BoardErrorExtensions.FREE_BOARD_LIMIT_REACHED,
};
