import { useEffect, useRef } from 'react';
import { getItem, removeItem, setItem, StorageKey } from 'common/utils/storage-manager';
import { useNotification } from '@lsq/nextgen-preact/notification';
import useHeaderStore from 'apps/header/header.store';
import { handleCheckoutAndLogout } from 'apps/mip-menu/components/checkin-checkout/utils';
import { getPersistedAuthConfig } from '../utils/authentication-utils';
import { isMiP } from '../../helpers';

const EVENTS = ['keypress', 'mousemove', 'scroll', 'touchstart'];
const INTERVAL_TIME = 10000;
const MILLISECONDS_PER_MINUTE = 60000;
const TIMEOUT_TIME = 3000;

const useIdleUser = (): void => {
  const { showAlert } = useNotification();
  const { Tenant } = getPersistedAuthConfig() || {};
  const idleUserTimeoutInMinutes = Number(Tenant?.IdleTimeout) || null;
  const timerId = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { checkInCheckOutEnabled, userCheckedIn } = useHeaderStore((state) => ({
    checkInCheckOutEnabled: state.checkInCheckOutEnabled,
    userCheckedIn: state.userCheckedIn
  }));

  const checkIsCheckInCheckoutEnabledAndIsUserCheckedIn = (): boolean => {
    return checkInCheckOutEnabled && userCheckedIn;
  };

  const checkForInactivity = (): void => {
    const expireTime = Number(getItem(StorageKey.IdleUserSessionExpireTime));

    if (expireTime && expireTime <= Date.now()) {
      removeItem(StorageKey.IdleUserSessionExpireTime);
      handleCheckoutAndLogout({
        checkout: checkIsCheckInCheckoutEnabledAndIsUserCheckedIn(),
        showAlert
      });
    }
  };

  const updateExpireTime = (): void => {
    const expireTime = Date.now() + Number(idleUserTimeoutInMinutes) * MILLISECONDS_PER_MINUTE;
    setItem(StorageKey.IdleUserSessionExpireTime, expireTime);
    EVENTS.forEach((eventName) => {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      document.addEventListener(eventName, resetTimer);
    });
  };

  function resetTimer(): void {
    if (timerId.current) {
      clearTimeout(timerId.current);
    }
    const expireTime = Date.now() + Number(idleUserTimeoutInMinutes) * MILLISECONDS_PER_MINUTE;
    setItem(StorageKey.IdleUserSessionExpireTime, expireTime);

    EVENTS.forEach((eventName) => {
      document.removeEventListener(eventName, resetTimer);
    });

    timerId.current = setTimeout(updateExpireTime, TIMEOUT_TIME);
  }

  useEffect(() => {
    let interval;
    if (idleUserTimeoutInMinutes && !isMiP()) {
      updateExpireTime();
      interval = setInterval(() => {
        checkForInactivity();
      }, INTERVAL_TIME);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
        EVENTS.forEach((eventName) => {
          document.removeEventListener(eventName, updateExpireTime);
        });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useIdleUser;
