import { getProfileName } from 'common/utils/helpers/helpers';
import styles from '../styles.module.css';
import { IMenuItem } from 'common/component-lib/action-wrapper/action-wrapper.types';
import { ReactNode } from 'react';
import { IAuthenticationConfig } from 'common/types';
import { getPersistedAuthConfig } from 'common/utils/authentication';

const ProfileOption = (): ReactNode => {
  const { User, Tenant } = (getPersistedAuthConfig() as IAuthenticationConfig) || {};
  const { FullName, EmailAddress } = User;
  const { DisplayName } = Tenant;

  return (
    <a className={styles.profile_option} href={'/Settings/MyProfile'}>
      <div className={styles.profile_option_container}>
        <div
          className={`${styles.profile_option_icon} ${styles.profile_option_icon_inner}`}
          data-testid="profile-img">
          <span>{getProfileName(FullName ?? '')}</span>
        </div>
        <div className={styles.profile_details}>
          <div className={styles.profile_name}>{FullName}</div>
          <div>{EmailAddress}</div>
          <div className={styles.secondary_details}>{DisplayName}</div>
        </div>
      </div>
    </a>
  );
};

const profileOption: IMenuItem = {
  label: '',
  value: 'profile',
  customComponent: <ProfileOption />
};

export default ProfileOption;
export { profileOption };
