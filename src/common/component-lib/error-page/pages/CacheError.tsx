import { BrowserWindowError } from 'assets/illustrations';
import ErrorPage from '../ErrorPage';
import styles from './pages.module.css';
import { IPage } from '../error-page.types';
import { classNames, isDarkMode } from 'common/utils/helpers/helpers';
import { Button } from '@lsq/nextgen-preact/v2/button';
import { Sync } from 'assets/custom-icon/v2';
import { getMailBodyMessage, getMailSubjectMessage } from '../utils';

interface ICacheError extends IPage {
  handleRefresh: () => Promise<void> | void;
  componentStack?: string;
}

const CacheError = ({ variant, handleRefresh, componentStack }: ICacheError): JSX.Element => {
  return (
    <ErrorPage
      variant={variant}
      icon={
        <BrowserWindowError
          className={classNames(styles.icon, styles.cache_error_icon)}
          isDarkMode={isDarkMode()}
        />
      }
      title="Refresh for the Latest Version">
      <>
        <div className={styles.cache_error_description_wrapper}>
          <div>{'Try refreshing the page or clearing your browser cache.'}</div>
          <div>
            {'If the problem persists, please contact us at '}
            <a
              href={`mailto:support@leadsquared.com?subject=${getMailSubjectMessage()}&body=${getMailBodyMessage(
                componentStack
              )}`}
              className={styles.link}>
              support@leadsquared.com
            </a>
            {'.'}
          </div>
        </div>
        <Button
          variant="primary"
          size="md"
          text={'Refresh'}
          onClick={handleRefresh}
          icon={<Sync type="outline" className={styles.refresh_button_icon} />}
        />
      </>
    </ErrorPage>
  );
};

CacheError.defaultProps = {
  componentStack: undefined
};

export default CacheError;
