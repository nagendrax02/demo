import Separator from '@lsq/nextgen-preact/v2/separator';
import styles from './profile.module.css';

const ProfileSeparator = (): JSX.Element => {
  return (
    <div className={styles.profile_separator}>
      <Separator orientation="horizontal" length="248px" />
    </div>
  );
};

export default ProfileSeparator;
