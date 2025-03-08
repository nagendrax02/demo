import { ReactNode } from 'react';
import { getTaskColorGroup } from 'common/utils/color-group-mapper/colorGroupMapper';
import ToDo from 'assets/custom-icon/v2/Todo';
import Appointment from 'assets/custom-icon/v2/Appointment';
import styles from './task.module.css';
import { ITaskAdditionalData } from './task.types';
import { TaskTypeCategory } from 'common/types/entity/task/metadata.types';

const TaskSubjectIcon = ({ entityRecord }: { entityRecord: ITaskAdditionalData }): ReactNode => {
  const colorGroup = getTaskColorGroup(entityRecord?.Color ?? '');
  return (
    <div style={colorGroup} className={styles.task_subject_icon}>
      {parseInt(entityRecord?.Category ?? '') === TaskTypeCategory.Todo ? (
        <ToDo style={colorGroup} type={'outline'} />
      ) : (
        <Appointment style={colorGroup} type={'filled'} />
      )}
    </div>
  );
};

export default TaskSubjectIcon;
