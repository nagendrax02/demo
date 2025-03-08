import { Variant } from '@lsq/nextgen-preact/button/button.types';
import { Button } from '@lsq/nextgen-preact/v2/button';
import { BackAndForward } from 'assets/custom-icon/v2';
import { useLocation } from 'wouter';
import styles from './list-details-info.module.css';
import { APP_ROUTE } from 'common/constants';
import { getLDTypeConfigFromRawData } from 'apps/smart-views/augment-tab-data/common-utilities/utils';
import { TABS_CACHE_KEYS } from '../../constants';

const BackButton = (): JSX.Element => {
  const [, setLocation] = useLocation();

  const onClick = async (): Promise<void> => {
    const leadTypeConfig = await getLDTypeConfigFromRawData(TABS_CACHE_KEYS.LIST_LEAD_CACHE_KEY);

    if (leadTypeConfig && leadTypeConfig?.[0]?.LeadTypeInternalName) {
      setLocation(
        `${APP_ROUTE.platformManageLists}?leadType=${leadTypeConfig?.[0]?.LeadTypeInternalName}`
      );
    } else {
      setLocation(APP_ROUTE.platformManageLists);
    }
  };

  return (
    <Button
      text={<BackAndForward type="outline" className={styles.back_btn_icon} />}
      onClick={onClick}
      variant={Variant.Secondary}
      customStyleClass={styles.back_btn}
    />
  );
};

export default BackButton;
