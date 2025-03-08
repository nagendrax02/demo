import { EmptyDrawer } from 'assets/illustrations';
import ErrorPage from '../ErrorPage';
import styles from './pages.module.css';
import { IPage } from '../error-page.types';
import { classNames, isDarkMode } from 'common/utils/helpers/helpers';
import { Button } from '@lsq/nextgen-preact/v2/button';
import { Close } from 'assets/custom-icon/v2';

interface INoMatchingRecords extends IPage {
  handleClearFilters: () => Promise<void> | void;
}

const NoMatchingRecords = ({ variant, handleClearFilters }: INoMatchingRecords): JSX.Element => {
  return (
    <ErrorPage
      variant={variant}
      icon={
        <EmptyDrawer
          className={classNames(styles.icon, styles.no_matching_results_icon)}
          isDarkMode={isDarkMode()}
        />
      }
      title="No records matching the filters">
      <>
        <div className={styles.no_matching_results_description}>{'Modify filters'}</div>
        <Button
          variant="secondary-error"
          size="sm"
          text={'Clear Filters'}
          onClick={handleClearFilters}
          icon={
            <div className={styles.clear_filter_button_icon}>
              <Close type="outline" />
            </div>
          }
        />
      </>
    </ErrorPage>
  );
};

export default NoMatchingRecords;
