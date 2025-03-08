import { useState } from 'react';
import { PanelState } from '../external-app.types';
import styles from '../external-app.module.css';
import ToggleButton from './ToggleButton';
import { IExternalNavItem } from 'common/utils/helpers/helpers.types';
import TabItem from './TabItem';

interface ILeftPanel {
  title: string;
  menuItems: IExternalNavItem[];
  selectedItem: IExternalNavItem;
  onSelect: (selectedItem: IExternalNavItem) => void;
}

const LeftPanel = (props: ILeftPanel): JSX.Element => {
  const { title, menuItems, selectedItem, onSelect } = props;
  const [toggleState, setToggleState] = useState(PanelState.Open);

  const getMenuItems = (): JSX.Element => {
    return (
      <>
        {menuItems?.map((item) => {
          return (
            <TabItem
              key={item.Id}
              menuItem={item}
              isActive={selectedItem.Id === item.Id}
              onClick={onSelect}
            />
          );
        })}
      </>
    );
  };

  const handleClick = (): void => {
    if (toggleState === PanelState.Open) {
      setToggleState(PanelState.Close);
    } else {
      setToggleState(PanelState.Open);
    }
  };

  return (
    <div className={styles.left_panel_wrapper}>
      <div
        className={`${styles.left_panel_container} ${
          toggleState === PanelState.Close ? styles.hide : styles.show
        } left_panel_container`}>
        <div className={styles.left_panel_content_wrapper}>
          <div className={styles.left_panel_header}>
            <span className="title">{title}</span>
          </div>
          <div className={styles.tabs_list}>{getMenuItems()}</div>
        </div>
      </div>
      <ToggleButton toggleState={toggleState} onClick={handleClick} />
    </div>
  );
};

export default LeftPanel;
