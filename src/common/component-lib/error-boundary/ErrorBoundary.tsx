import { trackError } from 'common/utils/experience/utils/track-error';
import React, { ErrorInfo } from 'react';
import { IErrorBoundaryProps, IErrorBoundaryStates } from './error-boundary.types';
import { sleep } from 'common/utils/helpers';
import { clearCache } from './utils';
import ErrorBoundaryFallBack from './error-boundary-fall-back';

class ErrorBoundary extends React.Component<IErrorBoundaryProps, IErrorBoundaryStates> {
  constructor(props: IErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      componentStack: '',
      isChunkLoadError: false,
      isConnectionError: false
    };
  }

  static getDerivedStateFromError(): IErrorBoundaryStates {
    return { hasError: true, componentStack: '' };
  }

  async componentDidCatch(error: Error, info: ErrorInfo): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const stringifiedError = ((error as any)?.stack as string)?.toString();
    const reloadStatus = sessionStorage.getItem('chunk_reload_status');
    if (stringifiedError?.includes('ChunkLoadError')) {
      if (!reloadStatus) {
        this.setState({
          isChunkLoadError: true
        });
        sessionStorage.setItem('chunk_reload_status', 'true');
        clearCache();
        await sleep(2000);
        window.location.reload();
      }
    } else {
      sessionStorage.removeItem('chunk_reload_status');
    }
    this.setState({
      componentStack: info?.componentStack || ''
    });
    trackError(error, { componentStack: info?.componentStack ?? undefined });
    import('common/utils/logger')
      .then((module) => {
        module.default.fatal({
          error: error,
          message: `UNHANDLED_EXCEPTION: Error Boundary : ${error?.message || error?.name || ''}`,
          method: `ErrorBoundary: ComponentDidCatch | hasReloaded: ${reloadStatus}`,
          data: {
            additionalDetails: {
              errorStack: stringifiedError,
              errorInfo: info
            }
          },
          module: this.props.module || 'ErrorBoundary'
        });
      })
      .catch((importError) => {
        trackError(importError);
      });
  }

  componentDidMount(): void {
    window.addEventListener('online', this.handleConnectionChange);
    window.addEventListener('offline', this.handleConnectionChange);
  }

  componentWillUnmount(): void {
    window.removeEventListener('online', this.handleConnectionChange);
    window.removeEventListener('offline', this.handleConnectionChange);
  }

  handleConnectionChange = (): void => {
    this.setState({ isConnectionError: !navigator.onLine, hasError: !navigator.onLine });
  };

  render(): React.ReactNode {
    if (this?.state?.hasError) {
      if (this?.props?.fallback) {
        return this?.props?.fallback;
      }
      return (
        <ErrorBoundaryFallBack
          isChunkLoadError={this.state.isChunkLoadError}
          isConnectionError={this.state.isConnectionError}
          customStyleClass={this?.props?.customStyleClass}
          componentStack={this?.state?.componentStack}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
