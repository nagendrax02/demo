import Icon from '@lsq/nextgen-preact/icon';
import { IconVariant } from '@lsq/nextgen-preact/icon/icon.types';

const TaskIcon = ({
  customStyleClass,
  variant
}: {
  customStyleClass?: string;
  variant: IconVariant;
}): JSX.Element => {
  return (
    <Icon
      name={'assignment'}
      variant={variant}
      customStyleClass={customStyleClass}
      dataTestId="task-appointment-icon"
    />
  );
};

TaskIcon.defaultProps = {
  customStyleClass: ''
};

export default TaskIcon;
