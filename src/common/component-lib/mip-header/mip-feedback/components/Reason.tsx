import { useMiPHeader } from '../../mip-header.store';
import { IReason } from '../MiPFeedback.types';
import { REASONS } from '../constant';
import Option from './Option';
import styles from '../feedback.module.css';
import { handleReasonClick, useMiPFeedBack } from '../mip-feedback.store';

const Reason = (): JSX.Element => {
  const { module, clickedAction } = useMiPHeader((state) => ({
    module: state.module,
    clickedAction: state.clickedAction
  }));
  const selectedReason = useMiPFeedBack((state) => state.reason);

  const onClick = (value): void => {
    handleReasonClick(value);
  };

  return (
    <div className={styles.option_wrapper}>
      {REASONS[module].map((reason: IReason) => {
        if (reason?.unSupportedAction?.includes(clickedAction || '')) return null;
        return (
          <Option
            key={reason.id}
            title={reason.title}
            onClick={() => {
              onClick(reason);
            }}
            selected={selectedReason.value === reason.value}
          />
        );
      })}
    </div>
  );
};

export default Reason;
