import type { MaliciousCardCoverAttachmentFragment } from './MaliciousCardCoverAttachmentFragment.generated';

export const hasMaliciousCoverAttachment = (
  card: MaliciousCardCoverAttachmentFragment | undefined,
) => {
  const coverAttachmentId = card?.idAttachmentCover;
  const attachments = card?.attachments;

  if (!coverAttachmentId || !attachments?.length) {
    return false;
  }

  return attachments.some(
    (attachment) =>
      attachment.id === coverAttachmentId && attachment?.isMalicious,
  );
};
