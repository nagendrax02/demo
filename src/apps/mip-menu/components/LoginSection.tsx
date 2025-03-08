import { trackError } from 'common/utils/experience/utils/track-error';
import { IHeader } from '../header.types';
import styles from '../header.module.css';
import ActionMenu from '@lsq/nextgen-preact/action-menu';
import { getCICOConf, getProfileActions, getUserDetails } from '../utils';
import { menuDimension, profileIconsMap } from './constants';
import Icon from '@lsq/nextgen-preact/icon';
import { IconVariant } from '@lsq/nextgen-preact/icon/icon.types';
import { getProfileName } from 'common/utils/helpers/helpers';
import { initializeStore, useCICOStore } from './checkin-checkout/checkin-checkout.store';
import CheckInModal, { CheckOutModal } from './checkin-checkout';
import { useLeadRepName } from 'apps/entity-details/entitydetail.store';
import { useState } from 'react';

interface ILoginMenu {
  loginItems: IHeader[];
}

const LoginMenu = ({ loginItems }: ILoginMenu): JSX.Element => {
  const leadRepName = useLeadRepName();
  const { name } = getUserDetails();
  const cicoConf = getCICOConf();
  initializeStore();
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  const isCheckedIn = useCICOStore((state) => state.isCheckedIn);
  const availablePhone = useCICOStore((state) => state.availablePhone);
  const getCustomOption = (item: IHeader): JSX.Element => {
    return (
      <div className={styles.profile_items}>
        {profileIconsMap[item.Path] ? (
          <Icon
            name={profileIconsMap[item.Path].name as string}
            variant={profileIconsMap[item.Path].variant as IconVariant}
          />
        ) : null}
        <div>{item.Caption}</div>
      </div>
    );
  };

  const handleSignout = async (show: boolean): Promise<void> => {
    if (cicoConf.IsCheckInEnabled === 'True') {
      setShowCheckoutModal(show);
    } else {
      try {
        const module = await import('common/utils/authentication/utils/logout');
        module.logout();
      } catch (ex) {
        trackError('Error in signOut:', ex);
      }
    }
  };

  return (
    <div className={`${styles.profile_item_wrapper} ${styles.profile_image}`}>
      <ActionMenu
        menuKey={'postLoginConfig'}
        menuDimension={menuDimension}
        actions={[
          ...getProfileActions({
            loginItems,
            getCustomOption,
            isCheckedIn,
            availablePhone,
            leadRepName,
            showModal: handleSignout
          })
        ]}>
        <div className={`${styles.profile_icon}`} data-testid="profile-img">
          <span>{getProfileName(name)}</span>
        </div>
      </ActionMenu>
      {cicoConf.IsNewLogIn === 'True' && cicoConf.IsCheckedIn === 'False' ? <CheckInModal /> : null}
      {showCheckoutModal ? (
        <CheckOutModal
          close={() => {
            handleSignout(false);
          }}
        />
      ) : null}
    </div>
  );
};

export default LoginMenu;
