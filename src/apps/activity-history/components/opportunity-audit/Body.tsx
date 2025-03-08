import { ITimeline } from 'apps/activity-history/types';
import { ACTIVITY } from 'apps/activity-history/constants';
import BodyWrapper from '../shared/body-wrapper';
import ActivityScore from '../shared/activity-score';
import Assigned from './components/assigned';
import StatusChange from './components/status-change';
import SourceChange from './components/source-change';

const Body = (props: ITimeline): JSX.Element => {
  const { data } = props;

  const { ActivityEvent, ActivityName, AuditData, AdditionalDetails } = data || {};

  const {
    ActivityScore: Score,
    FieldDisplayName,
    OldAdditionalValue,
    NewAdditionalValue,
    CreatedBy
  } = AdditionalDetails || {};

  const renderStatusChange = (
    <StatusChange
      auditData={AuditData}
      fieldDisplayName={FieldDisplayName}
      oldAdditionalValue={OldAdditionalValue}
      newAdditionalValue={NewAdditionalValue}
      activityName={ActivityName}
      changedById={CreatedBy}
    />
  );

  const activityComponents: { [key: number]: JSX.Element } = {
    [ACTIVITY.OPPORTUNITY_ASSIGNED]: (
      <Assigned auditData={AuditData} fieldDisplayName={FieldDisplayName} changedById={CreatedBy} />
    ),
    [ACTIVITY.OPPORTUNITY_STATUS_CHANGE]: renderStatusChange,
    [ACTIVITY.OPPORTUNITY_STATUS_CHANGE1]: renderStatusChange,
    [ACTIVITY.OPPORTUNITY_SOURCE_CHANGE]: (
      <SourceChange
        auditData={AuditData}
        fieldDisplayName={FieldDisplayName}
        oldAdditionalValue={OldAdditionalValue}
        newAdditionalValue={NewAdditionalValue}
        changedById={CreatedBy}
      />
    )
  };

  const component: JSX.Element | null =
    ActivityEvent && activityComponents[ActivityEvent]
      ? (activityComponents[ActivityEvent] as JSX.Element)
      : null;

  return (
    <BodyWrapper>
      <>
        <div className="body-content">{component}</div>
        <ActivityScore activityScore={Score || ''} />
      </>
    </BodyWrapper>
  );
};

export default Body;
