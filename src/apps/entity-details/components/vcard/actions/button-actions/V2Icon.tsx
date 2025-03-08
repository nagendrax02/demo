import { Form } from 'assets/custom-icon/v2';
import { ReactNode } from 'react';
import styles from '../actions.module.css';
import { IButtonAction } from 'apps/entity-details/types/entity-data.types';
import { getV2Icon } from '../constant';

interface IButtonIconV2 {
  action: IButtonAction;
}

const ButtonIconV2 = ({ action }: IButtonIconV2): ReactNode => {
  if (action.isLoading) return null;
  const icon = getV2Icon(action?.id);
  return icon ?? <Form className={styles.action_icon_v2} type="outline" />;
};

export default ButtonIconV2;
