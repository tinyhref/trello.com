import { type FunctionComponent } from 'react';

import { Analytics } from '@trello/atlassian-analytics';
import { useCardId } from '@trello/id-context';
import { ExternalLinkIconNewTab } from '@trello/nachos/icons/ExternalLinkIconNewTab';
import { Tooltip } from '@trello/nachos/tooltip';

import { CardFrontExternalLinkFavicon } from './CardFrontExternalLinkFavicon';
import { useCardFrontExternalLinkFragment } from './CardFrontExternalLinkFragment.generated';

import * as styles from './CardFrontExternalLink.module.less';

export const CardFrontExternalLink: FunctionComponent = () => {
  const cardId = useCardId();

  const { data } = useCardFrontExternalLinkFragment({
    from: { id: cardId },
    optimistic: true,
  });

  const externalSource = data?.badges?.externalSource;
  const externalLink = data?.urlSource;

  // Only show external links for browser extension cards
  if (!externalLink || externalSource !== 'BROWSER_EXTENSION') {
    return null;
  }

  const hasMatchingAttachment = data?.attachments?.some(
    (attachment) => String(attachment?.url) === String(externalLink),
  );

  if (!hasMatchingAttachment) {
    return null;
  }

  const name = data?.urlSourceText ?? externalLink;
  const faviconUrl = data?.faviconUrl;

  const handleClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    event.stopPropagation();
    Analytics.sendClickedLinkEvent({
      linkName: 'cardFrontExternalLink',
      source: 'cardView',
      attributes: {
        externalSource,
      },
    });
  };

  return (
    <div className={styles.externalLink}>
      <Tooltip content={name}>
        <a
          href={externalLink}
          className={styles.externalLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
        >
          <CardFrontExternalLinkFavicon faviconUrl={faviconUrl ?? undefined} />
          <span className={styles.linkText}>{name}</span>
          <ExternalLinkIconNewTab color="var(--ds-icon-subtle)" />
        </a>
      </Tooltip>
    </div>
  );
};
