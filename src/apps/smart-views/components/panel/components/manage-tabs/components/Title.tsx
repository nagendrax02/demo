import { ITabResponse } from 'apps/smart-views/smartviews.types';
import styles from '../manage-tabs.module.css';
import useManageSVTabsStore, { setDefaultTabId } from '../manage-tabs.store';

interface ITitle {
  tabData: ITabResponse;
}

const Title = (props: ITitle): JSX.Element => {
  const { tabData } = props;
  const defaultTabId = useManageSVTabsStore((state) => state.defaultTabId);

  const handleClick = (): void => {
    setDefaultTabId(tabData?.Id);
  };

  return (
    <div className={styles.title}>
      <div>{tabData?.TabConfiguration?.Title}</div>
      <div
        className={`${styles.default} ${
          tabData?.Id === defaultTabId ? styles.is_default : ''
        } sortable-list-item-action`}
        onClick={handleClick}>
        Default
      </div>
    </div>
  );
};

export default Title;
