export const hasCover = (
  cover:
    | {
        color?: string | null;
        idAttachment?: string | null;
        idPlugin?: string | null;
        idUploadedBackground?: string | null;
      }
    | null
    | undefined,
) =>
  Boolean(
    cover &&
      (cover.color ||
        cover.idAttachment ||
        cover.idUploadedBackground ||
        cover.idPlugin),
  );
