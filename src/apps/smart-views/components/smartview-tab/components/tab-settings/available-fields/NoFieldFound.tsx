import { classNames } from 'common/utils/helpers/helpers';
import styles from './available-fields.module.css';
const NoFieldFound = (): JSX.Element => {
  return (
    <div className={classNames(styles.no_field, 'ng_p_1_m', 'ng_v2_style')}>
      <div>No results found.</div>
      <div>Try a different keyword</div>
    </div>
  );
};

export default NoFieldFound;
