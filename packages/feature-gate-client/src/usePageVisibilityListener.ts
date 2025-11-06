import { useEffect, useState } from 'react';

export const usePageVisibilityListener = () => {
  const [isPageVisible, setIsPageVisible] = useState(
    document.visibilityState === 'visible',
  );

  useEffect(() => {
    const abortController = new AbortController();
    document.addEventListener(
      'visibilitychange',
      () => {
        setIsPageVisible(document.visibilityState === 'visible');
      },
      {
        signal: abortController.signal,
      },
    );

    return () => {
      abortController.abort();
    };
  }, []);

  return { isPageVisible };
};
