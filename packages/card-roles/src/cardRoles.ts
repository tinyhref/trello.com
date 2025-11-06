/* eslint-disable @typescript-eslint/no-use-before-define */

// eslint-disable-next-line no-restricted-imports
import Url from 'url-parse';

export type CardRole = 'board' | 'link' | 'mirror' | 'separator' | null;

export const determinePossibleCardRole = (
  card: Card,
  urlOrigin = window.location.origin,
): CardRole => {
  if (canBeSeparatorCard(card)) {
    return 'separator';
  } else if (canBeBoardCard(card, urlOrigin)) {
    return 'board';
  } else if (canBeMirrorCard(card, urlOrigin)) {
    return 'mirror';
  } else if (canBeLinkCard(card, urlOrigin)) {
    return 'link';
  } else {
    return null;
  }
};

interface Card {
  name: string;
  description?: string | null | undefined;
  numAttachments?: number;
  numLabels?: number;
  numMembers?: number;
  numChecklistItems?: number;
  numCustomFieldItems?: number;
  startDate?: Date | string | null | undefined;
  dateLastActivity?: Date | string | null | undefined;
  dueDate?: Date | string | null | undefined;
  cover?:
    | {
        color?: string | null;
        idAttachment?: string | null;
        idUploadedBackground?: string | null;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [k: string]: any; // We don't care about the other fields
      }
    | null
    | undefined;
}

export const doesCardOnlyHaveName = ({
  description,
  numAttachments,
  numLabels,
  numMembers,
  numChecklistItems,
  numCustomFieldItems,
  startDate,
  dueDate,
  cover,
}: Omit<Card, 'name'>) =>
  !description?.trim().length &&
  !numAttachments &&
  !numLabels &&
  !numMembers &&
  !numChecklistItems &&
  !numCustomFieldItems &&
  !dueDate &&
  !startDate &&
  (!cover ||
    (!cover.color && !cover.idAttachment && !cover.idUploadedBackground));

const isUrlMatch = (url: string, pathname: RegExp, urlOrigin: string) => {
  const parsedUrlOrigin = new Url(urlOrigin, {});
  const parsedUrl = new Url(url, {});

  return (
    parsedUrl.host === parsedUrlOrigin.host &&
    parsedUrl.pathname.match(pathname) &&
    !parsedUrl.pathname.trim().match(/\s+/)
  );
};

const canBeSeparatorCard = ({ name, ...otherFields }: Card) => {
  return (
    name.trim().match(/^(_|-)\1\1+$/gim) && doesCardOnlyHaveName(otherFields)
  );
};

const canBeBoardCard = ({ name, ...otherFields }: Card, urlOrigin: string) =>
  isUrlMatch(
    name,
    new RegExp(`\
^\
/b/\
(\
[a-zA-Z0-9]{8}|\
[a-fA-F0-9]{24}\
)\
(?:$|/.*)\
`),
    urlOrigin,
  ) && doesCardOnlyHaveName(otherFields);

const canBeLinkCard = ({ name, ...otherFields }: Card, urlOrigin: string) => {
  return /^https?:\/\/\S+$/.test(name) && doesCardOnlyHaveName(otherFields);
};

const canBeMirrorCard = ({ name, ...otherFields }: Card, urlOrigin: string) => {
  return (
    isUrlMatch(
      name,
      new RegExp(/^\/c\/([a-zA-Z0-9]{8}|[a-fA-F0-9]{24})(?:$|\/.*)/i),
      urlOrigin,
    ) && doesCardOnlyHaveName(otherFields)
  );
};
