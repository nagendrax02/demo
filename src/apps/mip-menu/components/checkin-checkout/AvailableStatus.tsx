/* eslint-disable complexity */
import { httpPost, CallerSource, Module } from 'common/utils/rest-client';
import styles from './checkin-checkout.module.css';
import { API_ROUTES } from 'common/constants';
import { useNotification } from '@lsq/nextgen-preact/notification';
import { Type } from '@lsq/nextgen-preact/notification/notification.types';
import { ERROR_MSG } from 'common/utils/rest-client/constant';
import Icon from '@lsq/nextgen-preact/icon';
import { updateStatus, useCICOStore } from './checkin-checkout.store';
import { IStatus } from './checkin-checkout.types';
import { getStatusList } from '../../utils';
import { isMiP } from 'common/utils/helpers';
import { StorageKey, getItem, setItem } from 'common/utils/storage-manager';
import { IHeaderInfo } from 'apps/header/header.types';
import { getHeaderInfo } from 'apps/header/components/profile/utils';

const AvailableStatus = ({ item }: { item?: IStatus }): JSX.Element => {
  const { showAlert } = useNotification();

  let { isCheckedIn, status } = useCICOStore((state) => ({
    isCheckedIn: state.isCheckedIn,
    status: state.status
  }));
  let option = item;
  if (!isMiP()) {
    const headerInfo = getItem(StorageKey.HeaderInfo) as IHeaderInfo;
    isCheckedIn = headerInfo?.IsCheckedIn || true;
    status = headerInfo?.Status?.Name || '';
    option = headerInfo?.Status;
  }
  if (!option) {
    option = getStatusList(isCheckedIn).find(
      (value) => value.Name.toLowerCase() === status.toLowerCase()
    );
  }
  const isSelected = status === item?.Name;
  const handleClick = async (): Promise<void> => {
    if (item) {
      try {
        await httpPost({
          path: API_ROUTES.availableStatusUpdate,
          module: Module.Marvin,
          body: { AvailabilityStatus: item.Name },
          callerSource: CallerSource.MiPNavMenu
        });
        updateStatus(item.Name);
        showAlert({
          type: Type.SUCCESS,
          message: 'Status Updated to ' + item.Name
        });

        if (!isMiP()) {
          const headerInfo = getHeaderInfo();
          const obj = {
            ...headerInfo,
            Status: item
          };
          setItem(StorageKey.HeaderInfo, obj);
        }
      } catch (err) {
        showAlert({ type: Type.ERROR, message: ERROR_MSG.generic });
      }
    }
  };

  return (
    <>
      {!item ? (
        <div className={styles.status_container}>
          <div className={styles.phone_numbers}>
            <div style={{ backgroundColor: option?.Color }} className={styles.status_color} />
            <div className={styles.value}>{option?.Name}</div>
          </div>
          <Icon name="chevron_right" customStyleClass={styles.submenu_icon} />
        </div>
      ) : (
        <div
          className={`${styles.status_container} ${styles.sub_menu} ${
            isSelected ? styles.selected : ''
          }`}
          onClick={handleClick}>
          <div className={styles.phone_numbers}>
            <div style={{ backgroundColor: item?.Color }} className={styles.status_color} />
            <span className={styles.value}>{item?.Name}</span>
          </div>
          {isSelected ? <Icon name="check" customStyleClass={styles.check_icon} /> : null}
        </div>
      )}
    </>
  );
};

AvailableStatus.defaultProps = { isSubMenu: undefined, item: undefined };

export default AvailableStatus;
