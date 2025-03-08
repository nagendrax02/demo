import { classNames } from 'common/utils/helpers/helpers';
import styles from './user-deatils.module.css';

const UserName = (): JSX.Element => {
  return (
    <div className={classNames(styles.user_name, 'ng_v2_style')}>
      <button className="ng_h_5_b">TY</button>
      <span className="ng_h_5_sb">Taylor Ysveltavina Bosnovia</span>
    </div>
  );
};

export default UserName;
