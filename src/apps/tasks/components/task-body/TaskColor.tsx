import { EntityType } from '../../constants';
import styles from './task-body.module.css';

interface ITaskColor {
  color: string;
  entityType: string;
}

const TaskColor = (props: ITaskColor): JSX.Element => {
  const { color, entityType } = props;

  return color ? (
    <div
      className={
        entityType === EntityType.OPPORTUNITY
          ? styles.task_color_map_with_opp
          : styles.task_color_map
      }
      style={{ background: color }}
    />
  ) : (
    <></>
  );
};

export default TaskColor;
