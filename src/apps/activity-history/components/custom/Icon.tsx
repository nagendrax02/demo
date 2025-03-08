import { ACTIVITY, OPPORTUNITY } from 'apps/activity-history/constants';
import { ITimeline, BgColor } from 'apps/activity-history/types';
import OpportunityIcon from '../shared/opportunity-icon';
import StyledIcon from '../shared/styled-icon';
import { isCancelledActivity } from './utils';

const Icon = (props: ITimeline): JSX.Element => {
  const {
    data: { ActivityEvent }
  } = props;

  const { AdditionalDetails } = props.data || {};

  const { ActivityEntityType, ActivityEvent_Note: eventNote = '' } = AdditionalDetails || {};

  if (ActivityEntityType === OPPORTUNITY) {
    return (
      <StyledIcon>
        <OpportunityIcon />
      </StyledIcon>
    );
  }

  const isSalesCancelled = isCancelledActivity(eventNote);

  const isPortal =
    ActivityEvent === ACTIVITY.PUBLISHER_TRACKING ||
    ActivityEvent === ACTIVITY.REGISTER_ON_PORTAL ||
    ActivityEvent === ACTIVITY.FORM_SAVED_AS_DRAFT_ON_PORTAL;

  const isLog =
    ActivityEvent === ACTIVITY.CHANGE_LOG || ActivityEvent === ACTIVITY.OPPORTUNITY_CHANGE_LOG;

  const getIconName = (): string => {
    if (ActivityEvent === ACTIVITY.SALES || isSalesCancelled) return 'shopping_cart';
    if (isLog) return 'list_alt';
    if (isPortal) return 'web';
    return 'timeline';
  };

  const getBgColor = (): BgColor => {
    if (ActivityEvent === ACTIVITY.SALES && isSalesCancelled) return BgColor.Danger1;
    if (ActivityEvent === ACTIVITY.SALES) return BgColor.Green500;
    if (ActivityEvent === ACTIVITY.CHANGE_LOG) return BgColor.Blue500;
    if (ActivityEvent === ACTIVITY.OPPORTUNITY_CHANGE_LOG) return BgColor.Purple500;
    if (isPortal) return BgColor.Indigo500;
    return BgColor.Blue500;
  };

  return (
    <StyledIcon
      name={getIconName()}
      bgColor={getBgColor()}
      dataTestId={`activity-${getBgColor()}`}
    />
  );
};

export default Icon;
