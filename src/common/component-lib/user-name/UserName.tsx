import { trackError } from 'common/utils/experience/utils/track-error';
import { useState, useEffect, useCallback, lazy } from 'react';
import Shimmer from '@lsq/nextgen-preact/shimmer';
import { getUserNames } from './utils';
import { IUserName } from './username.types';
import styles from './username.module.css';
import { Placement, Trigger } from '@lsq/nextgen-preact/tooltip/tooltip.types';
import { TOOLTIP_CHAR_LIMIT } from 'common/constants';
import { useActiveTab } from 'apps/smart-views/components/smartview-tab/smartview-tab.store';
import { isValidGuid } from 'common/utils/helpers';
import withSuspense from '@lsq/nextgen-preact/suspense';

const ToolTip = withSuspense(lazy(() => import('@lsq/nextgen-preact/tooltip')));

const UserName = (props: IUserName): JSX.Element => {
  const { id, name, callerSource } = props;
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState(name);

  const activeTab = useActiveTab();

  const fetchData = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      const fetchedUserNames = await getUserNames([id], callerSource);
      setUserName(fetchedUserNames[id]);
    } catch (error) {
      trackError(error);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    const promise = window[`USER_FIELDS_${activeTab}`] as
      | Promise<Record<string, string>>
      | undefined;

    if (promise && isValidGuid(id)) {
      setLoading(true);
      promise
        .then((data) => {
          setUserName(data?.[id]);
        })
        .finally(() => {
          setLoading(false);
          delete window[`USER_FIELDS_${activeTab}`];
        });
    } else if (!name && id) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [id, fetchData, name]);

  return (
    <>
      {loading ? (
        <Shimmer width="150px" height="24px" dataTestId="shimmer" />
      ) : (
        <div className={`${styles.user_name} user-name`} data-testid="user-name">
          {userName && userName?.length > TOOLTIP_CHAR_LIMIT ? (
            <ToolTip
              content={userName || ''}
              placement={Placement.Vertical}
              trigger={[Trigger.Hover]}>
              <>{userName}</>
            </ToolTip>
          ) : (
            userName
          )}
        </div>
      )}
    </>
  );
};

export default UserName;
