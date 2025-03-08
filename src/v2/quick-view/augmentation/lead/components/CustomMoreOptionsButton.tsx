import { classNames } from 'common/utils/helpers/helpers';
import styles from '../lead-actions.module.css';
const CustomMoreOptionsButton = (): JSX.Element => {
  return <div className={classNames(styles.custom_more_options, 'ng_btn_1_r')}>More Options</div>;
};
export default CustomMoreOptionsButton;
