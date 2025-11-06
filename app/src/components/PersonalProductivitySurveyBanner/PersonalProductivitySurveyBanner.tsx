import { useCallback, useEffect, type FunctionComponent } from 'react';

import { Analytics } from '@trello/atlassian-analytics';
import { useOneTimeMessagesDismissed } from '@trello/business-logic-react/member';
import { getScreenFromUrl } from '@trello/marketing-screens';
import { HeaderBanner } from '@trello/nachos/header-banner';
import { RouterLink } from '@trello/router/router-link';

const BANNER_ONE_TIME_MESSAGE_KEY = 'personal-productivity-survey-banner';

const SURVEY_LINK =
  'https://survey.quadstrat.com/survey/selfserve/e52/250949?list=202&tsu=1';

/**
 * This is a temporary banner to collect feedback on the personal productivity
 * See https://trello.atlassian.net/browse/TJC-7845 for more details.
 * */
export const PersonalProductivitySurveyBanner: FunctionComponent = () => {
  const { dismissOneTimeMessage } = useOneTimeMessagesDismissed();

  const dismissBanner = useCallback(() => {
    dismissOneTimeMessage(BANNER_ONE_TIME_MESSAGE_KEY);
  }, [dismissOneTimeMessage]);

  useEffect(() => {
    Analytics.sendViewedBannerEvent({
      bannerName: 'surveyBanner',
      source: getScreenFromUrl(),
      attributes: {
        surveyType: 'personalProductivity',
      },
    });
  }, []);

  const onDismissClick = useCallback(() => {
    Analytics.sendClickedButtonEvent({
      buttonName: 'surveyBannerDismissButton',
      source: getScreenFromUrl(),
      attributes: {
        surveyType: 'personalProductivity',
      },
    });
    dismissBanner();
  }, [dismissBanner]);

  const onTakeSurveyClick = useCallback(() => {
    Analytics.sendClickedLinkEvent({
      linkName: 'surveyBannerTakeSurveyLink',
      source: getScreenFromUrl(),
      attributes: {
        surveyType: 'personalProductivity',
      },
    });
    dismissBanner();
  }, [dismissBanner]);

  return (
    <HeaderBanner onDismiss={onDismissClick}>
      <div>We would love your input on using Trello.&nbsp;</div>
      <RouterLink
        href={SURVEY_LINK}
        onClick={onTakeSurveyClick}
        target="_blank"
      >
        Take the survey
      </RouterLink>
    </HeaderBanner>
  );
};
