import IFrame from 'src/common/component-lib/iframe';
import { ENV_CONFIG } from 'src/common/constants';
import { getEnvConfig } from 'src/common/utils/helpers';
import useMarvinComponent from 'common/utils/marvin-helper';
import { useRef, useState } from 'react';
import { DASHBOARD } from '../constant';
import { onMessageReceive } from '../utils';
import styles from '../dashboard.module.css';

const DefaultDashboard = (): JSX.Element => {
  const ref = useRef<HTMLIFrameElement | null>(null);
  const [isIFrameLoading, setIsIFrameLoading] = useState(true);

  useMarvinComponent({
    iframeRef: ref,
    initDataToSend: {
      route: '/',
      payload: {}
    },
    onMessageReceive: onMessageReceive,
    feature: DASHBOARD
  });

  return (
    <IFrame
      customRef={ref}
      id="sw-lite-dashboard"
      src={`${
        getEnvConfig(ENV_CONFIG.dashboardRenderUrl) as string
      }/?isSWLite=true&feature=${DASHBOARD}`}
      setShowSpinner={setIsIFrameLoading}
      showSpinner={isIFrameLoading}
      customStyleClass={styles.iframe}
    />
  );
};

export default DefaultDashboard;
