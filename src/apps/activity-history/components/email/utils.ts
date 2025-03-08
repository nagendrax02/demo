import { EMAIL_SENT_TYPES } from '../../constants';

const getUserName = (firstName: string | undefined, lastName: string | undefined): string => {
  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  }
  if (firstName && !lastName) {
    return firstName;
  }
  if (lastName && !firstName) {
    return lastName;
  }
  return '';
};

// eslint-disable-next-line complexity
const getEmailOrUserName = (userName: string, email: string | undefined): string => {
  const pattern = /[\s\S]*<[\s\S]+/;
  if (email && pattern.test(email)) {
    return email;
  }
  if (userName && email) {
    return `${userName}<${email}>`;
  }
  if (userName && !email) {
    return userName;
  }
  if (!userName && email) {
    return email ? `<${email}>` : '';
  }
  return '';
};

const EmailSentText = {
  EmailWithSubject: 'Sent email with subject',
  NotificationEmail: 'Sent notification email with subject',
  EmailClient: 'Sent email through Email Client with subject',
  ReferralCampaignEmail: 'Sent Referral Campaign email with subject',
  AutomationEmail: 'Sent Automation email with subject'
};

const emailSentTextMapping = {
  [EMAIL_SENT_TYPES.SENT_WITH_SUBJECT]: EmailSentText.EmailWithSubject,
  [EMAIL_SENT_TYPES.SENT_WITH_SUBJECT_USER_EMAIL]: EmailSentText.EmailWithSubject,
  [EMAIL_SENT_TYPES.SENT_EMAIL_SUBJECT_EIGHT]: EmailSentText.EmailWithSubject,
  [EMAIL_SENT_TYPES.SENT_WITH_SUBJECT_EMAIL]: EmailSentText.EmailWithSubject,
  [EMAIL_SENT_TYPES.SENT_NOTIFICATION_EMAIL]: EmailSentText.NotificationEmail,
  [EMAIL_SENT_TYPES.SENT_EMAIL_THROUGH_EMAIL_CLIENT]: EmailSentText.EmailClient,
  [EMAIL_SENT_TYPES.SENT_REFERRAL_CAMPAIGN_EMAIL]: EmailSentText.ReferralCampaignEmail,
  [EMAIL_SENT_TYPES.SENT_AUTOMATION_EMAIL]: EmailSentText.AutomationEmail
};

const getEmailSentText = (campaignActivityType: string): string => {
  return emailSentTextMapping[campaignActivityType] || '';
};

export { getUserName, getEmailSentText, getEmailOrUserName };
