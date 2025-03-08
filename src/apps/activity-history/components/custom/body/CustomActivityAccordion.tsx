/* eslint-disable complexity */
import Accordion from '@lsq/nextgen-preact/accordion';
import {
  ArrowRotateAngle,
  ArrowRotateDirection,
  DefaultState
} from '@lsq/nextgen-preact/accordion/accordion.types';
import ActivityEventNote from '../../shared/activity-event-note';
import ActivityTable from 'common/component-lib/activity-table';
import ViewActivity from '../components/view-activity';
import { ACTIVITY } from 'apps/activity-history/constants';
import styles from './body.module.css';
import { IAugmentedAHDetail } from 'apps/activity-history/types';
import { applyStyleToName, getActivityName } from './utils';
import { CallerSource } from 'common/utils/rest-client';

import { IEntityIds } from 'apps/entity-details/types/entity-store.types';
import { EntityType } from 'common/types';
import { IEntityDetailsCoreData } from 'apps/entity-details/types/entity-data.types';

interface ICustomActivityAccordion {
  data: IAugmentedAHDetail;
  entityIds?: IEntityIds;
  type?: EntityType;
  entityDetailsCoreData?: IEntityDetailsCoreData | undefined;
}

const CustomActivityAccordion = (props: ICustomActivityAccordion): JSX.Element => {
  const { data, entityIds, type, entityDetailsCoreData } = props;

  const { ActivityName = '', ActivityType, ActivityEvent, Id = '', LeadId } = data || {};

  const leadId = entityIds?.lead;
  const opportunityId = entityIds?.opportunity;

  let { AdditionalDetails } = data || {};

  const prospectActivityID = AdditionalDetails?.ProspectActivityID;

  if (entityIds?.account && type === EntityType?.Account && !AdditionalDetails) {
    let oldValue, newValue;

    data?.Fields?.forEach((item) => {
      if (item.SchemaName === 'OldValue') {
        oldValue = item.Value;
      } else if (item.SchemaName === 'NewValue') {
        newValue = item.Value;
      }
    });

    AdditionalDetails = {
      OldData: oldValue as string,
      NewData: newValue as string,
      isAccountActivityHistoryTab: 'true'
    };
  }

  const { CompanyActivityId = Id, ProspectActivityID = CompanyActivityId as string } =
    AdditionalDetails || {};

  const displayViewActivity =
    ActivityEvent === ACTIVITY.CHANGE_LOG ||
    (!opportunityId && ActivityEvent === ACTIVITY.OPPORTUNITY_CHANGE_LOG);

  return (
    <Accordion
      name={getActivityName(data) || ''}
      defaultState={DefaultState.CLOSE}
      arrowRotate={{
        angle: ArrowRotateAngle.Deg90,
        direction: ArrowRotateDirection.ClockWise
      }}
      description={<ActivityEventNote data={data} />}
      customStyle={applyStyleToName(data) ? styles.cancelled_sales_activity : ''}>
      <>
        <ActivityTable
          id={(prospectActivityID || Id || data?.CompanyActivityId) as string}
          typeCode={ActivityType as number}
          eventCode={ActivityEvent as number}
          additionalDetails={AdditionalDetails as Record<string, string>}
          leadId={(leadId || LeadId) as string}
          callerSource={CallerSource.ActivityHistoryCustomActivity}
          entityDetailsCoreData={entityDetailsCoreData}
          isAccountActivityHistoryTab={
            entityIds?.account && type === EntityType.Account ? true : false
          }
        />
        {displayViewActivity ? (
          <ViewActivity
            activityId={ProspectActivityID || (data?.CompanyActivityId as string)}
            type={ActivityEvent}
            activityName={ActivityName}
            leadId={leadId as string}
            opportunityId={opportunityId || ''}
            isAccountActivityHistoryTab={
              entityIds?.account && type === EntityType.Account ? true : false
            }
          />
        ) : null}
      </>
    </Accordion>
  );
};

export default CustomActivityAccordion;
