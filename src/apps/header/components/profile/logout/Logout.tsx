import styles from '../../styles.module.css';
import { handleSignOut } from '../utils';
import { StorageKey, getItem } from 'common/utils/storage-manager';
import { IHeaderInfo } from 'apps/header/header.types';
import useHeaderStore from 'apps/header/header.store';

const Logout = (): JSX.Element => {
  const headerInfo = getItem(StorageKey.HeaderInfo) as IHeaderInfo;
  const { setIsLogoutTriggered } = useHeaderStore();

  const buttonClicked = (): void => {
    if (headerInfo?.IsCheckedIn) {
      setIsLogoutTriggered(true);
    } else {
      handleSignOut({});
    }
  };

  return (
    <>
      <div onClick={buttonClicked} className={styles.fixed_action_container}>
        Sign Out
      </div>
    </>
  );
};

export default Logout;
