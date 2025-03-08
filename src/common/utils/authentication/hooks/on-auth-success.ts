import { addPrimaryColorConfig, useTheme } from '@lsq/nextgen-preact/v2/stylesmanager';
import { useEffect, useState } from 'react';
import { IHeader, IHeaderItem } from 'apps/mip-menu/header.types';
import { getHeaderData } from 'common/component-lib/mip-header/utils';
import { getUserSelectedTheme } from '../../helpers/personalization';
import { getPersistedAuthConfig } from '../utils/authentication-utils';
import { isMiP, onThemeUpdateCallback } from '../../helpers/helpers';
import { trackError } from '../../experience';
import { IAuthenticationStatus } from '../authentication.types';

const onAuthenticationSuccess = async ({ setTheme, setHeader }): Promise<void> => {
  try {
    if (!isMiP()) {
      const [userSelectedTheme, header] = await Promise.all([
        getUserSelectedTheme(),
        getHeaderData()
      ]);
      setTheme(
        userSelectedTheme,
        addPrimaryColorConfig({ ...getPersistedAuthConfig()?.LaunchConfig }),
        onThemeUpdateCallback
      );
      setHeader(header);
    }
  } catch (error) {
    throw new Error('post login execution failed');
  }
};

type IPostLoginStatus = { loading: boolean; error: boolean };

function useOnAuthSuccess(authStatus: IAuthenticationStatus): {
  data: { header: IHeader[] };
  status: IPostLoginStatus;
} {
  const { setTheme } = useTheme();
  const [header, setHeader] = useState<IHeaderItem[]>([]);
  const [postLoginStatus, setPostLoginStatus] = useState<IPostLoginStatus>({
    loading: false,
    error: false
  });
  const isAuthSuccess = authStatus?.isSuccess;
  const isLoading = authStatus?.isLoading || postLoginStatus?.loading;

  useEffect(() => {
    async function onAuthSuccess(): Promise<void> {
      if (!isAuthSuccess) return;

      setPostLoginStatus({ loading: true, error: false });
      try {
        if (isAuthSuccess) {
          await onAuthenticationSuccess({ setTheme, setHeader });
          setPostLoginStatus({ loading: false, error: false });
        }
      } catch (err) {
        setPostLoginStatus({ loading: false, error: true });
        trackError(err);
      }
    }
    onAuthSuccess();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthSuccess]);

  return {
    data: { header },
    status: { loading: isLoading, error: postLoginStatus.error }
  };
}

export default useOnAuthSuccess;
