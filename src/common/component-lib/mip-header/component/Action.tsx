import Icon from '@lsq/nextgen-preact/icon';
import { ActionId, IMiPHeader } from '../mip-header.types';
import styles from '../mip-header.module.css';
import { handleActionClick, useMiPHeader } from '../mip-header.store';
import { goBack } from '../utils';

const Action = ({ action }: { action: IMiPHeader }): JSX.Element | null => {
  const module = useMiPHeader((state) => state.module);
  const handleClick = (id: string): void => {
    if (!module || action?.doNotAct) return;
    if (id === ActionId.Back) {
      goBack(module);
      return;
    }
    handleActionClick(id);
  };
  return action.canHide ? null : (
    <div
      className={styles.action}
      data-testid={`${action?.dataTestId}-${module || ''}`}
      onClick={() => {
        handleClick(action?.id);
      }}>
      <div>{<Icon name={action.icon} customStyleClass={styles.icon} />}</div>
      <div>{action.title}</div>
    </div>
  );
};

export default Action;
