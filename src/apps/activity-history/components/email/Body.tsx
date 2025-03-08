import { ACTIVITY } from '../../constants';
import { IAugmentedAHDetail, ITimeline } from '../../types';
import ActivityScore from '../shared/activity-score';
import BodyWrapper from '../shared/body-wrapper';
import styles from './email.module.css';
import {
  EmailSent,
  EmailUnsubscribed,
  EmailBounced,
  EmailOpened,
  EmailLinkClicked,
  EmailResponse,
  EmailUnsubscribedLinkClicked,
  ViewInBrowserLinkClicked,
  EmailMarkAsSpam,
  CustomEmailSubscription,
  OpportunityLink
} from './components';
import { EmailRenderType, IEmailComponents } from './email.types';
import { Suspense } from 'react';

const Body = (props: ITimeline): JSX.Element => {
  const { data, entityDetailsCoreData } = props;
  const { AdditionalDetails } = data;
  const activityEvent = data?.ActivityEvent;
  const activityName = data?.ActivityName;

  const emailComponents: IEmailComponents = {
    [EmailRenderType.EmailBounced]: EmailBounced,
    [EmailRenderType.EmailSent]: EmailSent,
    [EmailRenderType.EmailUnsubscribe]: EmailUnsubscribed,
    [EmailRenderType.EmailPositiveResponse]: EmailResponse,
    [EmailRenderType.EmailNegativeResponse]: EmailResponse,
    [EmailRenderType.EmailNeutralResponse]: EmailResponse,
    [EmailRenderType.EmailInboundLead]: EmailResponse,
    [EmailRenderType.EmailUnsubscribeLinkClicked]: EmailUnsubscribedLinkClicked,
    [EmailRenderType.EmailBrowserLinkClicked]: ViewInBrowserLinkClicked,
    [EmailRenderType.EmailMarkedAsSpam]: EmailMarkAsSpam,
    [ACTIVITY.EMAIL_OPENED]: EmailOpened,
    [ACTIVITY.EMAIL_LINK_CLICKED]: EmailLinkClicked,
    [ACTIVITY.CUSTOM_EMAIL]: CustomEmailSubscription
  };

  const renderEmailContent = (activity: IAugmentedAHDetail): JSX.Element => {
    let ActivityComponent: React.FC<ITimeline> = () => <></>;
    const componentsByEvent =
      activityEvent && (emailComponents[activityEvent] as React.FC<ITimeline>);

    if (activityEvent && componentsByEvent) {
      ActivityComponent = componentsByEvent as React.FC<ITimeline>;
    } else if (activityName === ACTIVITY.EMAIL_OPENED) {
      ActivityComponent = emailComponents[ACTIVITY.EMAIL_OPENED] as React.FC<ITimeline>;
    } else {
      ActivityComponent = emailComponents[ACTIVITY.CUSTOM_EMAIL] as React.FC<ITimeline>;
    }

    return (
      <Suspense fallback={<></>}>
        <ActivityComponent data={activity} />
      </Suspense>
    );
  };

  return (
    <BodyWrapper>
      <>
        <div>
          <div data-testid="email-activities" className={styles.margin_right}>
            {renderEmailContent(data)}
          </div>
          <OpportunityLink data={data} entityDetailsCoreData={entityDetailsCoreData} />
        </div>
        <ActivityScore activityScore={`${AdditionalDetails?.ActivityScore || 0}`} />
      </>
    </BodyWrapper>
  );
};

export default Body;
