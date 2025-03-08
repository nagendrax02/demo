import Shimmer from '@lsq/nextgen-preact/shimmer';
import { IBadgeConfig } from '../../../types';
import styles from './badge.module.css';
import { Placement, Trigger } from '@lsq/nextgen-preact/tooltip/tooltip.types';
import { showEllipsesAfter24Char } from 'common/utils/helpers/helpers';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const Tooltip = withSuspense(lazy(() => import('@lsq/nextgen-preact/tooltip')));

interface IBadge {
  isLoading: boolean;
  config: IBadgeConfig | undefined;
  customStyleClass?: string;
}

const Badge = ({ isLoading, config, customStyleClass }: IBadge): JSX.Element => {
  const getContent = (): JSX.Element => {
    const content = (
      <div
        className={`${styles.badge} ${customStyleClass} ${config?.className}`}
        title={config?.content}>
        {showEllipsesAfter24Char(config?.content || '')}
      </div>
    );

    if (config?.tooltipContent) {
      return (
        <Tooltip
          content={config?.tooltipContent}
          placement={Placement.Vertical}
          trigger={[Trigger.Hover]}>
          {content}
        </Tooltip>
      );
    }
    return content;
  };
  return (
    <>
      {!isLoading ? (
        getContent()
      ) : (
        <Shimmer className={styles.shimmer} dataTestId="badge-shimmer" />
      )}
    </>
  );
};

Badge.defaultProps = {
  customStyleClass: ''
};

export default Badge;
