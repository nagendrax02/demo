import { useMemo, useRef, useState } from 'react';
import IFrame from 'common/component-lib/iframe';
import { ENV_CONFIG } from 'common/constants';
import { getApiUrl } from 'common/utils/helpers';
import useMarvinComponent from 'common/utils/marvin-helper';
import styles from './settings.module.css';
import { SETTINGS } from './constant';
import { onMessageReceive } from './utils';
import { useTheme } from '@lsq/nextgen-preact/v2/stylesmanager';

const Settings = (): JSX.Element => {
  const ref = useRef<HTMLIFrameElement | null>(null);
  const [isIFrameLoading, setIsIFrameLoading] = useState(true);
  const { setTheme } = useTheme();

  useMarvinComponent({
    iframeRef: ref,
    initDataToSend: {
      route: '/Settings',
      payload: {}
    },
    onMessageReceive: (data: { type: string; message: Record<string, unknown> }) => {
      onMessageReceive({ data, setTheme });
    },
    feature: SETTINGS,
    appModule: 'USER_SETTINGS'
  });

  return useMemo(
    () => (
      <div className={styles.container}>
        <IFrame
          customStyleClass={styles.iframe}
          customRef={ref}
          id="sw-lite-settings"
          src={`${getApiUrl(ENV_CONFIG.marvinAppDomain)}/?isSWLite=true&feature=${SETTINGS}`}
          showSpinner={isIFrameLoading}
          setShowSpinner={setIsIFrameLoading}
        />
      </div>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isIFrameLoading, setIsIFrameLoading]
  );
};

export default Settings;
