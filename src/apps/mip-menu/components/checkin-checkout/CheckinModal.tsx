import Modal from '@lsq/nextgen-preact/modal';
import { httpPost, CallerSource, Module } from 'common/utils/rest-client';
import styles from './checkin-checkout.module.css';
import { API_ROUTES, APP_SOURCE } from 'common/constants';
import { useNotification } from '@lsq/nextgen-preact/notification';
import { Type } from '@lsq/nextgen-preact/notification/notification.types';
import { ERROR_MSG } from 'common/utils/rest-client/constant';
import { CICOSuccessMsg } from '../constants';
import { updateCheckinDate, updateCheckInStatus } from './checkin-checkout.store';
import { Variant } from 'common/types';
import { getProfileName } from 'common/utils/helpers/helpers';
import { getCICOConf, getUserDetails } from '../../utils';
import { useEffect, useState, lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const Button = withSuspense(lazy(() => import('@lsq/nextgen-preact/button')));

const CheckInModal = (): JSX.Element => {
  const [show, setShow] = useState(false);
  const { showAlert } = useNotification();
  const userInfo = getUserDetails();
  const { MandateWebUserCheckIn = 'False' } = getCICOConf();

  const handleClick = async (): Promise<void> => {
    try {
      await httpPost({
        path: API_ROUTES.userCheckin,
        module: Module.Marvin,
        body: { Source: APP_SOURCE },
        callerSource: CallerSource.MiPNavMenu
      });
      updateCheckinDate();
      updateCheckInStatus(true);
      showAlert({
        type: Type.SUCCESS,
        message: CICOSuccessMsg.CheckedOut
      });
    } catch (err) {
      showAlert({ type: Type.ERROR, message: ERROR_MSG.generic });
    }
  };

  useEffect(() => {
    if (MandateWebUserCheckIn === 'True') {
      handleClick();
    } else {
      setShow(true);
    }
  }, []);

  return (
    <>
      {show ? (
        <Modal show={show} customStyleClass={styles.checkin_modal}>
          <Modal.Header
            title={''}
            customStyleClass={styles.checkin_modal_header}
            onClose={() => {
              setShow(false);
            }}
          />
          <Modal.Body customStyleClass={styles.modal_body}>
            <>
              <div className={`${styles.profile_icon}`} data-testid="profile-img">
                <span>{getProfileName(userInfo.name)}</span>
              </div>
              <div className={styles.profile_name}>Welcome, {userInfo.name}</div>
              <div className={styles.description}>Please Check-In to record your attendance</div>
            </>
          </Modal.Body>
          <Modal.Footer customStyleClass={styles.modal_footer}>
            <Button
              variant={Variant.Primary}
              customStyleClass={styles.checkin_btn}
              onClick={handleClick}
              text={'Check-In'}
            />
          </Modal.Footer>
        </Modal>
      ) : null}
    </>
  );
};

export default CheckInModal;
