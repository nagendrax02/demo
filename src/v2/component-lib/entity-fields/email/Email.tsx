import { Placement, Trigger } from '@lsq/nextgen-preact/tooltip/tooltip.types';
import { EntityAttributeType } from 'common/types/entity/lead/metadata.types';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';
import { Theme } from 'common/types';
import commonStyle from '../common-style.module.css';
import { classNames } from 'common/utils/helpers/helpers';

const Tooltip = withSuspense(lazy(() => import('@lsq/nextgen-preact/tooltip')));

export interface IEmail {
  emailId: string;
  disabled?: boolean;
  tooltipContent?: string;
  onClick?: () => void;
  entityAttributeType?: EntityAttributeType;
}

const Email = (props: IEmail): JSX.Element => {
  const { emailId, disabled, tooltipContent, onClick, entityAttributeType } = props;

  const onEmailClick = (): void => {
    if (onClick) {
      onClick();
    }
  };

  if (entityAttributeType === EntityAttributeType.Custom) {
    return (
      <a
        className={classNames(commonStyle.ellipsis_text, commonStyle.hyper_link)}
        title={emailId}
        href={`mailto:${emailId}`}>
        {emailId}
      </a>
    );
  }

  const getEmailId = (showTitle = false): JSX.Element => {
    if (disabled) {
      return (
        <div
          className={classNames(commonStyle.ellipsis, commonStyle.disabled_text, 'table-data')}
          title={showTitle ? emailId : ''}>
          {emailId}
        </div>
      );
    }
    return (
      <div
        className={classNames(commonStyle.ellipsis, commonStyle.hyper_link, 'table-data')}
        onClick={onEmailClick}
        title={showTitle ? emailId : ''}>
        {emailId}
      </div>
    );
  };

  if (tooltipContent) {
    return (
      <Tooltip
        theme={Theme.Dark}
        content={tooltipContent}
        placement={Placement.Vertical}
        trigger={[Trigger.Hover]}
        wrapperClass={commonStyle.ellipsis}>
        <>{getEmailId(false)}</>
      </Tooltip>
    );
  }
  return getEmailId(true);
};

export default Email;
