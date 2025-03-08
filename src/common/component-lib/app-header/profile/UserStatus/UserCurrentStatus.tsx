import { StatusIcon } from 'assets/custom-icon/v2';
import styles from './user-status.module.css';
import { classNames } from 'src/common/utils/helpers/helpers';

const UserCurrentStatus = (): JSX.Element => {
  return (
    <div className={classNames(styles.user_current_status, 'ng_v2_style')}>
      <StatusIcon type="outline" className={styles.status_icon} style={{ fill: '#42BB24' }} />
      <span className={classNames('ng_v2_style', 'ng_p_1_sb')}>Online</span>
    </div>
  );
};

export default UserCurrentStatus;
