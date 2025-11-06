import type { FeedbackMetadata } from '@atlassian/editor-plugin-ai/dist/types/types/types';

export type HandleFeedbackSubmissionArgs = Partial<FeedbackMetadata>;

export const buildAdditionalFields = ({
  feedbackContext,
  hasUserConsent,
}: {
  feedbackContext: HandleFeedbackSubmissionArgs | undefined;
  hasUserConsent?: boolean;
}): string | undefined => {
  if (!feedbackContext) return undefined;

  const aiExperience = feedbackContext.getAIExperience?.(hasUserConsent) || {};
  let feedbackMetadataStringified = `sentiment: ${feedbackContext.sentiment}\n`;

  Object.entries({
    ...aiExperience,
    ...feedbackContext.editorAttributes,
  }).forEach((item) => {
    feedbackMetadataStringified += `${item[0]}: ${item[1]}\n`;
  });
  return feedbackMetadataStringified;
};
