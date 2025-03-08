import LeadsquaredLogo from 'assets/core/LeadsquaredLogo';
import { classNames } from 'common/utils/helpers';
import styles from './splash-screen.module.css';

const SplashScreen = (): JSX.Element => {
  return (
    <div className={classNames(styles.container, 'ng_v2_style', 'ng_h_1_b')}>
      <LeadsquaredLogo />
      Setting up. Please wait
    </div>
  );
};

export default SplashScreen;
