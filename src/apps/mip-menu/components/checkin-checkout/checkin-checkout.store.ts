import { create } from 'zustand';
import { getCICOConf, getStatusList } from '../../utils';
import { getFormattedDateTime } from 'common/utils/date';
import { formatDateTime, getMiPPreReqData } from 'common/utils/helpers/helpers';
import { AuthKey } from 'common/utils/authentication/authentication.types';
import { StorageKey, getItem, setItem } from 'common/utils/storage-manager';

interface ICICOStore {
  storeInitialized: boolean;
  status: string;
  isCheckedIn: boolean;
  checkedInDate: string;
  availablePhone: string;
}

export const useCICOStore = create<ICICOStore>(() => {
  return {
    status: '',
    availablePhone: '',
    isCheckedIn: false,
    checkedInDate: '',
    storeInitialized: false
  };
});

export const initializeStore = (): void => {
  const mipData = getMiPPreReqData();
  const { LastCheckedOnUTC = '', IsCheckedIn = 'False', AvailabilityStatus = '' } = getCICOConf();
  let phoneNumbers = getItem(StorageKey.AssociatedPhones) as string;
  if (!phoneNumbers) {
    phoneNumbers = (mipData?.[AuthKey.AssociatedPhoneNumbers] || '') as string;
    setItem(StorageKey.AssociatedPhones, phoneNumbers);
  }
  useCICOStore.setState((state) => {
    if (!state.storeInitialized) {
      return {
        availablePhone: phoneNumbers,
        storeInitialized: true,
        status: AvailabilityStatus,
        isCheckedIn: IsCheckedIn === 'True',
        checkedInDate: getFormattedDateTime({ date: LastCheckedOnUTC, timeFormat: 'hh:mm a' })
      };
    }
    return state;
  });
};

export const updateCheckInStatus = (checkinStatus: boolean): void => {
  const status = getStatusList(checkinStatus)[0]?.Name;
  useCICOStore.setState({ isCheckedIn: checkinStatus, status });
};

export const updateCheckinDate = (): void => {
  useCICOStore.setState({
    checkedInDate: getFormattedDateTime({ date: formatDateTime(new Date()), timeFormat: 'hh:mm a' })
  });
};

export const updatePhone = (availablePhone: string): void => {
  useCICOStore.setState({ availablePhone });
  setItem(StorageKey.AssociatedPhones, availablePhone);
};

export const updateStatus = (status: string): void => {
  useCICOStore.setState({ status });
};
