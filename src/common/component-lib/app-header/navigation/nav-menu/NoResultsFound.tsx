import { classNames } from 'common/utils/helpers/helpers';
import styles from './nav-menu.module.css';

const NoResultsFound = (): JSX.Element => {
  return (
    <div className={styles.no_results_found}>
      <span className={classNames('ng_sh_m', 'ng_v2_style')}>No Search results found.</span>
      <span className={classNames('ng_sh_m', 'ng_v2_style')}>Try a different keyword</span>
    </div>
  );
};

export default NoResultsFound;
