import withSuspense from '@lsq/nextgen-preact/suspense';
import { trackError } from 'common/utils/experience/utils/track-error';
import React, { useState, lazy } from 'react';
import Icon from 'apps/entity-details/components/vcard/icon';
import { getProfileName } from 'common/utils/helpers/helpers';
import { IconContentType } from 'apps/entity-details/types/icon.types';
import styles from '../../styles.module.css';
import { greetingHandler } from '../utils';
import { Variant } from 'common/types';
import userDataStore from '../../../../../store/user-data';

const ConfirmationModal = withSuspense(
  lazy(() => import('@lsq/nextgen-preact/modal/confirmation-modal'))
);

export interface IUserCheckInConfirmationPopup {
  setShowCheckInPopup: React.Dispatch<React.SetStateAction<boolean>>;
  userFullName: string;
  handleUserCheckIn: () => Promise<void>;
  showCheckInPopup: boolean;
}

const UserCheckInConfirmationPopup = (props: IUserCheckInConfirmationPopup): JSX.Element => {
  const { setShowCheckInPopup, userFullName, handleUserCheckIn, showCheckInPopup } = props;

  const { profilePhoto } = userDataStore();

  const [isLoading, setIsLoading] = useState(false);

  const handleCheckIn = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await handleUserCheckIn();
    } catch (error) {
      trackError(error);
    }
    setIsLoading(false);
  };

  return (
    <ConfirmationModal
      onClose={() => {
        setShowCheckInPopup(false);
      }}
      title=""
      description={
        <>
          <Icon
            config={
              profilePhoto
                ? {
                    content: profilePhoto,
                    contentType: IconContentType.Image
                  }
                : {
                    content: getProfileName(userFullName || 'Lead'),
                    contentType: IconContentType.Text
                  }
            }
            customStyleClass={styles.profile_icon_popup}
            isLoading={false}
          />
          <div className={styles.user_info}>{`${greetingHandler()} ${userFullName}`}</div>
          <div className={styles.welcome_text}>Please Check-In to record your attendance</div>
        </>
      }
      buttonConfig={[
        {
          id: 2,
          name: <span className={styles.button_text}>Check-In</span>,
          variant: Variant.Primary,
          onClick: handleCheckIn,
          showSpinnerOnClick: isLoading,
          customStyleClass: styles.check_in_button,
          isLoading: isLoading,
          isDisabled: isLoading
        }
      ]}
      show={showCheckInPopup}
      customStyleClass={styles.popup_container}
    />
  );
};

export default UserCheckInConfirmationPopup;
