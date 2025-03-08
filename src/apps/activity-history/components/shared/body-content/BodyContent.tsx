import { IBodyContent } from '../../../types';
import MetadataInfo from '../metadata-info';
import styles from './body-content.module.css';

const BodyContent = (props: IBodyContent): JSX.Element => {
  const {
    activityDateTime,
    createdBy,
    content,
    byLabel,
    createdByName,
    isTrackLocationEnabled,
    longitude,
    latitude,
    children,
    callerSource
  } = props;

  return (
    <div className={styles.content_wrapper}>
      {content}
      <MetadataInfo
        activityDateTime={activityDateTime}
        createdBy={createdBy}
        byLabel={byLabel}
        createdByName={createdByName}
        callerSource={callerSource}
        isTrackLocationEnabled={isTrackLocationEnabled}
        longitude={longitude}
        latitude={latitude}
      />
      {children ? children : null}
    </div>
  );
};

export default BodyContent;
