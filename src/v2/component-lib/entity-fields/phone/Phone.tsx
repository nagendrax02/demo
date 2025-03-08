import { Theme } from 'common/types';
import { Placement, Trigger } from '@lsq/nextgen-preact/tooltip/tooltip.types';
import styles from './phone.module.css';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';
import { classNames } from 'common/utils/helpers/helpers';
import { DO_NOT_CONTACT_MSG } from '../constant';

const Tooltip = withSuspense(lazy(() => import('@lsq/nextgen-preact/tooltip')));

export interface IPhone {
  number: string;
  doNotCall: boolean;
  onClick?: () => void;
}

const Phone = (props: IPhone): JSX.Element => {
  const { number, doNotCall, onClick } = props;

  const handleClick = (): void => {
    if (onClick && !doNotCall) onClick();
  };

  const getContent = (showTitle = false): JSX.Element => {
    return (
      <div
        title={showTitle ? number : ''}
        data-testid={doNotCall ? 'phone-with-do-not-call' : 'phone'}
        onClick={handleClick}
        className={classNames(
          styles.phone_wrapper,
          doNotCall ? styles.disabled : styles.hover_state
        )}>
        {number}
      </div>
    );
  };

  if (doNotCall) {
    return (
      <Tooltip
        content={DO_NOT_CONTACT_MSG.DoNotCall}
        placement={Placement.Vertical}
        trigger={[Trigger.Hover]}
        theme={Theme.Dark}
        wrapperClass={styles.phone_wrapper}>
        {getContent()}
      </Tooltip>
    );
  }
  return getContent(true);
};

Phone.defaultProps = {
  doNotCall: undefined,
  onClick: null,
  entityRepNames: undefined
};

export default Phone;
