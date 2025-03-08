import { Placement, Trigger } from '@lsq/nextgen-preact/tooltip/tooltip.types';
import Icon from '@lsq/nextgen-preact/icon';
import styles from './styles.module.css';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const Tooltip = withSuspense(lazy(() => import('@lsq/nextgen-preact/tooltip')));

const TooltipWrapper = ({
  message,
  url,
  icon
}: {
  message: JSX.Element;
  icon: string;
  url: string;
}): JSX.Element => {
  return (
    <>
      {url ? (
        <div className={styles.icon_wrapper}>
          <Tooltip content={message} placement={Placement.Vertical} trigger={[Trigger.Hover]}>
            <a href={url} target="_blank" rel="noopener">
              <Icon name={icon} customStyleClass={styles.icon} />
            </a>
          </Tooltip>
        </div>
      ) : null}
    </>
  );
};

export default TooltipWrapper;
