import styles from './user-deatils.module.css';
import UserName from './UserName';
import UserOtherDetails from './UserOtherDetails';
import ProfileSeparator from '../ProfileSeparator';
import { classNames } from 'common/utils/helpers/helpers';

const UserDetails = (): JSX.Element => {
  return (
    <>
      <div className={classNames(styles.user_details, 'ng_v2_style')}>
        <UserName />
        <UserOtherDetails />
      </div>
      <ProfileSeparator />
    </>
  );
};

export default UserDetails;
