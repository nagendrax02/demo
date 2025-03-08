import { leftAction } from '../constant';
import styles from '../mip-header.module.css';
import { useMiPHeader } from '../mip-header.store';
import { IMiPHeader } from '../mip-header.types';
import { canHideBack } from '../utils';
import Action from './Action';

const LeftAction = ({ appTabsEnabled }: { appTabsEnabled: boolean }): JSX.Element => {
  const module = useMiPHeader((state) => state.module);

  const getAugmentedLeftActions = (): IMiPHeader[] => {
    return leftAction.map((action) => ({
      ...action,
      canHide: canHideBack(module, action, appTabsEnabled)
    }));
  };

  return (
    <div className={styles.action_wrapper}>
      {getAugmentedLeftActions().map((action) => (
        <Action key={action.id} action={action} />
      ))}
    </div>
  );
};

export default LeftAction;
