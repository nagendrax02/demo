import { Ref } from 'react';
import styles from './tab.module.css';
import Name from '../name';
import TabRecordCounter from '../../tab-record-counter/TabRecordCounter';
interface ITab {
  name: string;
  tabKey: string;
  activeTabKey: string;
  setActiveTabKey: (tabKey: string) => void;
  customStyleClass?: string;
  tabRef?: Ref<HTMLAnchorElement> | null;
}

const Tab = (props: ITab): JSX.Element => {
  const { name, tabKey, activeTabKey, setActiveTabKey, customStyleClass, tabRef } = props;
  return (
    <a
      ref={tabRef}
      data-testid={tabKey}
      id={tabKey}
      className={`${styles.tab} ${tabKey == activeTabKey ? styles.active : ''} ${customStyleClass}`}
      onClick={(): void => {
        if (tabKey !== activeTabKey) {
          setActiveTabKey(tabKey);
        }
      }}>
      <Name text={name} />
      <TabRecordCounter tabId={tabKey} />
    </a>
  );
};

Tab.defaultProps = {
  customStyleClass: '',
  tabRef: null
};

export default Tab;
