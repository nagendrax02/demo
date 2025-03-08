import { ACTIVITY, ACTIVITY_TYPE } from 'apps/activity-history/constants';
import { ITimeline } from 'apps/activity-history/types';
import Timeline from 'common/component-lib/timeline';
import DateTime from '../shared/date-time';
import Icon from './Icon';
import Body from './body';
import PrivacyIcon from '../privacy/Icon';
import Actions from './actions';
import { getActivityType, isConnectorEmailSection } from './body/utils';
import { isCancelledActivity } from './utils';
import { TOPBAR } from './constants';

const Custom = (props: ITimeline): JSX.Element => {
  const { data, type, entityDetailsCoreData } = props;

  const { ActivityEvent, AdditionalDetails, ActivityType } = data || {};
  const { ActivityEvent_Note: activityEventNote = '' } = AdditionalDetails || {};
  const isCustomEmail = isConnectorEmailSection(activityEventNote);
  const isSalesActivityCancelled = isCancelledActivity(AdditionalDetails?.ActivityEvent_Note || '');

  const GetIcon = (): JSX.Element => {
    if (
      ActivityEvent === ACTIVITY.PRIVACY_COOKIE_CONSENT ||
      ActivityEvent === ACTIVITY.DATA_PROTECTION_REQUEST
    ) {
      return <PrivacyIcon />;
    }

    return <Icon data={data} />;
  };

  const GetAction = (): JSX.Element => {
    const activityType = getActivityType(
      AdditionalDetails?.ActivityEvent_Note || '',
      ActivityEvent
    );
    if (
      (ActivityEvent && ActivityEvent === ACTIVITY.SALES && isSalesActivityCancelled) ||
      ActivityType === ACTIVITY_TYPE.PORTAL_ACTIVITY ||
      activityType === TOPBAR
    )
      return <></>;
    return (
      <Actions
        data={data}
        replyEmail={isCustomEmail}
        type={type}
        entityDetailsCoreData={entityDetailsCoreData}
      />
    );
  };

  return (
    <Timeline
      timeline={{
        data,
        entityIds: entityDetailsCoreData?.entityIds,
        type,
        entityDetailsCoreData
      }}
      components={{
        DateTime,
        Icon: GetIcon,
        Body,
        Actions: GetAction
      }}
    />
  );
};

export default Custom;
