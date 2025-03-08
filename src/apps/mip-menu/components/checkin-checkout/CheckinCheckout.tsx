/* eslint-disable complexity */
import { httpPost, CallerSource, Module } from 'common/utils/rest-client';
import styles from './checkin-checkout.module.css';
import { API_ROUTES, APP_SOURCE } from 'common/constants';
import { useNotification } from '@lsq/nextgen-preact/notification';
import { Type } from '@lsq/nextgen-preact/notification/notification.types';
import { ERROR_MSG } from 'common/utils/rest-client/constant';
import { CICOSuccessMsg } from '../constants';
import { updateCheckinDate, updateCheckInStatus, useCICOStore } from './checkin-checkout.store';
import { isMiP } from 'common/utils/helpers';
import { IHeaderInfo } from 'apps/header/header.types';
import { StorageKey, getItem, setItem } from 'common/utils/storage-manager';
import { getHeaderInfo } from 'apps/header/components/profile/utils';
import { getFormattedDateTime } from 'common/utils/date';
import useHeaderStore from 'apps/header/header.store';
import { getSelectedStatus } from '../../utils';
import { useState, lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const Button = withSuspense(lazy(() => import('@lsq/nextgen-preact/button')));

const CheckinCheckout = (): JSX.Element => {
  const [loading, setLoading] = useState(false);
  const { showAlert } = useNotification();

  const { setUserCheckedIn } = useHeaderStore();

  let { isCheckedIn, checkedInDate } = useCICOStore((state) => ({
    isCheckedIn: state.isCheckedIn,
    checkedInDate: state.checkedInDate
  }));

  if (!isMiP()) {
    const headerInfo = getItem(StorageKey.HeaderInfo) as IHeaderInfo;
    isCheckedIn = headerInfo?.IsCheckedIn !== undefined ? headerInfo?.IsCheckedIn : true;
    checkedInDate = headerInfo?.IsCheckedIn
      ? headerInfo?.CheckedInTime || ''
      : headerInfo?.CheckOutTime || '';
  }

  const handleClick = async (): Promise<void> => {
    setLoading(true);
    const apiRoute = isCheckedIn ? API_ROUTES.userCheckout : API_ROUTES.userCheckin;
    const actionType = isCheckedIn ? 'CheckedIn' : 'CheckedOut';
    const dateNow = new Date().toISOString();
    const headerInfo = !isMiP() ? getHeaderInfo() : null;

    try {
      await httpPost({
        path: apiRoute,
        module: Module.Marvin,
        body: { Source: APP_SOURCE },
        callerSource: CallerSource.MiPNavMenu
      });
      updateCheckinDate();
      updateCheckInStatus(!isCheckedIn);

      // Update local storage and state if not MiP
      if (!isMiP()) {
        const updatedHeaderInfo = {
          ...headerInfo,
          IsCheckedIn: !isCheckedIn,
          Status: getSelectedStatus(!isCheckedIn)
        };
        if (isCheckedIn) {
          updatedHeaderInfo.CheckOutTime = getFormattedDateTime({ date: dateNow });
        } else {
          updatedHeaderInfo.CheckedInTime = getFormattedDateTime({ date: dateNow });
        }
        setItem(StorageKey.HeaderInfo, updatedHeaderInfo);
        setUserCheckedIn(!isCheckedIn);
      }

      showAlert({
        type: Type.SUCCESS,
        message: CICOSuccessMsg[actionType]
      });
    } catch (err) {
      showAlert({
        type: Type.ERROR,
        message: ERROR_MSG.generic
      });
    }
    setLoading(false);
  };

  return (
    <div className={styles.checkout_container}>
      <div>
        <span className={styles.label}>Checked-{isCheckedIn ? 'In' : 'Out'}: </span>
        <span className={styles.value}>{checkedInDate}</span>
      </div>
      <div>
        <Button
          customStyleClass={styles.checkout_btn}
          onClick={handleClick}
          text={isCheckedIn ? 'Check Out' : 'Check In'}
          isLoading={loading}
          disabled={loading}
        />
      </div>
    </div>
  );
};

export default CheckinCheckout;
