import { EntityType as EntityDetailsType } from 'common/types';
import { IEntityDetailsCoreData } from '../../../entity-details/types/entity-data.types';
import { EntityType } from '../../constants';
import { ITaskItem } from '../../tasks.types';
import EntityAssociation from './EntityAssociation';
import OverdueText from './OverdueText';
import TaskColor from './TaskColor';
import TaskTitle from './TaskTitle';
import styles from './task-body.module.css';

interface IBodyHeader {
  taskItem: ITaskItem;
  coreData: IEntityDetailsCoreData;
}

const BodyHeader = (props: IBodyHeader): JSX.Element => {
  const { taskItem, coreData } = props;

  const { entityDetailsType } = coreData;

  const showAssociatedEntity = (): boolean => {
    return (
      entityDetailsType !== EntityDetailsType.Opportunity &&
      taskItem?.EntityType === EntityType.OPPORTUNITY
    );
  };

  return (
    <>
      <div className={styles.tasks_body_header}>
        <TaskColor color={taskItem?.Color} entityType={taskItem?.EntityType} />
        <div className={styles.tasks_title}>
          <div className={styles.tasks_title_main}>
            <TaskTitle name={taskItem?.Name} status={taskItem?.Status} />
            {!taskItem?.Status ? <OverdueText taskItem={taskItem} /> : <></>}
          </div>
          {showAssociatedEntity() ? <EntityAssociation taskItem={taskItem} /> : <></>}
        </div>
      </div>
    </>
  );
};

export default BodyHeader;
