/* eslint-disable complexity */
import { useEffect, useState } from 'react';
import Icon from 'apps/entity-details/components/vcard/icon';
import { IconContentType } from 'apps/entity-details/types/icon.types';
import styles from '../styles.module.css';
import ActionMenu from '@lsq/nextgen-preact/action-menu';
import useHeaderStore, { initializeStore } from '../../header.store';
import {
  getProfileActions,
  handleCheckIn,
  handleDataAfterInitialization,
  isUserCheckedIn
} from './utils';
import { menuDimensionForSWlite } from 'apps/mip-menu/components/constants';
import { IAuthenticationConfig } from 'common/types';
import { StorageKey, getItem } from 'common/utils/storage-manager';
import { getProfileName } from 'common/utils/helpers/helpers';
import { ICICOStatusConfig, IHeaderInfo } from '../../header.types';
import UserCheckInConfirmationPopup from './user-checkin';
import { useNotification } from '@lsq/nextgen-preact/notification';
import { safeParseJson } from '../../../../common/utils/helpers/helpers';
import userDataStore from '../../../../store/user-data';
import { STATUS_INFO } from './constants';
import { CheckOutModal } from 'apps/mip-menu/components/checkin-checkout';
import { getPersistedAuthConfig } from 'common/utils/authentication';
import { IHeader } from 'apps/mip-menu/header.types';
import { useLeadRepName } from 'apps/entity-details/entitydetail.store';

interface IProfile {
  loginItems?: IHeader[];
}

const Profile = ({ loginItems }: IProfile): JSX.Element => {
  const [showCheckInPopup, setShowCheckInPopup] = useState(false);
  const leadRepName = useLeadRepName();
  const userConfig = getPersistedAuthConfig()?.User;
  const { User, Tenant } = (getItem(StorageKey.Auth) as IAuthenticationConfig) || {};
  const { userCheckedIn, setUserCheckedIn, isLogoutTriggered, setIsLogoutTriggered } =
    useHeaderStore();
  const { showAlert } = useNotification();

  const profilePhoto =
    userDataStore((state) => state.profilePhoto) || userConfig?.ProfilePhoto || '';
  const userFullName = userDataStore((state) => state.userFullName) || userConfig?.FullName || '';
  const associatedPhoneNumbers =
    userDataStore((state) => state.associatedPhoneNumbers) ||
    userConfig?.AssociatedPhoneNumbers ||
    '';

  const CICOConfig = useHeaderStore((state) => state.CICOStatusConfig);
  const checkInCheckOutEnabled = useHeaderStore((state) => state.checkInCheckOutEnabled);

  useEffect(() => {
    try {
      initializeStore();

      const initialRender = async (): Promise<void> => {
        const isFirstLoad = (getItem(StorageKey.HeaderInfo) as IHeaderInfo)?.FirstLoad;

        const isCICOEnabled = User?.IsCheckInCheckOutEnabled;

        const CICOStatusConfig =
          (safeParseJson(Tenant?.CICOStatusConfiguration || '') as ICICOStatusConfig) ||
          STATUS_INFO;

        const availabilityStatus = User?.AvailabilityStatus;

        if (!isFirstLoad && isCICOEnabled) {
          handleDataAfterInitialization({
            user: User,
            cicoStatusConfig: CICOStatusConfig,
            availabilityStatus: availabilityStatus,
            setUserCheckedIn: setUserCheckedIn,
            setShowCheckInPopup: setShowCheckInPopup,
            mandateWebUserCheckIn: userConfig?.MandateWebUserCheckIn,
            showAlert: showAlert
          });
        } else {
          if (isUserCheckedIn()) {
            setUserCheckedIn(true);
          } else {
            setUserCheckedIn(false);
          }
        }
      };
      initialRender();
    } catch (error) {
      console.log(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUserCheckIn = async (): Promise<void> => {
    await handleCheckIn({
      showAlert: showAlert,
      cicoConfig: CICOConfig,
      setUserCheckedIn: setUserCheckedIn
    });

    setShowCheckInPopup(false);
  };

  return (
    <>
      {showCheckInPopup ? (
        <UserCheckInConfirmationPopup
          setShowCheckInPopup={setShowCheckInPopup}
          userFullName={userFullName || ''}
          handleUserCheckIn={handleUserCheckIn}
          showCheckInPopup={showCheckInPopup}
        />
      ) : null}

      <div className={styles.profile_container}>
        <ActionMenu
          actions={getProfileActions({
            loginItems,
            checkInCheckOutEnabled,
            cicoStatusConfig: CICOConfig,
            availablePhone: associatedPhoneNumbers,
            isCheckedIn: userCheckedIn,
            leadRepName,
            setIsLogoutTriggered
          })}
          menuKey="postLoginConfig-profile"
          menuDimension={menuDimensionForSWlite}>
          <div>
            <Icon
              config={
                profilePhoto
                  ? {
                      content: profilePhoto,
                      contentType: IconContentType.Image,
                      customStyleClass: styles.profile_image_icon
                    }
                  : {
                      content: getProfileName(userFullName || 'Lead'),
                      contentType: IconContentType.Text
                    }
              }
              customStyleClass={styles.profile_icon}
              isLoading={false}
            />
          </div>
        </ActionMenu>
      </div>

      {isLogoutTriggered ? (
        <CheckOutModal
          close={() => {
            setIsLogoutTriggered(false);
          }}
        />
      ) : null}
    </>
  );
};

Profile.defaultProps = {
  loginItems: []
};

export default Profile;
