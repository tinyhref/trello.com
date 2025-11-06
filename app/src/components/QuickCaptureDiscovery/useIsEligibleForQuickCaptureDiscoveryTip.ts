import {
  SEGMENT_TRELLO_HAS_LEARNED_MORE_INBOX_INFO_PANEL_QC_AAID,
  SEGMENT_TRELLO_HAS_LEARNED_MORE_INBOX_QUICK_CAPTURE_REAL_TIME_AAID,
  SEGMENT_TRELLO_HAS_USED_INBOX_QUICK_CAPTURE_REAL_TIME_AAID,
  TRELLO_TRACK_CARD_ADDED_QUICK_CAPTURE_CHANGED_BATCH,
  TRELLO_UI_CLICKED_QUICK_CAPTURE_PROMPT_CHANGED_BATCH,
  useUserTrait,
} from '@trello/atlassian-personalization';
import { useMemberId } from '@trello/authentication';
import { getDateBefore, idToDate } from '@trello/dates';

export const useIsEligibleForQuickCaptureDiscoveryTip = () => {
  const memberId = useMemberId();

  const signedUpMoreThan21DaysAgo =
    idToDate(memberId) < getDateBefore({ days: 21 });

  const {
    value: hasViewedQuickCaptureLink,
    loading: hasViewedQuickCaptureLinkLoading,
  } = useUserTrait(
    SEGMENT_TRELLO_HAS_LEARNED_MORE_INBOX_QUICK_CAPTURE_REAL_TIME_AAID,
  );

  const {
    value: hasViewedQuickCaptureBubble,
    loading: hasViewedQuickCaptureBubbleLoading,
  } = useUserTrait(SEGMENT_TRELLO_HAS_LEARNED_MORE_INBOX_INFO_PANEL_QC_AAID);

  const { value: hasUsedQuickCapture, loading: hasUsedQuickCaptureLoading } =
    useUserTrait(SEGMENT_TRELLO_HAS_USED_INBOX_QUICK_CAPTURE_REAL_TIME_AAID);

  const {
    value: hasUsedQuickCaptureHistorical,
    loading: hasUsedQuickCaptureHistoricalLoading,
  } = useUserTrait(TRELLO_TRACK_CARD_ADDED_QUICK_CAPTURE_CHANGED_BATCH);

  const {
    value: hasViewedQuickCaptureHistorical,
    loading: hasViewedQuickCaptureHistoricalLoading,
  } = useUserTrait(TRELLO_UI_CLICKED_QUICK_CAPTURE_PROMPT_CHANGED_BATCH);

  const isCriteriaSatisfied =
    signedUpMoreThan21DaysAgo &&
    !hasViewedQuickCaptureLinkLoading &&
    !hasUsedQuickCaptureLoading &&
    !hasUsedQuickCaptureHistoricalLoading &&
    !hasViewedQuickCaptureHistoricalLoading &&
    !hasViewedQuickCaptureBubbleLoading &&
    !(
      hasViewedQuickCaptureLink ||
      hasUsedQuickCapture ||
      hasUsedQuickCaptureHistorical ||
      hasViewedQuickCaptureHistorical ||
      hasViewedQuickCaptureBubble
    );

  return isCriteriaSatisfied;
};
