import styles from './email.module.css';
import { Placement, Trigger } from '@lsq/nextgen-preact/tooltip/tooltip.types';
import { Theme } from '../../../types';
import { EntityAttributeType } from 'common/types/entity/lead/metadata.types';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const Tooltip = withSuspense(lazy(() => import('@lsq/nextgen-preact/tooltip')));

export interface IEmail {
  emailId: string;
  disabled?: boolean;
  tooltipContent?: string;
  onClick?: () => void;
  entityAttributeType?: EntityAttributeType;
  tooltipTheme?: Theme;
}

const Email = (props: IEmail): JSX.Element => {
  const { emailId, disabled, tooltipContent, onClick, entityAttributeType, tooltipTheme } = props;

  const onEmailClick = (): void => {
    if (onClick) {
      onClick();
    }
  };

  if (entityAttributeType === EntityAttributeType.Custom) {
    return (
      <a className={styles.email} title={emailId} href={`mailto:${emailId}`}>
        {emailId}
      </a>
    );
  }

  const getEmailId = (): JSX.Element => {
    if (disabled) {
      return <div className="table-data">{emailId}</div>;
    }
    return (
      <div className={styles.email + ' table-data'} onClick={onEmailClick}>
        {emailId}
      </div>
    );
  };

  if (tooltipContent) {
    return (
      <Tooltip
        theme={tooltipTheme ? tooltipTheme : Theme.Dark}
        content={tooltipContent}
        placement={Placement.Vertical}
        trigger={[Trigger.Hover]}>
        <>{getEmailId()}</>
      </Tooltip>
    );
  }
  return getEmailId();
};

export default Email;
