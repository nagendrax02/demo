import { handleReload } from '../utils';
import { IError } from '../error-boundary.types';
import styles from './fall-back.module.css';
import { ConnectionError, TeamNotified, CacheError } from '../../error-page';
import { classNames } from 'common/utils/helpers/helpers';

const ErrorBoundaryFallBack = (props: IError): JSX.Element => {
  const { componentStack, customStyleClass, isChunkLoadError, isConnectionError } = props;

  const reloadStatus = sessionStorage.getItem('chunk_reload_status');

  const getErrorPage = (): JSX.Element => {
    if (isConnectionError) {
      return <ConnectionError variant="error" handleRefresh={handleReload} />;
    } else if (reloadStatus || isChunkLoadError) {
      return (
        <CacheError variant="error" componentStack={componentStack} handleRefresh={handleReload} />
      );
    }
    return <TeamNotified variant="error" componentStack={componentStack} />;
  };

  return (
    <div
      data-testid="error-boundary-fallback"
      className={classNames(styles.connection_error_wrapper, customStyleClass)}>
      {getErrorPage()}
    </div>
  );
};

export default ErrorBoundaryFallBack;
