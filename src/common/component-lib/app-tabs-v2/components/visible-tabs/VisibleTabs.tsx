import { ITabConfig } from '../../app-tabs.types';
import Tab from '../tab';
import styles from './visible-tabs.module.css';

interface IVisibleTabs {
  config: ITabConfig[];
}

const VisibleTabs = ({ config }: IVisibleTabs): JSX.Element | null => {
  const getTabElements = (): JSX.Element[] => {
    return config?.map((item) => {
      return <Tab key={item?.id} config={item} />;
    });
  };

  if (!config?.length) {
    return null;
  }

  return (
    <div className={styles.visible_tab_wrapper} data-testid="visible-tabs-wrapper">
      {getTabElements()}
    </div>
  );
};

export default VisibleTabs;
