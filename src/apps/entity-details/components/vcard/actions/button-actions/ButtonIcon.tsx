import { IButtonAction } from 'apps/entity-details/types/entity-data.types';
import { ICON_MAPPER } from '../constant';
import styles from '../actions.module.css';
import { CustomAction } from 'assets/custom-icon';

interface IButtonIcon {
  action: IButtonAction;
}

const ButtonIcon = ({ action }: IButtonIcon): JSX.Element => {
  let icon = ICON_MAPPER[action.id];
  icon = icon ?? <CustomAction className={styles.action_icon} />;
  return <>{action?.isLoading ? null : icon}</>;
};

export default ButtonIcon;
