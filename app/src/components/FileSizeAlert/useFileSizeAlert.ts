import { useCallback } from 'react';

import { useIsBoardPremiumFeatureEnabled } from '@trello/business-logic-react/board';
import { PremiumFeatures } from '@trello/entitlements';
import { showFlag } from '@trello/nachos/experimental-flags';

import { l } from 'app/scripts/lib/localize';

const largeFileSizeLimitInBytes = 250 * 1024 * 1024;
const smallFileSizeLimitInBytes = 10 * 1024 * 1024;

export const useFileSizeAlert = ({ boardId }: { boardId: string | null }) => {
  const isLargeAttachmentsEnabled = useIsBoardPremiumFeatureEnabled(
    PremiumFeatures.largeAttachments,
  );

  return {
    warnIfFileTooLarge: useCallback(
      ({ fileSizeInBytes }: { fileSizeInBytes: number }) => {
        let hasLargeAttachmentsSupport = false;
        // if (!isLoading) {
        hasLargeAttachmentsSupport = isLargeAttachmentsEnabled;
        // }
        const sizeLimitInBytes = hasLargeAttachmentsSupport
          ? largeFileSizeLimitInBytes
          : smallFileSizeLimitInBytes;

        return new Promise<boolean>((resolve, reject) => {
          // if (!isLoading) {
          const isTooLarge = fileSizeInBytes > sizeLimitInBytes;
          if (isTooLarge) {
            const title = hasLargeAttachmentsSupport
              ? l('alerts.file size exceeds 250mb')
              : l('alerts.file size exceeds 10mb');
            showFlag({
              id: 'upload',
              title,
              appearance: 'error',
              isAutoDismiss: true,
            });
          }
          resolve(isTooLarge);
          // } else if (isLoading) {
          //   reject(new Error('Board premium features did not load'));
          // }
        });
      },
      [isLargeAttachmentsEnabled],
    ),
  };
};
