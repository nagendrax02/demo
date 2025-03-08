import useAppTabsStoreV2 from 'common/component-lib/app-tabs-v2/app-tabs.store';
import useAppTabsStoreV1 from 'common/component-lib/app-tabs/app-tabs.store';
import { isAppHeaderEnabled } from '../helpers/app-tabs';
import { setIsAppTabsEnabled as setIsAppTabsEnabledV2 } from 'src/common/component-lib/app-tabs-v2/app-tabs.store';
import { setIsAppTabsEnabled as setIsAppTabsEnabledV1 } from 'src/common/component-lib/app-tabs/app-tabs.store';

const useAppTabsEnabled = (): {
  isAppTabsEnabled: boolean;
  setIsAppTabsEnabled: (value: boolean) => void;
} => {
  const { isAppTabsEnabled: isV1AppTabsEnabled } = useAppTabsStoreV1();
  const { isAppTabsEnabled: isV2AppTabsEnabled } = useAppTabsStoreV2();
  const isAppTabsEnabled = isAppHeaderEnabled() ? isV2AppTabsEnabled : isV1AppTabsEnabled;
  const setIsAppTabsEnabled = isAppHeaderEnabled() ? setIsAppTabsEnabledV2 : setIsAppTabsEnabledV1;
  return {
    isAppTabsEnabled: isAppTabsEnabled,
    setIsAppTabsEnabled: setIsAppTabsEnabled
  };
};

export default useAppTabsEnabled;
