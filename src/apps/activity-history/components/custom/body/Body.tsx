/* eslint-disable complexity */
import React, { Suspense } from 'react';
import { ITimeline } from 'apps/activity-history/types';
import { ACTIVITY, ACTIVITY_TYPE, OPPORTUNITY } from 'apps/activity-history/constants';
import { noteParser } from 'common/utils/helpers/activity-history';
import BodyWrapper from '../../shared/body-wrapper';
import ActivityScore from '../../shared/activity-score';
import Opportunity from '../../shared/opportunity';
import BodyContent from '../../shared/body-content';
import SalesRevenue from '../components/sales-revenue';
import { isCancelledActivity } from '../utils';
import RegisterOnPortal from './RegisterOnPortal';

import {
  isConnectorEmailSection,
  isTrackLocation,
  getByLabel,
  getActivityType,
  getContent
} from './utils';
import Payment from '../../shared/payment';
import TopBarViewed from '../components/top-bar-viewed';
import { TOPBAR, WEB_EVENT } from '../constants';
import CustomWebEvent from '../components/custom-web-event';
import ConnectorEmail from '../components/connector-email';
import CustomActivityAccordion from './CustomActivityAccordion';
import { CallerSource } from 'src/common/utils/rest-client';

const getDateTime = ({
  activityEvent,
  activityType,
  isSalesCancelled,
  activityDateTime,
  eventNote,
  systemDate
}: {
  activityEvent: number | undefined;
  activityType: number | '';
  isSalesCancelled: boolean;
  activityDateTime: string;
  eventNote: {
    [key: string]: string;
  } | null;
  systemDate: string | undefined;
}): string => {
  if (activityEvent === ACTIVITY.SALES || activityType === ACTIVITY_TYPE.CUSTOM_ACTIVITY) {
    if (isSalesCancelled && eventNote) {
      return eventNote['Cancelled On'];
    }
    if (systemDate) {
      return systemDate;
    }
  }
  return activityDateTime;
};

const Body = (props: ITimeline): JSX.Element => {
  const { data, entityIds, type, entityDetailsCoreData } = props;

  const {
    Score = '',
    ActivityName = '',
    AdditionalDetails,
    ActivityEvent,
    Id = '',
    ActivityDateTime = '',
    SystemDate,
    ActivityType = ''
  } = data || {};

  const {
    ActivityScore: activityScore = Score,
    ActivityEvent_Note: activityEventNote = '',
    PortalDisplayName = '',
    PortalUrl = '',
    CreatedByName,
    Longitude,
    Latitude
  } = AdditionalDetails || {};

  const eventNote = noteParser(activityEventNote);

  const isSalesCancelled = isCancelledActivity(activityEventNote);
  const isTrackLocationEnabled = isTrackLocation(AdditionalDetails);

  const isCustomEmail = isConnectorEmailSection(activityEventNote);

  const activityType = getActivityType(AdditionalDetails?.ActivityEvent_Note || '', ActivityEvent);

  const isOppDetailsPage = !!entityIds?.opportunity;

  const renderComponent = (): JSX.Element => {
    if (isCustomEmail) {
      return (
        <ConnectorEmail
          additionalDetails={AdditionalDetails}
          activityName={ActivityName}
          activityId={Id}
        />
      );
    } else if (data.ActivityEvent == ACTIVITY.PAYMENT) {
      return <Payment data={data} showMetaData={false} entityIds={entityIds} />;
    } else if (activityType === TOPBAR) {
      return (
        <TopBarViewed
          activityName={ActivityName}
          additionalDetails={AdditionalDetails as Record<string, string>}
        />
      );
    } else if (activityType === WEB_EVENT) {
      return (
        <CustomWebEvent
          activityName={ActivityName}
          additionalDetails={AdditionalDetails as Record<string, string>}
        />
      );
    } else {
      return (
        <CustomActivityAccordion
          data={data}
          entityIds={entityIds}
          type={type}
          entityDetailsCoreData={entityDetailsCoreData}
        />
      );
    }
  };

  const getCreatedByName = (): string => {
    if (isSalesCancelled && eventNote) {
      return eventNote['Cancelled By'] || '';
    }
    return CreatedByName || data?.CreatedByName || '';
  };

  const oppComp = (
    <Opportunity additionalDetails={AdditionalDetails} activityEvent={ActivityEvent as number} />
  );

  const getOpportunityComponent = (): JSX.Element => {
    if (!isOppDetailsPage) {
      if (
        data.ActivityEvent === ACTIVITY.CHANGE_LOG ||
        data.ActivityEvent === ACTIVITY.OPPORTUNITY_CHANGE_LOG
      ) {
        const isOpportunityRecord =
          data.ActivityEvent === ACTIVITY.OPPORTUNITY_CHANGE_LOG ||
          AdditionalDetails?.ActivityEntityType === OPPORTUNITY;
        if (
          !isOpportunityRecord &&
          AdditionalDetails?.RelatedActivityId &&
          AdditionalDetails?.RelatedActivityName
        ) {
          return oppComp;
        }
      } else {
        return oppComp;
      }
    }
    return <></>;
  };

  return (
    <Suspense fallback={<></>}>
      <BodyWrapper>
        <>
          <div>
            <span className="lsq-marvin-ah-custom-activity">
              {renderComponent()}
              {getOpportunityComponent()}
            </span>

            {ActivityEvent === ACTIVITY.REGISTER_ON_PORTAL ? (
              <RegisterOnPortal portalUrl={PortalUrl} portalDisplayName={PortalDisplayName} />
            ) : null}

            {!isCustomEmail && !(activityType === TOPBAR || activityType === WEB_EVENT) ? (
              <BodyContent
                content={getContent(ActivityEvent, ActivityName)}
                byLabel={getByLabel(ActivityEvent as number, isSalesCancelled)}
                createdByName={getCreatedByName()}
                activityDateTime={getDateTime({
                  activityDateTime: ActivityDateTime,
                  activityEvent: ActivityEvent,
                  systemDate: SystemDate,
                  eventNote,
                  isSalesCancelled,
                  activityType: ActivityType
                })}
                isTrackLocationEnabled={isTrackLocationEnabled}
                longitude={Longitude}
                latitude={Latitude}
                callerSource={CallerSource.ActivityHistoryCustomActivity}
              />
            ) : null}
          </div>
          {ActivityEvent === ACTIVITY.SALES ? (
            <SalesRevenue note={activityEventNote} isSalesCancelled={isSalesCancelled} />
          ) : (
            <ActivityScore activityScore={activityScore} />
          )}
        </>
      </BodyWrapper>
    </Suspense>
  );
};

export default React.memo(Body);
