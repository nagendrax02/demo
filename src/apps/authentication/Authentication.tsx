import IFrame from 'common/component-lib/iframe';
import styles from './style.module.css';
import useMarvinAuthentication from './useMarvinAuthentication';
import Spinner from '@lsq/nextgen-preact/spinner';
import { useRef, useState } from 'react';
import { getAuthRenderUrl } from './utils';
import { IAuthenticationStatus } from 'common/utils/authentication/authentication.types';

const Authentication = ({
  setAuthStatus
}: {
  setAuthStatus: (data: IAuthenticationStatus) => void;
}): JSX.Element => {
  const iframeRef = useRef(null);
  const [isIFrameLoading, setIsIFrameLoading] = useState(true);
  const authUrl = useRef(getAuthRenderUrl());

  useMarvinAuthentication({
    setAuthStatus,
    iframeRef
  });

  return (
    <div className={styles.container}>
      {isIFrameLoading ? <Spinner customStyleClass={styles.spinner} /> : null}
      <IFrame
        customRef={iframeRef}
        id="sw-lite-authentication"
        src={authUrl.current}
        onLoad={() => {
          setIsIFrameLoading(false);
        }}
      />
    </div>
  );
};

export default Authentication;
