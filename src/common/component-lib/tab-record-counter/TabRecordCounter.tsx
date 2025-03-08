import useTabRecordCounterStore from './tab-record-counter.store';
import styles from './tab-record-counter.module.css';
import { TabRecordTypeMap } from './constants';

export interface ITabRecordCounter {
  tabId: string;
  isMenuOption?: boolean;
}

const TabRecordCounter = ({ tabId, isMenuOption }: ITabRecordCounter): JSX.Element => {
  const { tabRecordCountMap } = useTabRecordCounterStore();
  const recordType = TabRecordTypeMap?.[tabId];
  const recordCount = tabRecordCountMap?.[recordType];

  if (recordCount) {
    return (
      <div
        className={
          isMenuOption ? styles.record_counter_option_container : styles.record_counter_container
        }>
        <div className={styles.record_counter_wrapper}>
          <div className={styles.record_counter_label}>
            {recordCount > 99 ? '99+' : recordCount}
          </div>
        </div>
      </div>
    );
  }

  return <></>;
};

TabRecordCounter.defaultProps = {
  isMenuOption: false
};

export default TabRecordCounter;
