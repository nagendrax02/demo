interface IErrorBoundaryProps {
  children: JSX.Element;
  module: string;
  customStyleClass?: string;
  fallback?: React.ReactNode;
  key: string;
}
interface IErrorBoundaryStates {
  hasError: boolean;
  componentStack: string;
  isChunkLoadError?: boolean;
  isConnectionError?: boolean;
}

interface IError {
  componentStack: string;
  customStyleClass?: string;
  isChunkLoadError?: boolean;
  isConnectionError?: boolean;
}

export type { IErrorBoundaryProps, IErrorBoundaryStates, IError };
