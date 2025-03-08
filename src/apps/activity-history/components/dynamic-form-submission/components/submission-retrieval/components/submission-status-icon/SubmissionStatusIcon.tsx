import { Placement, Trigger } from '@lsq/nextgen-preact/tooltip/tooltip.types';
import Icon from '@lsq/nextgen-preact/icon';
import { IconVariant } from '@lsq/nextgen-preact/icon/icon.types';
import { ISubmissionStatusConfig, StatusType } from '../../submission-retrieval.types';
import styles from './submission-status-icon.module.css';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

export interface ISubmissionStatusIcon {
  config: ISubmissionStatusConfig;
}

const ToolTip = withSuspense(lazy(() => import('@lsq/nextgen-preact/tooltip')));

const SubmissionStatusIcon = ({ config }: ISubmissionStatusIcon): JSX.Element | undefined => {
  const getTooltipContent = (): JSX.Element => {
    const isFailure = config?.type === StatusType.Failure;
    return (
      <div className={styles.tooltip_wrapper}>
        <div
          className={`${styles.title} ${isFailure ? styles.failure_title : styles.success_title}`}>
          {config?.title}
        </div>
        {config?.reason ? <div>{config?.reason}</div> : null}
      </div>
    );
  };

  const getIcon = (status?: StatusType): JSX.Element => {
    if (status === StatusType.Failure)
      return (
        <Icon name="warning" customStyleClass={styles.failure_icon} variant={IconVariant.Filled} />
      );
    return (
      <Icon
        name="check_circle"
        customStyleClass={styles.success_icon}
        variant={IconVariant.Filled}
      />
    );
  };

  if (config?.showStatus) {
    return (
      <div className={styles.icon_wrapper}>
        <ToolTip
          content={getTooltipContent()}
          placement={Placement.Vertical}
          wrapperClass={styles.tooltip}
          trigger={[Trigger.Hover]}>
          {getIcon(config?.type)}
        </ToolTip>
      </div>
    );
  }
  return undefined;
};

export default SubmissionStatusIcon;
