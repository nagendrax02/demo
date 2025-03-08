import { ReactNode } from 'react';
import styles from './leadsquared-logo.module.css';
import LeadsquaredLogoIcon from './LeadsquaredLogoIcon';
import LeadsquaredLogoText from './LeadsquaredLogoText';

export interface ILeadsquaredLogo {
  className?: string;
}

const LeadsquaredLogo = ({ className }: ILeadsquaredLogo): ReactNode => {
  return (
    <div className={`${styles.logo} ${className}`}>
      <LeadsquaredLogoIcon className={styles.icon} />
      <LeadsquaredLogoText className={styles.text} />
    </div>
  );
};

LeadsquaredLogo.defaultProps = {
  className: ''
};

export default LeadsquaredLogo;
