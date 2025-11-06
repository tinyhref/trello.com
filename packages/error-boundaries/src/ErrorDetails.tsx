import type { FunctionComponent } from 'react';

import { forTemplate } from '@trello/legacy-i18n';
import { token } from '@trello/theme';

import type { CaughtError } from './ErrorBoundary';

const format = forTemplate('error');

const getErrorString = (caughtError: CaughtError) => {
  const { error, info } = caughtError;

  return `Error: ${error.message || String(error)}.\nError info: ${
    info.componentStack
  }.`;
};

export const ErrorDetails: FunctionComponent<{ caughtError: CaughtError }> = ({
  caughtError,
}) => {
  return (
    <div
      style={{
        textAlign: 'left',
        color: token('color.text.subtle', '#44546F'),
      }}
    >
      <strong>{format('more-details')}</strong>
      <pre
        style={{
          fontSize: '12px',
          whiteSpace: 'pre-wrap',
          borderLeft: `2px solid ${token('color.border.danger', '#E2483D')}`,
          color: token('color.text.subtle', '#44546F'),
          backgroundColor: token('elevation.surface.raised', '#FFFFFF'),
          paddingLeft: token('space.250', '20px'),
        }}
      >
        {getErrorString(caughtError)}
      </pre>
    </div>
  );
};
