import { DogPullingPlug } from 'assets/illustrations';
import ErrorPage from '../ErrorPage';
import styles from './pages.module.css';
import { IPage } from '../error-page.types';
import { classNames, isDarkMode } from 'common/utils/helpers/helpers';
import { Button } from '@lsq/nextgen-preact/v2/button';
import { Sync } from 'assets/custom-icon/v2';

interface IConnectionError extends IPage {
  handleRefresh: () => Promise<void> | void;
}

const ConnectionError = ({ variant, handleRefresh }: IConnectionError): JSX.Element => {
  return (
    <ErrorPage
      customStyleClass={styles.error_full_page}
      variant={variant}
      icon={
        <DogPullingPlug
          className={classNames(styles.icon, styles.connection_error_icon)}
          isDarkMode={isDarkMode()}
        />
      }
      title="Connection Error">
      <>
        <div className={styles.connection_error_description}>
          {'Try refreshing the page or checking your internet connection.'}
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

export default ConnectionError;
