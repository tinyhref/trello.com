import type { ErrorInfo, FunctionComponent, PropsWithChildren } from 'react';
import { Component } from 'react';

import type { SentryErrorMetadata } from '@trello/error-reporting';
import { sendCrashEvent, sendErrorEvent } from '@trello/error-reporting';
import { forTemplate } from '@trello/legacy-i18n';
import { token } from '@trello/theme';

import { ErrorDetails } from './ErrorDetails';

const format = forTemplate('error');

export interface CaughtError {
  error: Error;
  info: ErrorInfo;
}

export interface ErrorHandlerProps {
  caughtError: CaughtError;
}

export const DefaultErrorHandler: FunctionComponent<ErrorHandlerProps> = ({
  caughtError,
}) => (
  <div style={{ padding: token('space.250', '20px') }}>
    <h3>
      <span
        style={{
          color: token('color.text.danger', '#AE2E24'),
          marginRight: token('space.100', '8px'),
        }}
      >
        {format('global-unhandled')}
      </span>
    </h3>
    <ErrorDetails caughtError={caughtError} />
  </div>
);

interface ErrorBoundaryProps {
  tags?: SentryErrorMetadata['tags'];
  errorHandlerComponent?: FunctionComponent<
    PropsWithChildren<ErrorHandlerProps>
  >;
  sendCrashEvent?: boolean;
  extraData?: SentryErrorMetadata['extraData'];
  canIgnoreError?: (error: Error) => boolean;
  onError?: (error: Error, info: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  caughtError: CaughtError | null;
}

export class ErrorBoundary extends Component<
  PropsWithChildren<ErrorBoundaryProps>,
  ErrorBoundaryState
> {
  state = {
    caughtError: null,
  } as ErrorBoundaryState;

  componentDidCatch(error: Error, info: ErrorInfo) {
    try {
      if (this.props.canIgnoreError) {
        if (this.props.canIgnoreError(error)) {
          return;
        }
      }
    } catch (err) {
      // If someone accidentally adds an error in the canIgnoreError function, we
      // don't want the ErrorBoundary component to fail.
      sendErrorEvent(err, {
        tags: this.props.tags,
        extraData: {
          ...(this.props.extraData || {}),
          component: 'ErrorBoundary',
        },
      });
    }

    this.props.onError?.(error, info);

    if (this.props.sendCrashEvent) {
      sendCrashEvent(error, {
        tags: this.props.tags,
        extraData: this.props.extraData,
      });
    } else {
      sendErrorEvent(error, {
        tags: this.props.tags,
        extraData: this.props.extraData,
      });
    }

    this.setState({ caughtError: { error, info } });
  }

  render() {
    const { caughtError } = this.state;

    if (caughtError) {
      const ErrorHandlerComponent =
        this.props.errorHandlerComponent || DefaultErrorHandler;

      return <ErrorHandlerComponent caughtError={caughtError} />;
    }

    return this.props.children;
  }
}
