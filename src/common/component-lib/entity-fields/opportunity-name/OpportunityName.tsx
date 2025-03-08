import { HYPHEN, NO_NAME } from 'common/constants';
import styles from './opportunity-name.module.css';
import { getOpportunityDetailsPath } from 'router/utils/entity-details-url-format';

export interface IOpportunity {
  oppId: string;
  eventCode: string;
  name?: string;
}

const OpportunityName = (props: IOpportunity): JSX.Element | null => {
  const { oppId, eventCode, name } = props;

  if (!oppId || !eventCode) {
    return null;
  }

  const getName = (): string => {
    if (name === HYPHEN) {
      return NO_NAME;
    }
    return name || 'Click to View';
  };

  return (
    <div className={styles.wrapper}>
      <a
        className={styles.link}
        tabIndex={0}
        aria-label={name}
        href={getOpportunityDetailsPath(oppId, eventCode)}
        target="_self">
        {getName()}
      </a>
    </div>
  );
};

OpportunityName.defaultProps = {
  name: '',
  showIcon: false
};

export default OpportunityName;
