import { trackError } from 'common/utils/experience/utils/track-error';
import { IMenuItem } from 'common/component-lib/action-wrapper/action-wrapper.types';
import { ICICOStatusConfig, ICheckInResponse, IHeaderInfo } from '../../header.types';
import { augmentMenuItem, checkoutOption, getAssociatedPN } from 'apps/mip-menu/utils';
import { IStatus } from 'apps/mip-menu/components/checkin-checkout/checkin-checkout.types';
import AvailableStatus from '../../../mip-menu/components/checkin-checkout/AvailableStatus';
import AvailablePhones from 'apps/mip-menu/components/checkin-checkout/AssociatedPhones';
import { StorageKey, getItem, setItem } from 'common/utils/storage-manager';
import { CallerSource, Module, httpGet, httpPost } from 'common/utils/rest-client';
import { API_ROUTES, APP_SOURCE } from 'common/constants';
import { INotification, Type } from '@lsq/nextgen-preact/notification/notification.types';
import { getFormattedDateTime } from 'common/utils/date';
import { IUser } from 'common/types/authentication.types';
import { IHeader } from 'apps/mip-menu/header.types';
import CustomOption from './CustomOption';
import { IEntityRepresentationName } from 'apps/entity-details/types/entity-data.types';
import { profileOption } from './profile-option';

export const getStatusList = (
  isCheckedIn: boolean,
  cicoStatusConfig: ICICOStatusConfig
): IStatus[] => {
  if (cicoStatusConfig) {
    return isCheckedIn
      ? cicoStatusConfig?.CheckedInStatusList
      : cicoStatusConfig?.CheckedOutStatusList;
  }
  return [];
};

const getStatusMenuOptions = (statusList: IStatus[]): IMenuItem[] => {
  return statusList.map((item) => ({
    label: item?.Name,
    value: item?.Color,
    customComponent: <AvailableStatus item={item} />
  }));
};

export const handleSignOut = async ({
  show,
  checkInCheckOutEnabled,
  setIsLogoutTriggered
}: {
  show?: boolean;
  checkInCheckOutEnabled?: boolean;
  setIsLogoutTriggered?: (isTriggered: boolean) => void;
}): Promise<void> => {
  if (checkInCheckOutEnabled) {
    setIsLogoutTriggered?.(show ?? false);
  } else {
    try {
      const module = await import('common/utils/authentication/utils/logout');
      module.logout();
    } catch (ex) {
      trackError('Error in signOut:', ex);
    }
  }
};

export const getProfileActions = ({
  checkInCheckOutEnabled,
  cicoStatusConfig,
  availablePhone,
  isCheckedIn,
  loginItems,
  leadRepName,
  setIsLogoutTriggered
}: {
  checkInCheckOutEnabled: boolean;
  cicoStatusConfig: ICICOStatusConfig;
  availablePhone: string;
  isCheckedIn: boolean;
  loginItems: IHeader[] | undefined;
  leadRepName: IEntityRepresentationName;
  setIsLogoutTriggered: (isTriggered: boolean) => void;
}): IMenuItem[] => {
  const actions = [
    ...augmentMenuItem({
      items: loginItems ?? [],
      leadRepName: leadRepName,
      getCustomOption: CustomOption,
      showModal: async (show: boolean): Promise<void> => {
        await handleSignOut({ show, checkInCheckOutEnabled, setIsLogoutTriggered });
      }
    })
  ];

  if (checkInCheckOutEnabled) {
    actions.unshift(checkoutOption);

    if (availablePhone && availablePhone?.split(',')?.length) {
      const availablePhones: IMenuItem = {
        ...getAssociatedPN(availablePhone)[0],
        customComponent: <AvailablePhones item={getAssociatedPN(availablePhone)[0]} />,
        subMenu: getAssociatedPN(availablePhone)
      };
      actions.unshift(availablePhones);
    }

    const statusList = getStatusList(isCheckedIn, cicoStatusConfig);
    const availableStatus: IMenuItem = {
      ...getStatusMenuOptions(statusList)[0],
      customComponent: <AvailableStatus />,
      subMenu: getStatusMenuOptions(statusList)
    };
    actions.unshift(availableStatus);
  }
  actions.unshift(profileOption);
  return actions;
};

export const greetingHandler = (): string => {
  const hours = new Date().getHours();
  const isMorning = hours < 12;
  const greeting = isMorning ? 'Good Morning' : 'Good Afternoon';

  if (hours >= 17 || (isMorning && hours < 2)) {
    return 'Good Evening';
  }

  return greeting;
};

export const getHeaderInfo = (): IHeaderInfo => {
  return getItem(StorageKey.HeaderInfo) || {};
};

export const isUserCheckedIn = (): boolean => {
  const headerInfo = getHeaderInfo();

  return (
    (headerInfo && headerInfo?.IsCheckedIn !== undefined ? headerInfo?.IsCheckedIn : true) || false
  );
};

export const persistUserData = (data: IHeaderInfo): void => {
  setItem(StorageKey.HeaderInfo, data);
};

export const handleCheckIn = async ({
  showAlert,
  cicoConfig,
  setUserCheckedIn
}: {
  showAlert: (notification: INotification) => void;
  cicoConfig: ICICOStatusConfig;
  setUserCheckedIn: (userCheckedIn: boolean) => void;
}): Promise<void> => {
  try {
    const body = { Source: APP_SOURCE };

    await httpPost({
      path: API_ROUTES.userCheckin,
      module: Module.Marvin,
      body: body,
      callerSource: CallerSource.SmartViews
    });

    showAlert({
      type: Type.SUCCESS,
      message: `Checked-In successfully and your status is set to ${cicoConfig.CheckedInStatusList[0].Name}`
    });

    const dateTime = getFormattedDateTime({ date: new Date().toISOString() });
    const obj: IHeaderInfo = {
      FirstLoad: true,
      IsCheckedIn: true,
      Status: cicoConfig?.CheckedInStatusList?.[0],
      CheckedInTime: dateTime?.toString(),
      CheckOutTime: getHeaderInfo()?.CheckOutTime as string
    };

    setItem(StorageKey.HeaderInfo, obj);
    setUserCheckedIn(true);
  } catch (error) {
    console.log(error);
  }
};

export const handleDataAfterInitialization = async ({
  user,
  cicoStatusConfig,
  availabilityStatus,
  setUserCheckedIn,
  setShowCheckInPopup,
  mandateWebUserCheckIn,
  showAlert
}: {
  user: IUser;
  cicoStatusConfig: ICICOStatusConfig;
  availabilityStatus: string | undefined;
  setUserCheckedIn: (userCheckedIn: boolean) => void;
  setShowCheckInPopup: React.Dispatch<React.SetStateAction<boolean>>;
  mandateWebUserCheckIn?: boolean;
  showAlert: (notification: INotification) => void;
}): Promise<void> => {
  try {
    const userId = user?.Id;
    const path = `${API_ROUTES.UserCheckInStatus}?userId=${userId}`;

    const response = (await httpGet({
      path: path,
      module: Module.Marvin,
      callerSource: CallerSource.SmartViews
    })) as ICheckInResponse;

    const checkInDateTime =
      response?.LastCheckedOn && getFormattedDateTime({ date: response?.LastCheckedOn });

    if (!response?.IsCheckedIn) {
      const colorResult = cicoStatusConfig?.CheckedOutStatusList?.filter((item) => {
        return item.Name?.toUpperCase() === availabilityStatus?.toUpperCase();
      });

      persistUserData({
        FirstLoad: true,
        IsCheckedIn: mandateWebUserCheckIn || false,
        Status: colorResult?.[0],
        CheckOutTime: checkInDateTime?.toString(),
        CheckedInTime: getHeaderInfo()?.CheckedInTime as string
      });
      setUserCheckedIn(mandateWebUserCheckIn || false);
      if (mandateWebUserCheckIn)
        await handleCheckIn({
          showAlert,
          cicoConfig: cicoStatusConfig,
          setUserCheckedIn
        });
      else setShowCheckInPopup(true);
    } else {
      const colorResult = cicoStatusConfig?.CheckedInStatusList?.filter((item) => {
        return item.Name?.toUpperCase() === availabilityStatus?.toUpperCase();
      });

      persistUserData({
        FirstLoad: true,
        IsCheckedIn: true,
        Status: colorResult?.[0],
        CheckedInTime: checkInDateTime?.toString(),
        CheckOutTime: getHeaderInfo()?.CheckOutTime as string
      });
      setUserCheckedIn(true);
    }
  } catch (error) {
    trackError(error);
  }
};
