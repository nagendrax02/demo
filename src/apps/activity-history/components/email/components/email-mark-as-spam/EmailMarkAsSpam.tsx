import { IAugmentedAHDetail } from 'apps/activity-history/types';
import styles from './email-mark-as-spam.module.css';
export interface IEmailMarkAsSpam {
  data: IAugmentedAHDetail;
}

const getEmailMarkedAsSpamText = (campaignActivityName: string | undefined): string => {
  if (campaignActivityName) {
    return `Marked email Campaign ${campaignActivityName} with subject`;
  }
  return `Marked email with subject`;
};

const EmailMarkAsSpam = ({ data }: IEmailMarkAsSpam): JSX.Element => {
  const { AdditionalDetails } = data;
  const campaignActivityName = AdditionalDetails?.CampaignActivityName;
  /* istanbul ignore next */
  const subject = AdditionalDetails?.EmailSubject || '';
  return (
    <div>
      {getEmailMarkedAsSpamText(campaignActivityName)}{' '}
      <span className={styles.subject}>{subject}</span> as spam
    </div>
  );
};

export default EmailMarkAsSpam;
