export const isCloseEvent = (
  errOrCloseEvent: CloseEvent | Event,
): errOrCloseEvent is CloseEvent =>
  errOrCloseEvent && 'code' in errOrCloseEvent;
