import { httpPost, CallerSource, Module } from 'common/utils/rest-client';
import styles from './checkin-checkout.module.css';
import { API_ROUTES } from 'common/constants';
import { useNotification } from '@lsq/nextgen-preact/notification';
import { Type } from '@lsq/nextgen-preact/notification/notification.types';
import { ERROR_MSG } from 'common/utils/rest-client/constant';
import { IMenuItem } from 'common/component-lib/action-wrapper/action-wrapper.types';
import Icon from '@lsq/nextgen-preact/icon';
import { updatePhone } from './checkin-checkout.store';
import { isMiP } from 'common/utils/helpers';

const AvailablePhones = ({
  item,
  allNumbers
}: {
  item: IMenuItem;
  allNumbers?: string;
}): JSX.Element => {
  const { showAlert } = useNotification();
  const isSelected = allNumbers?.split(',')?.[0] === item?.value;

  const handleClick = async (): Promise<void> => {
    if (allNumbers) {
      const numbersArr = allNumbers.includes(', ') ? allNumbers.split(', ') : allNumbers.split(',');
      const itemIndex = numbersArr.findIndex((val) => val?.trim() === item?.value?.trim());
      numbersArr.splice(itemIndex, 1);
      numbersArr.unshift(item.value);

      try {
        const updatedNumber = numbersArr.join(', ')?.trim();
        await httpPost({
          path: API_ROUTES.availablePhoneUpdate,
          module: Module.Marvin,
          body: { AssociatedPhoneNumbers: `${updatedNumber}` },
          callerSource: CallerSource.MiPNavMenu
        });
        updatePhone(updatedNumber);
        if (!isMiP()) {
          //updating Header store if it is not MIP
          (await import('../../../../store/user-data/user-data')).setUserAssociatedPhoneNumbers(
            updatedNumber
          );
        }
        showAlert({
          type: Type.SUCCESS,
          message: 'Available Phone Number updated to ' + item.value
        });
      } catch (err) {
        showAlert({ type: Type.ERROR, message: ERROR_MSG.generic });
      }
    }
  };

  return (
    <div
      className={`${styles.checkout_container} ${allNumbers ? styles.sub_menu : ''} ${
        isSelected ? styles.selected : ''
      }`}
      onClick={handleClick}>
      <div className={styles.phone_numbers}>
        <span className={styles.label}>Available On: </span>
        <span className={styles.value}>{item.label}</span>
        {isSelected ? <Icon name="check" customStyleClass={styles.check_icon} /> : null}
        {!allNumbers ? <Icon name="chevron_right" customStyleClass={styles.submenu_icon} /> : null}
      </div>
    </div>
  );
};

AvailablePhones.defaultProps = { allNumbers: undefined };

export default AvailablePhones;
