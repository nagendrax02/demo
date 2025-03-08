import Icon from '@lsq/nextgen-preact/icon';
import styles from './toggle.module.css';
import { PanelState } from 'apps/smart-views/constants/constants';

interface IToggleButton {
  toggleState: PanelState;
  onClick: () => void;
}

const ToggleButton = (props: IToggleButton): JSX.Element => {
  const { onClick, toggleState } = props;

  return (
    <div
      className={`${styles.toggle_container} ${
        toggleState === PanelState.Close ? styles.toggle_container_close : ''
      }`}
      onClick={onClick}>
      <Icon name="chevron_right" />
    </div>
  );
};

export default ToggleButton;
