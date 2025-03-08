import Icon from '@lsq/nextgen-preact/icon';
import styles from './captured-from-icon.module.css';
import { ICapturedFromConfig } from '../../submission-retrieval.types';
import { Placement, Trigger } from '@lsq/nextgen-preact/tooltip/tooltip.types';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

export interface ICapturedFromIcon {
  config?: ICapturedFromConfig;
}

const Tooltip = withSuspense(lazy(() => import('@lsq/nextgen-preact/tooltip')));

const CapturedFromIcon = ({ config }: ICapturedFromIcon): JSX.Element => {
  const getTooltipContent = (): JSX.Element => {
    return (
      <div className={styles.tooltip_content}>
        <span className={styles.submitted_by}>Submitted via:</span> <span>{config?.source}</span>
      </div>
    );
  };
  if (config?.showIcon)
    return (
      <Tooltip
        content={getTooltipContent()}
        placement={Placement.Horizontal}
        wrapperClass={styles.tooltip_wrapper}
        trigger={[Trigger.Hover]}>
        <Icon name="info" customStyleClass={styles.captured_from_icon} />
      </Tooltip>
    );
  return <></>;
};

CapturedFromIcon.defaultProps = {
  config: undefined
};

export default CapturedFromIcon;
