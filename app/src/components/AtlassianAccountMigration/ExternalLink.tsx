import type { FunctionComponent, PropsWithChildren } from 'react';
import { useCallback } from 'react';

import type { ActionSubjectIdType, SourceType } from '@trello/analytics-types';
import { Analytics } from '@trello/atlassian-analytics';

interface ExternalLinkProps {
  href: string;
  analyticsSource: SourceType;
  analyticsContext: Parameters<typeof Analytics.sendUIEvent>[0]['attributes'];
  linkName: ActionSubjectIdType;
}

export const ExternalLink: FunctionComponent<
  PropsWithChildren<ExternalLinkProps>
> = ({ href, analyticsSource, analyticsContext, linkName, children }) => {
  const onClick = useCallback(() => {
    Analytics.sendClickedLinkEvent({
      linkName,
      source: analyticsSource,
      attributes: analyticsContext,
    });
  }, [analyticsContext, analyticsSource, linkName]);

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" onClick={onClick}>
      {children}
    </a>
  );
};
