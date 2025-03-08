import { IAdditionalDetails } from 'apps/activity-history/types';
import Icon from '@lsq/nextgen-preact/icon';
import { openOpportunityDetailsTab } from 'common/utils/helpers';
import styles from '../actions.module.css';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';
import { Variant } from 'src/common/types/button.types';

const Button = withSuspense(lazy(() => import('@lsq/nextgen-preact/button')));

export interface IView {
  additionalDetails: IAdditionalDetails;
  activityEvent: number;
  activityId: string;
  isOpportunity?: boolean;
}

const View = (props: IView): JSX.Element | null => {
  const { additionalDetails, activityEvent, isOpportunity, activityId } = props;

  const { RelatedActivityId, ProspectActivityID, RelatedActivityEvent } = additionalDetails || {};

  const relatedActivityId = RelatedActivityId || ProspectActivityID;

  const entityId = relatedActivityId || activityId;

  const onClick = (): void => {};

  const handleOppClick = (): void => {
    const eventCode = RelatedActivityEvent || activityEvent;
    if (entityId && eventCode) {
      openOpportunityDetailsTab({
        entityId,
        eventCode,
        openInNewTab: true
      });
    }
  };

  return (
    <>
      {entityId ? (
        <span className={styles.view_wrapper}>
          <Button
            text={<Icon name="open_in_new" customStyleClass={styles.view_icon} />}
            onClick={isOpportunity ? handleOppClick : onClick}
            variant={Variant.Secondary}
            title="View Opportunity Details"
            customStyleClass={styles.button}
            data-testid="ah-view-action"
          />
        </span>
      ) : null}
    </>
  );
};

View.defaultProps = {
  isOpportunity: false
};

export default View;
