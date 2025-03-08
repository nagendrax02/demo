import { customActivityParser } from 'common/utils/helpers/activity-history';
import { ITimeline } from 'apps/activity-history/types';
import { ACTIVITY } from 'apps/activity-history/constants';
import BodyWrapper from '../../shared/body-wrapper';
import ActivityScore from '../../shared/activity-score';
import FormSubmittedOnWebsite from './FormSubmittedOnWebsite';
import PageVisitedOnWebsite from './PageVisitedOnWebsite';
import styles from './body.module.css';

const Body = (props: ITimeline): JSX.Element | null => {
  const { data, leadRepresentationName } = props;

  const { AdditionalDetails, ActivityName, ActivityEvent } = data || {};

  const {
    ActivityScore: activityScore,
    WebPublishedURL,
    WebContentName,
    ActivityEvent_Note: ActivityEventNote
  } = AdditionalDetails || {};

  const activityNameWithLeadRepName = ActivityName?.replace(
    'Lead',
    leadRepresentationName?.SingularName || 'Lead'
  );

  const activityRenderers: { [key: number]: () => JSX.Element } = {
    [ACTIVITY.CONVERTED_TO_LEAD]: () => <span> {activityNameWithLeadRepName}.</span>,
    [ACTIVITY.PAGE_VISITED_ON_WEBSITE]: () => <PageVisitedOnWebsite data={data} />,
    [ACTIVITY.FORM_SUBMITTED_ON_WEBSITE]: () => (
      <FormSubmittedOnWebsite
        additionalDetails={AdditionalDetails}
        leadRepresentationName={leadRepresentationName}
      />
    ),
    [ACTIVITY.TRACKING_URL_CLICKED]: () => (
      <>
        <span>Clicked on tracking url for</span>
        <a href={WebPublishedURL ?? ''} target="_blank" rel="noopener">
          {WebContentName}
        </a>
        .
      </>
    ),
    [ACTIVITY.CONVERSION_BUTTON_CLICKED]: () => {
      const parsedActivityEventNote = customActivityParser(ActivityEventNote || '');
      const CTAButtonName = parsedActivityEventNote?.CTAButtonName || '';
      return (
        <>
          <span>Viewed landing page</span>{' '}
          <a href={WebPublishedURL} target="_blank" rel="noopener">
            {WebContentName}
          </a>{' '}
          <span>and clicked on conversion button {CTAButtonName}</span>
        </>
      );
    }
  };

  const renderWebActivity = (): JSX.Element | null => {
    if (AdditionalDetails && ActivityEvent) {
      const renderActivity = activityRenderers[ActivityEvent] as () => JSX.Element;
      return renderActivity ? renderActivity() : null;
    }
    return null;
  };

  return (
    <BodyWrapper>
      <>
        <div className={styles.body_content}>{renderWebActivity()}</div>
        <ActivityScore activityScore={activityScore || ''} />
      </>
    </BodyWrapper>
  );
};

export default Body;
