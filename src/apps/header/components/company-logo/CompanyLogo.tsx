import styles from '../styles.module.css';
import { DEFAULT_LOGO_URL } from '../../constants';

const CompanyLogo = (): JSX.Element => {
  return (
    <div className={styles.logo_wrapper}>
      <img src={DEFAULT_LOGO_URL} alt="logo" className={styles.logo} />
    </div>
  );
};

export default CompanyLogo;
