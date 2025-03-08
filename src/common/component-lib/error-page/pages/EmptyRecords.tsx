import { EmptyBox } from 'assets/illustrations';
import ErrorPage from '../ErrorPage';
import styles from './pages.module.css';
import { IPage } from '../error-page.types';
import { classNames, isDarkMode } from 'common/utils/helpers/helpers';
import { ReactNode } from 'react';

interface IEmptyRecords extends IPage {
  actions: ReactNode;
}

const EmptyRecords = ({ variant, actions }: IEmptyRecords): JSX.Element => {
  return (
    <ErrorPage
      customStyleClass={styles.error_container}
      variant={variant}
      icon={
        <EmptyBox
          className={classNames(styles.icon, styles.empty_results_icon)}
          isDarkMode={isDarkMode()}
        />
      }
      title="No records added yet!">
      <div className={styles.empty_results_button_wrapper}>{actions}</div>
    </ErrorPage>
  );
};

export default EmptyRecords;
