import type { FunctionComponent } from 'react';
import { useEffect } from 'react';

import { Analytics } from '@trello/atlassian-analytics';
import { useBoardShortLink, useCardShortLink } from '@trello/router';

import { RequestAccessLoggedOutPageContent } from './RequestAccessLoggedOutPageContent';

import * as styles from './RequestAccessLoggedOutPage.module.less';

// eslint-disable-next-line @trello/assets-alongside-implementation
import backgroundLeftSvg from 'resources/images/request-access/background-left.svg';
// eslint-disable-next-line @trello/assets-alongside-implementation
import bottomCurvePng from 'resources/images/request-access/bottom-curve.png';

export const RequestAccessLoggedOutPage: FunctionComponent<{
  title: string;
  subtitle: string;
}> = ({ title, subtitle }) => {
  const boardShortLink = useBoardShortLink();
  const cardShortLink = useCardShortLink();
  const modelId = boardShortLink || cardShortLink || '';

  useEffect(() => {
    Analytics.sendScreenEvent({
      name: 'requestAccessLoggedOutErrorScreen',
      attributes: {
        shortlink: modelId,
      },
    });
  }, [modelId]);
  return (
    <>
      <RequestAccessLoggedOutPageContent subtitle={subtitle} title={title} />
      <div className={styles.background}>
        <img alt="" className={styles.people} src={backgroundLeftSvg} />
        <img alt="" className={styles.curve} src={bottomCurvePng} />
      </div>
    </>
  );
};
