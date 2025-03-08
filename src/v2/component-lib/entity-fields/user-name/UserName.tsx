import { trackError } from 'common/utils/experience/utils/track-error';
import { useState, useEffect, useCallback } from 'react';
import Shimmer from '@lsq/nextgen-preact/shimmer';
import { getUserNames } from './utils';
import { IUserName } from './username.types';
import styles from './username.module.css';
import { useActiveTab } from 'apps/smart-views/components/smartview-tab/smartview-tab.store';
import { isValidGuid } from 'common/utils/helpers';
import commonStyle from '../common-style.module.css';

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
          <div className={commonStyle.ellipsis} title={userName}>
            {userName}
          </div>
        </div>
      )}
    </>
  );
};

export default UserName;
