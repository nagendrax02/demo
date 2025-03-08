import { LockedFile } from 'assets/illustrations';
import ErrorPage from '../ErrorPage';
import styles from './pages.module.css';
import { IPage } from '../error-page.types';
import { classNames, isDarkMode } from 'common/utils/helpers/helpers';

const AccessDenied = ({ variant }: IPage): JSX.Element => {
  return (
    <ErrorPage
      variant={variant}
      icon={
        <LockedFile
          className={classNames(styles.icon, styles.access_denied_icon)}
          isDarkMode={isDarkMode()}
        />
      }
      title="Sorry, you don't have access to this module!">
      <div className={styles.access_denied_description}>
        {'Please contact your administrator for more information.'}
      </div>
    </ErrorPage>
  );
};

export default AccessDenied;
