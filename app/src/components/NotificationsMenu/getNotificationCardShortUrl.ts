import { makeSlug } from '@trello/urls';

export const getNotificationCardShortUrl = (data: {
  card?: {
    shortLink?: string | null;
    idShort?: number | null;
    name?: string | null;
  } | null;
}) => {
  const card = data.card;
  if (card) {
    return `/c/${card.shortLink}/${card.idShort}-${makeSlug(card.name || '')}`;
  } else {
    return '#';
  }
};
