/* istanbul ignore file */
import OpportunityIcon from '../shared/opportunity-icon';
import styles from './components/styles.module.css';

const Icon = (): JSX.Element => {
  return (
    <div className={styles.opp_icon}>
      <OpportunityIcon />
    </div>
  );
};

export default Icon;
