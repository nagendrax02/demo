import { getProfileName } from 'common/utils/helpers/helpers';
import styles from '../header.module.css';
import { getUserDetails } from '../utils';

const ProfileOption = (): JSX.Element => {
  const userInfo = getUserDetails();
  return (
    <a className={styles.profile_option} href={'/Settings/MyProfile'}>
      <div className={styles.profile_container}>
        <div
          className={`${styles.profile_icon} ${styles.profile_icon_inner}`}
          data-testid="profile-img">
          <span>{getProfileName(userInfo.name)}</span>
        </div>
        <div className={styles.profile_details}>
          <div className={styles.profile_name}>{userInfo.name}</div>
          <div>{userInfo.email}</div>
          <div className={styles.secondary_details}>{userInfo.tenant}</div>
        </div>
      </div>
    </a>
  );
};

export default ProfileOption;
