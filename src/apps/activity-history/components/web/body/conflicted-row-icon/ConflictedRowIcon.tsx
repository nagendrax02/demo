import Icon from '@lsq/nextgen-preact/icon';
import { IconVariant } from '@lsq/nextgen-preact/icon/icon.types';
import styles from './conflicted-row-icon.module.css';
import { Placement, Trigger } from '@lsq/nextgen-preact/tooltip/tooltip.types';
import Lead from 'common/component-lib/entity-fields/lead';
import { IEntityRepresentationName } from 'apps/entity-details/types/entity-data.types';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

export interface IConflictedRowIcon {
  fieldData?: Record<string, string | Record<string, string>[]>;
  leadRepresentationName?: IEntityRepresentationName;
}

const Tooltip = withSuspense(lazy(() => import('@lsq/nextgen-preact/tooltip')));

const ConflictedRowIcon = ({
  fieldData,
  leadRepresentationName
}: IConflictedRowIcon): JSX.Element => {
  const getTooltipContent = (): JSX.Element => {
    const conflictedData = fieldData?.Data as Record<string, string>[];
    const leadId = conflictedData?.[0]?.LeadID;
    const leadRepName = leadRepresentationName?.SingularName || Lead;
    const textContent = `Another ${leadRepName} is present in the System with the same value.`;
    return (
      <span>
        {textContent}
        <Lead
          leadId={leadId}
          showIcon
          customIconName="open_in_new"
          displayValue={`View ${leadRepName}`}
          swapIconPosition
          openInNewTab
        />
      </span>
    );
  };

  return (
    <Tooltip
      content={getTooltipContent()}
      placement={Placement.Vertical}
      trigger={[Trigger.Hover]}
      wrapperClass={styles.wrapper}>
      <Icon name="warning" variant={IconVariant.Filled} customStyleClass={styles.icon} />
    </Tooltip>
  );
};

export default ConflictedRowIcon;
