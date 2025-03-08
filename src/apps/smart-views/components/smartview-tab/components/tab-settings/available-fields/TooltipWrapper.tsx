import { Placement, Trigger } from '@lsq/nextgen-preact/tooltip/tooltip.types';
import styles from './available-fields.module.css';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const Tooltip = withSuspense(lazy(() => import('@lsq/nextgen-preact/tooltip')));

const TooltipWrapper = ({
  message,
  showTooltip,
  children
}: {
  showTooltip: boolean;
  message: string;
  children: React.ReactElement;
}): JSX.Element => {
  return (
    <>
      {showTooltip ? (
        <Tooltip
          wrapperClass={styles.tooltip_message}
          content={message}
          placement={Placement.Vertical}
          trigger={[Trigger.Hover]}>
          {children}
        </Tooltip>
      ) : (
        children
      )}
    </>
  );
};

export default TooltipWrapper;
