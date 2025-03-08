import { IActivityAttribute } from 'common/utils/entity-data-manager/activity/activity.types';
import styles from './opportunity-status.module.css';
import { safeParseJson } from 'common/utils/helpers';

export interface IOpportunityStatus {
  statusDataString: string;
}

const OpportunityStatus = ({ statusDataString }: IOpportunityStatus): JSX.Element => {
  const parsedData = safeParseJson(statusDataString) as Record<string, IActivityAttribute>;

  return (
    <div className={styles.wrapper}>
      <div className={styles.field}>
        <div className={styles.name}>Status:</div>
        <div className={styles.value}>{parsedData?.OpportunityStatus?.fieldValue}</div>
      </div>
      <div className={styles.field}>
        <div className={styles.name}>Stage:</div>
        <div className={styles.value}>{parsedData?.OpportunityReason?.fieldValue}</div>
      </div>
    </div>
  );
};

export default OpportunityStatus;
