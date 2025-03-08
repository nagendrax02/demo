import styles from './user-status.module.css';
import UserCurrentStatus from './UserCurrentStatus';
import { ArrowDown } from 'src/assets/custom-icon/v2';
import UserStatusOptions from './UserStatusOptions';
import ProfileSeparator from '../ProfileSeparator';

const UserStatus = (): JSX.Element => {
  return (
    <>
      <div className={styles.user_status_container}>
        <UserStatusOptions>
          <div className={styles.user_status_inner_container}>
            <UserCurrentStatus />
            <ArrowDown type="outline" className={styles.status_arrow} />
          </div>
        </UserStatusOptions>
      </div>
      <ProfileSeparator />
    </>
  );
};

export default UserStatus;
