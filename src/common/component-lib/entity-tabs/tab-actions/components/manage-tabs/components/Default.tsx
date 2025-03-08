import useManageTabs from '../manage-tab.store';
import styles from '../manage-tabs.module.css';

interface IDefault {
  id: string;
}

const Default = ({ id }: IDefault): JSX.Element => {
  const defaultTabId = useManageTabs((state) => state.defaultTabId);
  const setDefaultTabId = useManageTabs((state) => state.setDefaultTabId);

  return (
    <div
      onClick={() => {
        setDefaultTabId(id);
      }}
      className={`${styles.default} ${
        defaultTabId === id ? styles.is_default : ''
      } sortable-list-item-action`}
      data-testid={`${id}-default`}>
      Default
    </div>
  );
};

export default Default;
