import { getCompanyLogo } from '../utils';
import styles from '../header.module.css';
import LeadsquaredLogo from 'assets/core/LeadsquaredLogo';

const CompanyLogo = (): JSX.Element => {
  const logoUrl = getCompanyLogo();
  return (
    <a href="/">
      {logoUrl ? (
        <img src={logoUrl} alt="Custom Logo" className={styles.custom_logo} />
      ) : (
        <LeadsquaredLogo />
      )}
    </a>
  );
};

export default CompanyLogo;
