import { useEffect } from 'react';

import { importWithRetry } from '@trello/use-lazy-component';
import type { reportWebVitals as reportWebVitalsFn } from '@trello/web-vitals';

export const useWebVitalsReporter = () => {
  useEffect(() => {
    const importAndRun = async () => {
      const { reportWebVitals } = await importWithRetry<{
        reportWebVitals: typeof reportWebVitalsFn;
      }>(
        () => import(/*webpackChunkName: "web-vitals" */ '@trello/web-vitals'),
      );

      reportWebVitals({
        meta: {
          isBoardCanvasModernizationEnabled: true,
        },
      });
    };

    try {
      importAndRun();
    } catch (err) {
      // noop
    }
  }, []);
};
