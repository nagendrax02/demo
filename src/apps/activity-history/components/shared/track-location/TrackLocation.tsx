import { trackError } from 'common/utils/experience/utils/track-error';
import { Placement, Trigger } from '@lsq/nextgen-preact/tooltip/tooltip.types';
import Icon from '@lsq/nextgen-preact/icon';
import { IconVariant } from '@lsq/nextgen-preact/icon/icon.types';
import { getEnvConfig } from 'common/utils/helpers';
import styles from './track-location.module.css';
import { ENV_CONFIG } from 'common/constants';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

export interface ITrackLocation {
  longitude: string;
  latitude: string;
}

const ToolTip = withSuspense(lazy(() => import('@lsq/nextgen-preact/tooltip')));

const TrackLocation = (props: ITrackLocation): JSX.Element | null => {
  const { longitude, latitude } = props;

  const getSrc = (): string => {
    try {
      return `https://www.google.com/maps/embed/v1/place?q=${latitude},${longitude}&key=${
        getEnvConfig(ENV_CONFIG.googleMapApiKey) as string
      }`;
    } catch (error) {
      trackError(error);
    }
    return '';
  };
  return (
    <ToolTip
      content={<iframe src={getSrc()} className={styles.iframe} />}
      placement={Placement.Vertical}
      trigger={[Trigger.Hover]}>
      <Icon name="place" variant={IconVariant.Outlined} customStyleClass={styles.place_icon} />
    </ToolTip>
  );
};
export default TrackLocation;
