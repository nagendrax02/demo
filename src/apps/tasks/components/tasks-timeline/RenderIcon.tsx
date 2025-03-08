import { IconVariant } from '@lsq/nextgen-preact/icon/icon.types';
import { ITaskItem } from '../../tasks.types';
import { TaskIcon, TodoIcon } from '../tasks-icon';
import styles from './tasks-timeline.module.css';

interface IRenderIcon {
  data: ITaskItem;
}

const RenderIcon = (props: IRenderIcon): JSX.Element => {
  const { data } = props;

  return (
    <div className={styles.timeline_icon}>
      {data?.Category === 1 || data?.CategoryType === 1 ? (
        <TodoIcon />
      ) : (
        <TaskIcon variant={IconVariant.Outlined} />
      )}
    </div>
  );
};

export default RenderIcon;
