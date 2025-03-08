import { HYPHEN, NO_NAME } from 'common/constants';
import styles from './opportunity-name.module.css';
import commonStyles from '../common-style.module.css';
import { getOpportunityDetailsPath } from 'router/utils/entity-details-url-format';
import { classNames } from 'common/utils/helpers/helpers';

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

  const getName = (): JSX.Element => {
    if (name === HYPHEN) {
      return <span title={NO_NAME}>{NO_NAME}</span>;
    }

    const value = name || 'Click to View';
    return <span title={value}>{value}</span>;
  };

  return (
    <div className={styles.wrapper}>
      <a
        className={classNames(commonStyles.ellipsis, commonStyles.hyper_link)}
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
  name: ''
};

export default OpportunityName;
