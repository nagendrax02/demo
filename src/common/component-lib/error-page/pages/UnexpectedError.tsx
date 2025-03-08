import { Ufo404 } from 'assets/illustrations';
import ErrorPage from '../ErrorPage';
import styles from './pages.module.css';
import { IPage } from '../error-page.types';
import { classNames, isDarkMode } from 'common/utils/helpers/helpers';
import { Button } from '@lsq/nextgen-preact/v2/button';
import { Sync } from 'assets/custom-icon/v2';

interface IUnexpectedError extends IPage {
  handleRefresh: () => Promise<void> | void;
}

const UnexpectedError = ({ variant, handleRefresh }: IUnexpectedError): JSX.Element => {
  return (
    <ErrorPage
      variant={variant}
      icon={
        <Ufo404
          className={classNames(styles.icon, styles.unexpected_error_icon)}
          isDarkMode={isDarkMode()}
        />
      }
      title="Sorry, that was unexpected.">
      <>
        <div className={styles.unexpected_error_description}>
          {
            "We're unable to display the content right now. We're working to resolve this and will be back shortly."
          }
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

export default UnexpectedError;
