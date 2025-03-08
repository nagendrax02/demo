import UserName from 'common/component-lib/user-name';
import { getFormattedDateTime } from 'common/utils/date';
import { IMetaDataInfo } from '../../../types';
import styles from './metadata-info.module.css';
import TrackLocation from '../track-location';

const MetaDataInfo = (props: IMetaDataInfo): JSX.Element => {
  const {
    activityDateTime,
    createdByName,
    byLabel,
    createdBy,
    callerSource,
    isTrackLocationEnabled,
    latitude,
    longitude
  } = props;

  const dateTime = getFormattedDateTime({ date: activityDateTime || '', timeFormat: 'hh:mm a' });

  const getDateTime = (): JSX.Element =>
    dateTime ? (
      <>
        <span className={styles.on_label}>on</span>
        <span>{dateTime}</span>
      </>
    ) : (
      <></>
    );

  return (
    <div className={`${styles.metadata_info} metadata-info`}>
      <span className={styles.by_label}>{byLabel}</span>
      <UserName id={createdBy || ''} name={createdByName || ''} callerSource={callerSource} />
      {getDateTime()}
      {isTrackLocationEnabled ? (
        <span className={styles.tracklocation_wrapper}>
          <TrackLocation longitude={longitude || ''} latitude={latitude || ''} />
        </span>
      ) : null}
    </div>
  );
};

export default MetaDataInfo;
