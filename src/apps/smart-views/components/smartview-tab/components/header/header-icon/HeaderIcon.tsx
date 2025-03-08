import { isSmartviewTab } from 'apps/smart-views/utils/utils';
import { getDuoToneIcon } from 'apps/smart-views/utils/tab-icon-mapper';
import { TabType } from 'apps/smart-views/constants/constants';
import styles from '../primary-header/primary-header.module.css';
import { TABS_CACHE_KEYS } from 'apps/smart-views/components/custom-tabs/constants';
import { getItem, StorageKey } from 'common/utils/storage-manager';
import { IActivityCategoryMetadata } from 'apps/activity-history/types';
import { ActivityTypeIcon } from 'common/component-lib/activity-type-icon/ActivityTypeIcon';
import { classNames } from 'common/utils/helpers/helpers';
import useSmartViewStore from 'apps/smart-views/smartviews-store';

interface IHeaderIcon {
  tabId: string;
  type: TabType;
  entityCode: string;
}

const HeaderIcon = (props: IHeaderIcon): JSX.Element => {
  const { tabId, type, entityCode } = props;

  const { rawTabData } = useSmartViewStore();
  const tabData = rawTabData?.[tabId];
  const primaryColor = tabData?.TabConfiguration?.PrimaryColor;

  const getTabIcon = (): JSX.Element | null => {
    if (isSmartviewTab(tabId))
      return getDuoToneIcon({
        tabType: type,
        duoToneColor: primaryColor,
        customStyle: styles.header_icon
      });
    else if (tabId === TABS_CACHE_KEYS.MANAGE_ACTIVITIES) {
      // this will handled the different icon we have in manage activity
      const categoryMetaDataItem =
        (getItem(StorageKey.ActivityCategoryMetadata) as Record<
          string,
          IActivityCategoryMetadata[]
        >) || {};

      // to do: caching is not handled properly for category metadata setCategoryMetadataCache
      const activity = Object.values(categoryMetaDataItem || {})?.map(
        (metaData) => metaData?.find?.((item) => item?.Value === entityCode)
      )?.[0];

      if (activity)
        return (
          <ActivityTypeIcon
            value={activity?.Value ?? ''}
            eventType={Number(activity?.EventType)}
            iconType={'filled'}
            eventDirection={activity?.EventDirection}
            customStyleClass={classNames(styles.activity_type_icon, styles.header_icon)}
          />
        );
      else {
        return getDuoToneIcon({
          tabType: TabType.Activity,
          duoToneColor: primaryColor,
          customStyle: styles.header_icon
        });
      }
    }
    return null;
  };

  return <>{getTabIcon()}</>;
};

export default HeaderIcon;
