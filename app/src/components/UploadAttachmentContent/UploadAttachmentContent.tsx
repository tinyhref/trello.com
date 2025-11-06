import type { FunctionComponent } from 'react';

import { useSharedState } from '@trello/shared-state';

import { UploadAttachmentState } from 'app/src/components/UploadAttachmentState';

export const UploadAttachmentContent: FunctionComponent = () => {
  const [flags] = useSharedState(UploadAttachmentState);
  return (
    <div>
      {flags.uploads.map(({ label, id }) => {
        return (
          <div className="attachment-label" key={id}>
            {label}
          </div>
        );
      })}
    </div>
  );
};
