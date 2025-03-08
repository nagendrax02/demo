import { useMiPHeader } from '../../mip-header.store';
import { WORK_AREAS } from '../constant';
import { IReason } from '../MiPFeedback.types';
import Option from './Option';
import styles from '../feedback.module.css';
import { handleWorkAreaClick, useMiPFeedBack } from '../mip-feedback.store';

const WorkAreas = (): JSX.Element => {
  const { module, clickedAction } = useMiPHeader((state) => ({
    module: state.module,
    clickedAction: state.clickedAction
  }));

  const selectedWorkArea = useMiPFeedBack((state) => state.workArea);

  const onClick = (value: string): void => {
    handleWorkAreaClick(value);
  };
  return (
    <div className={styles.option_wrapper}>
      {WORK_AREAS[module].map((action: IReason) => {
        if (action?.unSupportedAction?.includes(clickedAction || '')) return null;
        return (
          <Option
            key={action.id}
            title={action.title}
            onClick={() => {
              onClick(action.value);
            }}
            selected={selectedWorkArea === action.value}
          />
        );
      })}
    </div>
  );
};

export default WorkAreas;
