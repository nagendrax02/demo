import { getOpportunityDetailsPath } from 'src/router/utils/entity-details-url-format';
import { ITaskItem } from '../../tasks.types';
import styles from './task-body.module.css';
import Opportunity from 'assets/custom-icon/Opportunity';

interface IEntityAssociation {
  taskItem: ITaskItem;
}

const EntityAssociation = (props: IEntityAssociation): JSX.Element => {
  const { taskItem } = props;

  return (
    <a
      className={styles.opp_title}
      href={getOpportunityDetailsPath(
        taskItem?.RelatedSubEntityId,
        taskItem?.ActivityEvent || taskItem?.OpportunityEvent || ''
      )}
      target="_self">
      <Opportunity className="opportunity-icon" />
      {taskItem?.OpportunityTitle ? taskItem?.OpportunityTitle : ''}
    </a>
  );
};

export default EntityAssociation;
