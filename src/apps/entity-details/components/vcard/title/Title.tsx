import Shimmer from '@lsq/nextgen-preact/shimmer';
import { ITitleConfig } from '../../../types';
import styles from './title.module.css';
import { isMobileDevice } from 'common/utils/helpers';
import { Placement, Trigger } from '@lsq/nextgen-preact/tooltip/tooltip.types';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const Tooltip = withSuspense(lazy(() => import('@lsq/nextgen-preact/tooltip')));

interface ITitle extends Omit<React.HTMLAttributes<HTMLDivElement>, 'className'> {
  isLoading: boolean;
  config: ITitleConfig | undefined;
  customStyleClass?: string;
}

const Title = ({ isLoading, config, customStyleClass, ...otherProps }: ITitle): JSX.Element => {
  const getContent = (): JSX.Element => {
    if (config?.CustomComponent) {
      return config?.CustomComponent;
    }

    return (
      <div
        className={`${styles.title} ${config?.className || ''} ${customStyleClass || ''}`}
        title={config?.content}
        {...otherProps}>
        {config?.content}
      </div>
    );
  };

  const getContentWithTooltip = (): JSX.Element => {
    return (
      <Tooltip
        content={config?.content || ''}
        placement={Placement.Vertical}
        trigger={[Trigger.Click]}>
        {getContent()}
      </Tooltip>
    );
  };

  return (
    <>
      {!isLoading ? (
        isMobileDevice() ? (
          getContentWithTooltip()
        ) : (
          getContent()
        )
      ) : (
        <Shimmer className={styles.title_shimmer} dataTestId="title-shimmer" />
      )}
    </>
  );
};

Title.defaultProps = {
  customStyleClass: ''
};

export default Title;
