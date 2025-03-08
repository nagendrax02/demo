import { ITimeline } from 'apps/activity-history/types';
import { ACTIVITY } from 'apps/activity-history/constants';
import BodyWrapper from '../shared/body-wrapper';
import ActivityScore from '../shared/activity-score';
import Assigned from './components/assigned';
import StageChange from './components/stage-change';
import Merged from './components/merged';
import SourceChange from './components/source-change';
import Associated from './components/associated';
import { EntityType } from 'common/types';

const Body = (props: ITimeline): JSX.Element => {
  const { data, leadRepresentationName, type, entityDetailsCoreData } = props;

  const { entityIds, entityTypeRepName } = entityDetailsCoreData || {};

  const { AuditData, AdditionalDetails, ActivityEvent, CreatedBy = '' } = data || {};

  const getRepresentationName = (): string => {
    if (entityIds?.account && type === EntityType.Account) {
      return entityTypeRepName || '';
    }
    return leadRepresentationName?.SingularName || '';
  };

  const {
    ActivityScore: Score = '',
    AuditComment = '',
    CreatedBy: additionalDetailsCreatedBy,
    NewValue = '',
    ProspectAuditId = ''
  } = AdditionalDetails || {};

  const changedById = additionalDetailsCreatedBy || CreatedBy;

  const activityComponents: { [key: number]: JSX.Element } = {
    [ACTIVITY.LEAD_ASSIGNED]: (
      <Assigned
        leadRepresentationName={leadRepresentationName}
        auditData={AuditData}
        auditComment={AuditComment}
        changedById={changedById}
        entityDetailsCoreData={entityDetailsCoreData}
        type={type}
      />
    ),
    [ACTIVITY.STAGE_CHANGE]: (
      <StageChange
        repName={getRepresentationName()}
        auditData={AuditData}
        auditComment={AuditComment}
        changedById={changedById}
      />
    ),
    [ACTIVITY.LEAD_MERGED]: (
      <Merged
        leadRepresentationName={leadRepresentationName}
        auditData={AuditData}
        auditComment={AuditComment}
        newValue={NewValue}
        changedById={changedById}
        prospectAuditId={ProspectAuditId}
      />
    ),
    [ACTIVITY.SOURCE_CHANGE]: (
      <SourceChange
        leadRepresentationName={leadRepresentationName}
        auditData={AuditData}
        changedById={changedById}
      />
    ),
    [ACTIVITY.LEAD_ASSOCIATED]: (
      <Associated
        leadRepresentationName={leadRepresentationName}
        auditData={AuditData}
        changedById={changedById}
        type={type}
        entityDetailsCoreData={entityDetailsCoreData}
      />
    )
  };

  const component =
    ActivityEvent && activityComponents[ActivityEvent]
      ? (activityComponents[ActivityEvent] as JSX.Element)
      : null;

  return (
    <BodyWrapper>
      <>
        <div>{component}</div>
        <ActivityScore activityScore={Score} />
      </>
    </BodyWrapper>
  );
};

export default Body;
