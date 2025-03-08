import { trackError } from 'common/utils/experience/utils/track-error';
import Error from 'common/component-lib/error';
import Spinner from '@lsq/nextgen-preact/spinner';
import styles from './style.module.css';
import { useEffect } from 'react';
import { getMiPPreReqData } from 'common/utils/helpers/helpers';
import { AuthKey } from 'common/utils/authentication/authentication.types';
import { getContext } from 'common/utils/experience/utils/log-experience';

const AuthenticationError = (): JSX.Element => {
  useEffect(() => {
    (async (): Promise<void> => {
      try {
        import('common/utils/logger')
          .then((module) => {
            const mipRequestData = getMiPPreReqData();
            module.default.fatal({
              error: { cause: 'Authentication Failed' },
              message: 'Error: Authentication Failed',
              method: 'AuthenticationError Component',
              data: {
                data: {
                  userEmail: mipRequestData?.[AuthKey.UserEmail],
                  orgCode: mipRequestData?.[AuthKey.OrgCode],
                  orgName: mipRequestData?.[AuthKey.DisplayName],
                  embeddedContext: getContext(),
                  regionId: mipRequestData?.[AuthKey.RegionId],
                  sessionId: mipRequestData?.[AuthKey.SessionId],
                  userId: mipRequestData?.[AuthKey.UserId],
                  token: mipRequestData?.[AuthKey.Token],
                  refreshToken: mipRequestData?.[AuthKey.RefreshToken]
                }
              },
              module: 'Authentication'
            });
          })
          .catch((importError) => {
            trackError(importError);
          });
      } catch (error) {
        trackError(error);
      }
    })();
  }, []);

  return (
    <Error
      icon="report"
      title={'Authentication Failed'}
      description={'Please contact your administrator'}
      suspenseFallback={<Spinner customStyleClass={styles.layout_spinner_container} />}
      actionConfig={{
        title: 'Reload',
        handleClick: () => {
          self.location.reload();
        }
      }}
    />
  );
};

export default AuthenticationError;
