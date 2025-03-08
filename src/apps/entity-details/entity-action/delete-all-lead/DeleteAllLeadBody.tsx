import Input from '@lsq/nextgen-preact/input';
import styles from './delete-all-lead.module.css';
import { CONSTANTS } from './constants';
import { updateEntityName } from './utils';
import { IEntityRepresentationName } from '../../types/entity-data.types';
import {
  getTabData,
  useActiveTab
} from 'apps/smart-views/components/smartview-tab/smartview-tab.store';

const Body = ({
  value,
  setValue,
  repName
}: {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  repName?: IEntityRepresentationName;
}): JSX.Element => {
  const activeTabId = useActiveTab();
  const tabData = getTabData(activeTabId);

  return (
    <div className={styles.body_container}>
      <div>
        <div className={`${styles.bold_text} ${styles.body_content}`}>
          {updateEntityName(CONSTANTS.HEADING, repName).replace(
            '{recordCount}',
            tabData?.recordCount.toString()
          )}
        </div>
        <div className={styles.body_content}>{CONSTANTS.YOU_WILL_PERMANENTLY_LOSE}</div>
        <div className={styles.body_content}>{updateEntityName(CONSTANTS.POINT_ONE, repName)}</div>
        <div className={styles.body_content}>{updateEntityName(CONSTANTS.POINT_TWO, repName)}</div>
      </div>
      <div className={styles.input_container}>
        <div className={styles.bold_text}>
          {updateEntityName(CONSTANTS.TYPE_BELOW, repName)}
          <span className={styles.asterisk}>*</span>
        </div>
        <Input
          value={value}
          setValue={setValue}
          placeholder="Enter Text Here"
          customStyleClass={styles.text_input}
        />
      </div>
    </div>
  );
};

Body.defaultProps = {
  repName: '',
  tabData: {}
};

export default Body;
