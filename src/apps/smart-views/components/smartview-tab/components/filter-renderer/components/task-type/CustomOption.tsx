import { TaskTypeCategory } from 'common/types/entity/task/metadata.types';
import styles from './task-type.module.css';
import { ITaskTypeFilterOption } from '../../filter-renderer.types';

interface ICustomOption {
  option: ITaskTypeFilterOption;
}

const CustomOption = (props: ICustomOption): JSX.Element | null => {
  const { option } = props;

  const getCustomComponent = (): JSX.Element | null => {
    if ([TaskTypeCategory.Appointment, TaskTypeCategory.Todo].includes(Number(option.value))) {
      return <div>{option.label}</div>;
    }
    return (
      <div className={styles.task_option_container}>
        {option?.text ? (
          <span className={styles.task_color} style={{ backgroundColor: option?.text }}></span>
        ) : null}
        <span className={styles.label}>{option.label}</span>
      </div>
    );
  };

  return getCustomComponent();
};

export default CustomOption;
