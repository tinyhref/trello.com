if (window?.history && 'pushState' in window.history) {
  const history = window.history;
  const pushState = history.pushState;

  history.pushState = function (state) {
    // @ts-expect-error
    // eslint-disable-next-line prefer-rest-params
    const result = pushState.apply(history, arguments);
    const pushEvent = new PopStateEvent('pushstate', { state });
    window.dispatchEvent(pushEvent);
    return result;
  };

  const replaceState = history.replaceState;
  history.replaceState = function (state) {
    // @ts-expect-error
    // eslint-disable-next-line prefer-rest-params
    const result = replaceState.apply(history, arguments);
    const replaceEvent = new PopStateEvent('replacestate', { state });
    window.dispatchEvent(replaceEvent);
    return result;
  };
}
