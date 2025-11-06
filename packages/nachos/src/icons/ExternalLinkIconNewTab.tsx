import type { FunctionComponent } from 'react';
import { useIntl } from 'react-intl';

import type { GlyphProps } from '@trello/nachos/icon';
import { ExternalLinkIcon } from '@trello/nachos/icons/external-link';

export const ExternalLinkIconNewTab: FunctionComponent<GlyphProps> = (
  props,
) => {
  const { label, ...rest } = props;
  const intl = useIntl();
  const newLabel =
    label ??
    intl.formatMessage({
      id: 'templates.nachos.external-link-label',
      defaultMessage: '(Opens new tab)',
      description: 'External link icon label for screen readers',
    });

  return <ExternalLinkIcon label={newLabel} {...rest} />;
};
