import { SharedState } from '@trello/shared-state';

interface UploadsFlagArgs {
  /**
   * Checks if current upload attachment is complete
   */
  uploadComplete: boolean;
  id: string;
  label: string;
}

export interface UploadsFlagType {
  uploads: UploadsFlagArgs[];
  allUploadsComplete: boolean;
}

export const defaultUploadsFlagState = {
  uploads: [],
  allUploadsComplete: false,
};

export const UploadAttachmentState = new SharedState<UploadsFlagType>(
  defaultUploadsFlagState,
);

export const setUploadsFlagState: (status: UploadsFlagArgs) => void = (
  status,
) => {
  UploadAttachmentState.setValue((current) => {
    const index = current.uploads.findIndex(({ id }) => id === status.id);
    // If flag is not found, add it
    if (index === -1) {
      return {
        allUploadsComplete: false,
        uploads: [...current.uploads, status],
      };
    }

    // If flag already exists, replace it
    const shallow: UploadsFlagArgs[] = [...current.uploads];
    shallow[index] = status;
    return {
      allUploadsComplete: false,
      uploads: shallow,
    };
  });

  // if all uploads are complete, reset state and dismiss flag
  const allUploadsComplete = UploadAttachmentState.value.uploads.every(
    ({ uploadComplete }) => {
      return uploadComplete === true;
    },
  );
  if (allUploadsComplete) {
    UploadAttachmentState.setValue(() => ({
      ...defaultUploadsFlagState,
      allUploadsComplete: true,
    }));
  }
};
