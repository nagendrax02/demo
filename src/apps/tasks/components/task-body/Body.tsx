import { IEntityDetailsCoreData } from '../../../entity-details/types/entity-data.types';
import { ITaskItem } from '../../tasks.types';
import TaskMetaInfo from '../task-meta-info';
import BodyHeader from './BodyHeader';
import Description from './Description';
import styles from './task-body.module.css';

interface ITaskBody {
  data: ITaskItem;
  coreData: IEntityDetailsCoreData;
}

const Body = (props: ITaskBody): JSX.Element => {
  const { data, coreData } = props;

  return (
    <div className={styles.tasks_body}>
      <BodyHeader taskItem={data} coreData={coreData} />
      <Description description={data?.Description} />
      <TaskMetaInfo taskItem={data} />
    </div>
  );
};

export default Body;
