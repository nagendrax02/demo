import { ITimeline } from '../../../types';
import BodyWrapper from '../../shared/body-wrapper';
import ActivityScore from '../../shared/activity-score';
import BodyContent from '../../shared/body-content';
import { ACTIVITY } from '../../../constants';
import styles from './body.module.css';
import { CallerSource } from 'src/common/utils/rest-client';

const Body = (props: ITimeline): JSX.Element => {
  const { data } = props;

  const {
    ActivityScore: activityScore,
    PortalDisplayName,
    PortalUrl,
    CreatedByName,
    CreatedBy
  } = data.AdditionalDetails || {};

  const getPortalText = (): JSX.Element | string => {
    if (!PortalDisplayName) {
      return 'Portal';
    }

    return PortalUrl ? (
      <a href={PortalUrl} target="_blank" className={styles.anchor} rel="noopener">
        {PortalDisplayName}
      </a>
    ) : (
      PortalDisplayName
    );
  };

  const text = ((): JSX.Element => {
    switch (data.ActivityEvent) {
      case ACTIVITY.FORGOT_PASSWORD:
        return (
          <>
            <span>Triggered forgot password request for </span>
            {getPortalText()}
          </>
        );
      case ACTIVITY.LOGGED_OUT_PORTAL:
        return (
          <>
            <span>Logged out of </span>
            {getPortalText()}
          </>
        );
      case ACTIVITY.LOGGED_INTO_PORTAL:
        return (
          <>
            <span>Logged into </span>
            {getPortalText()}
          </>
        );
      case ACTIVITY.CHANGED_PASSWORD_OF_PORTAL:
        return (
          <>
            <span>Changed password of </span>
            {getPortalText()}
          </>
        );
      default:
        return <></>;
    }
  })();

  const getContent = (): JSX.Element => (text ? <span>{text}</span> : <></>);

  return (
    <BodyWrapper>
      <>
        <BodyContent
          content={getContent()}
          byLabel="Added by"
          createdBy={CreatedBy}
          createdByName={CreatedByName}
          activityDateTime={data.ActivityDateTime}
          callerSource={CallerSource.ActivityHistoryPortalActivity}
        />
        <ActivityScore activityScore={activityScore || ''} />
      </>
    </BodyWrapper>
  );
};

export default Body;
