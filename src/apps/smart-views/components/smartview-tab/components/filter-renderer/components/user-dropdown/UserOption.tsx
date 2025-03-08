import { classNames } from 'src/common/utils/helpers/helpers';
import { IUserFilterOption } from '../../filter-renderer.types';
import styles from './user-dropdown.module.css';

const UserOption = (props: IUserFilterOption): JSX.Element => {
  const { label, text } = props;

  return (
    <div className={styles.user_option_container}>
      <div className={classNames(styles.user_label, 'ng_p_1_sb')}>{label}</div>
      <div className={styles.user_text}>{text}</div>
    </div>
  );
};

export default UserOption;
