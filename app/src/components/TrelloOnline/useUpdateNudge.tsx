import type { MouseEvent } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import RefreshIcon from '@atlaskit/icon/core/refresh';
import { Analytics } from '@trello/atlassian-analytics';
import { useDynamicConfig } from '@trello/dynamic-config';
import { getScreenFromUrl } from '@trello/marketing-screens';
import { dismissFlag, showFlag } from '@trello/nachos/experimental-flags';

const DURATION_IN_MS = {
  ONE_SECOND: 1000,
  ONE_MINUTE: 60000,
  ONE_HOUR: 3600000,
  ONE_DAY: 86400000,
  ONE_WEEK: 604800000,
};

export const getDelay = (duration: number, elapsed: number) => {
  const { ONE_HOUR, ONE_SECOND } = DURATION_IN_MS;
  const remaining = duration - elapsed;
  const interval = Math.round(remaining / 2);
  return Math.min(Math.max(interval, ONE_SECOND), ONE_HOUR);
};

export const useUpdateNudge = () => {
  const timerRef = useRef<number | null>(null);
  const [initTimestamp, setInitTimestamp] = useState<number | null>(null);

  const timeInterval = useDynamicConfig<number>(
    'trello_web_update_nudge_time_interval',
  );

  const onClick = useCallback((e: MouseEvent) => {
    e.preventDefault();

    Analytics.sendClickedLinkEvent({
      linkName: 'refreshLink',
      source: getScreenFromUrl(),
    });

    window.location.reload();
  }, []);

  const nudgeUser = useCallback(() => {
    showFlag({
      id: 'updateNudgeFlag',
      icon: <RefreshIcon label="" />,
      title: (
        <FormattedMessage
          id="templates.update_nudge.weve-updated-trello-behind-the-scenes"
          defaultMessage="We've updated Trello behind the scenes"
          description="Update nudge title"
        />
      ),
      description: (
        <FormattedMessage
          id="templates.update_nudge.time-for-a-quick-refresh"
          defaultMessage="Time for a quick refresh to enjoy the latest improvements. Don't worry, your content and settings won't change."
          description="Update nudge description"
        />
      ),
      isUndismissable: true,
      actions: [
        {
          content: (
            <FormattedMessage
              id="templates.update_nudge.refresh"
              defaultMessage="Refresh"
              description="Refresh lnk action"
            />
          ),
          type: 'link',
          href: window.location.href,
          onClick,
        },
      ],
    });

    Analytics.sendViewedComponentEvent({
      componentType: 'flag',
      componentName: 'updateNudgeFlag',
      source: getScreenFromUrl(),
    });
  }, [onClick]);

  const maybeNudge = useCallback(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }

    if (!initTimestamp) {
      return;
    }

    const timeSinceInit = Date.now() - initTimestamp;
    const delay = getDelay(timeInterval, timeSinceInit);

    if (timeSinceInit > timeInterval) {
      nudgeUser();
      return;
    }

    timerRef.current = window.setTimeout(maybeNudge, delay);
  }, [initTimestamp, timeInterval, nudgeUser]);

  useEffect(() => {
    setInitTimestamp(Date.now());
  }, []);

  useEffect(() => {
    maybeNudge();

    return () => {
      dismissFlag({ id: 'updateNudgeFlag' });
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, [maybeNudge]);
};
