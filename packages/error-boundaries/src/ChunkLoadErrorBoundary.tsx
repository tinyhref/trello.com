import type { ErrorInfo, PropsWithChildren, ReactNode } from 'react';
import { Component } from 'react';

import {
  sendChunkLoadErrorEvent,
  sendCrashEvent,
  sendErrorEvent,
} from '@trello/error-reporting';

interface ChunkLoadErrorBoundaryProps {
  fallback: ReactNode;
  retryAfter?: number;
  onError?: (error: Error) => void;
}

interface ChunkLoadErrorBoundaryState {
  hasChunkLoadError: boolean;
  numberOfRetries: number;
}

export class ChunkLoadErrorBoundary extends Component<
  PropsWithChildren<ChunkLoadErrorBoundaryProps>,
  ChunkLoadErrorBoundaryState
> {
  state = {
    hasChunkLoadError: false,
    numberOfRetries: 0,
  };

  timeoutID?: number;

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    if (error.name === 'ChunkLoadError') {
      return { hasChunkLoadError: true };
    } else {
      throw error;
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (this.props.onError) {
      this.props.onError(error);
    }

    if (this.state.numberOfRetries === 3) {
      sendCrashEvent(error, {
        extraData: { ...errorInfo },
      });
    } else if (this.state.hasChunkLoadError) {
      sendChunkLoadErrorEvent(error);
    } else {
      sendErrorEvent(error, {
        extraData: { ...errorInfo },
      });
    }
  }

  componentDidUpdate() {
    if (
      this.state.hasChunkLoadError === true &&
      this.props.retryAfter &&
      !this.timeoutID &&
      this.state.numberOfRetries < 3
    ) {
      this.timeoutID = window.setTimeout(() => {
        const updatedNumberOfRetries = this.state.numberOfRetries + 1;
        this.setState({
          hasChunkLoadError: false,
          numberOfRetries: updatedNumberOfRetries,
        });
        this.timeoutID = undefined;
      }, this.props.retryAfter);
    }
  }

  render() {
    if (this.state.hasChunkLoadError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}
