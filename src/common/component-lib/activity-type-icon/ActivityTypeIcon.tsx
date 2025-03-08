/* eslint-disable @typescript-eslint/naming-convention */
import {
  CustomActivityInbound,
  CustomActivityOutbound,
  Email,
  FormSubmitted,
  Activities,
  InboundPhoneCall,
  LeadCaptured,
  OpportunityCaptured,
  OpportunityChangeLog,
  OutboundPhoneCall,
  PortalActivity,
  Privacy,
  WebActivity,
  NeutralEmail,
  EmailClicked,
  OpenedMail,
  PositiveMail,
  EmailRepliedActivity,
  EmailSent,
  Sales
} from 'assets/custom-icon/v2';

export interface ICategoryIconProps {
  value: string;
  eventType: number;
  iconType: 'outline' | 'filled' | 'duotone';
  customStyleClass: string;
  eventDirection?: number;
}

interface IActivityIconProps {
  eventType: number;
  customStyleClass: string;
  iconType: 'outline' | 'filled' | 'duotone';
  eventDirection?: number;
}
const CustomActivityInboundType = 0;
const CustomActivityOutboundType = 1;
const CustomActivityType = 2;

const renderActivityIcon = ({
  eventType,
  customStyleClass,
  iconType,
  eventDirection
}: IActivityIconProps): JSX.Element => {
  if (eventType === CustomActivityType) {
    switch (eventDirection) {
      case CustomActivityInboundType:
        return <CustomActivityInbound type={iconType} className={customStyleClass} />;
      case CustomActivityOutboundType:
        return <CustomActivityOutbound type={iconType} className={customStyleClass} />;
    }
  }
  return <Activities type={iconType} className={customStyleClass} />;
};

const activityTypeMap: Record<string, React.ElementType> = {
  // Sales Activities and Payment activity
  '30': Sales,
  '31': Sales,
  '98': Sales,

  // Portal Activities
  '96': PortalActivity,
  '11011': PortalActivity,
  '95': PortalActivity,
  '94': PortalActivity,
  '93': PortalActivity,
  '92': PortalActivity,
  '91': PortalActivity,

  // Form Submissions
  '90': FormSubmitted,
  '3': FormSubmitted,
  '97': FormSubmitted,
  '21501': FormSubmitted,

  // Opportunity Logs
  '32': OpportunityChangeLog,
  '33': OpportunityCaptured,

  // Phone Calls
  '21': InboundPhoneCall,
  '22': OutboundPhoneCall,

  // Web Activities
  '11': WebActivity,
  '2': WebActivity,
  '20': WebActivity,
  '4': WebActivity,

  // Lead Captured
  '19': LeadCaptured,
  '23': LeadCaptured,

  // Privacy Activities
  '24': Privacy,
  '27': Privacy,
  '28': Privacy,
  '25': Privacy,
  '26': Privacy,

  // Neutral Email Activities
  '10': NeutralEmail,
  '9': NeutralEmail,
  '13': NeutralEmail,
  '5': NeutralEmail,
  '6': NeutralEmail,
  '62': NeutralEmail,
  '61': NeutralEmail,

  // Email Clicks and Opens
  '1': EmailClicked,
  '0': OpenedMail,

  // Positive Email Activities
  '8': PositiveMail,
  '12': PositiveMail,
  '15': PositiveMail,
  '42': PositiveMail,
  '41': PositiveMail,

  // General Email Activities
  '2001': Email,
  '14': Email,

  // Replies and Sent Emails
  '18': EmailRepliedActivity,
  '225': EmailRepliedActivity,
  '224': EmailSent
};
export const ActivityTypeIcon = ({
  value,
  eventType,
  iconType,
  customStyleClass,
  eventDirection
}: ICategoryIconProps): JSX.Element => {
  const ActivityComponent = activityTypeMap[value] || null;

  return ActivityComponent ? (
    <ActivityComponent type={iconType} className={customStyleClass} />
  ) : (
    renderActivityIcon({ eventType, customStyleClass, iconType, eventDirection })
  );
};
