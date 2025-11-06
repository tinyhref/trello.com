import { useEffect, useRef } from 'react';

import { Analytics } from '@trello/atlassian-analytics';
import { dynamicConfigClient } from '@trello/dynamic-config';
import { client } from '@trello/graphql';
import { getScreenFromUrl } from '@trello/marketing-screens';
import { getRouteIdFromPathname } from '@trello/router/routes';

export const useApolloReadWriteReporter = () => {
  const timerRef = useRef<number>();

  useEffect(() => {
    // not using hooked api because we don't want to rerun the effect when values change
    if (!dynamicConfigClient.get('trello_web_apollo_read_write_metrics')) {
      return;
    }

    // sanity check for browsers that might not support, mainly opera
    if (
      !performance?.mark ||
      !performance.measure ||
      !performance.getEntriesByName
    ) {
      return;
    }

    const initialRoute = getRouteIdFromPathname(window?.location?.pathname);

    const read = client.cache.read;
    // @ts-expect-error
    client.cache.read = (...args) => {
      performance.mark('apollo:read:start');
      const result = read.call(client.cache, ...args);
      performance.mark('apollo:read:end');
      performance.measure(
        'apollo:read',
        'apollo:read:start',
        'apollo:read:end',
      );
      return result;
    };

    const write = client.cache.write;
    client.cache.write = (...args) => {
      performance.mark('apollo:write:start');
      // @ts-expect-error -- Argument of type 'WriteOptions<TData, TVariables>' is not assignable to parameter of type 'WriteOptions<unknown, unknown>'.
      const result = write.call(client.cache, ...args);
      performance.mark('apollo:write:end');
      performance.measure(
        'apollo:write',
        'apollo:write:start',
        'apollo:write:end',
      );
      return result;
    };

    timerRef.current = window.setTimeout(() => {
      const finalRoute = getRouteIdFromPathname(window?.location?.pathname);

      const readEntries = performance.getEntriesByName('apollo:read');
      const readCount = readEntries?.length;
      const readDuration = readEntries?.reduce(
        (duration, entry) => duration + entry.duration,
        0,
      );

      const writeEntries = performance.getEntriesByName('apollo:write');
      const writeCount = writeEntries?.length;
      const writeDuration = writeEntries?.reduce(
        (duration, entry) => duration + entry.duration,
        0,
      );

      Analytics.sendOperationalEvent({
        action: 'evaluated',
        actionSubject: 'apolloReads',
        attributes: {
          count: readCount,
          duration: readDuration,
          routeChanged: finalRoute !== initialRoute,
        },
        source: getScreenFromUrl(),
      });
      Analytics.sendOperationalEvent({
        action: 'evaluated',
        actionSubject: 'apolloWrites',
        attributes: {
          count: writeCount,
          duration: writeDuration,
          routeChanged: finalRoute !== initialRoute,
        },
        source: getScreenFromUrl(),
      });

      // restore the original functions
      client.cache.read = read;
      client.cache.write = write;

      performance.clearMarks('apollo:read:start');
      performance.clearMarks('apollo:read:end');
      performance.clearMarks('apollo:write:start');
      performance.clearMarks('apollo:write:end');
      performance.clearMeasures('apollo:read');
      performance.clearMeasures('apollo:write');

      // using 7500ms as an arbitrary number that will give us a baseline for number of
      // reads/writes that occur during page load. Obviously, there will be major differences
      // for users, but establishing some baseline number allows us to compare change set performance.
    }, 7500);

    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }

      // restore the original functions
      client.cache.read = read;
      client.cache.write = write;
    };
  }, []);
};
