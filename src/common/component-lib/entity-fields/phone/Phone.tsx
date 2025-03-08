import { useLeadRepName } from 'apps/entity-details/entitydetail.store';
import { Theme } from 'common/types';
import { Placement, Trigger } from '@lsq/nextgen-preact/tooltip/tooltip.types';
import { getDoNotCallMessage } from '../utils';
import styles from './phone.module.css';
import { IEntityRepNames } from 'apps/entity-details/types/entity-store.types';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const Tooltip = withSuspense(lazy(() => import('@lsq/nextgen-preact/tooltip')));

export interface IPhone {
  number: string;
  doNotCall: boolean;
  onClick?: () => void;
  entityRepNames?: IEntityRepNames;
}

const Phone = (props: IPhone): JSX.Element => {
  const { number, doNotCall, onClick, entityRepNames } = props;
  const leadRepName = useLeadRepName();

  const handleClick = (): void => {
    if (onClick && !doNotCall) onClick();
  };

  const getContent = (): JSX.Element => {
    return (
      <div
        title={number}
        data-testid={doNotCall ? 'phone-with-do-not-call' : 'phone'}
        onClick={handleClick}
        className={`${styles.styled_phone} ${!doNotCall ? styles.is_link : ''}`}>
        {number}
      </div>
    );
  };

  if (doNotCall) {
    return (
      <Tooltip
        content={getDoNotCallMessage(entityRepNames?.lead || leadRepName)}
        placement={Placement.Vertical}
        trigger={[Trigger.Hover]}
        theme={Theme.Light}>
        {getContent()}
      </Tooltip>
    );
  }
  return getContent();
};

Phone.defaultProps = {
  doNotCall: undefined,
  onClick: null,
  entityRepNames: undefined
};

export default Phone;
