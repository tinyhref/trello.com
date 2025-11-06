const _waitComplete: { [key: string]: boolean } = {};
const _waitCallbacks: { [key: string]: (() => void)[] } = {};

export function triggerWaits(type: string) {
  _waitComplete[type] = true;

  for (const callback of Array.from(
    // eslint-disable-next-line eqeqeq
    _waitCallbacks[type] != null ? _waitCallbacks[type] : [],
  )) {
    callback();
  }
  return delete _waitCallbacks[type];
}

export function waitFor(type: string, callback: () => void) {
  if (_waitComplete[type]) {
    return callback();
  } else {
    if (!_waitCallbacks[type]) {
      _waitCallbacks[type] = [];
    }
    return _waitCallbacks[type].push(callback);
  }
}
