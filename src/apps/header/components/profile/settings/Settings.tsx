import { useLocation } from 'wouter';
import styles from '../../styles.module.css';

const Settings = (): JSX.Element => {
  const [, setLocation] = useLocation();

  const handleSettingsClick = (e): void => {
    e.stopPropagation();
    setLocation('/settings');
  };

  return (
    <div className={styles.fixed_action_container} onClick={handleSettingsClick}>
      Settings
    </div>
  );
};

export default Settings;
