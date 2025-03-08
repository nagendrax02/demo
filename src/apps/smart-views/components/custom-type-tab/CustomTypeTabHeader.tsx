import Info from '../smartview-tab/components/header/info';
import { primaryHeaderStyles } from '../smartview-tab/components/header';
import styles from './custom-type-tab.module.css';
import { generateTabInfoDetails } from './utils';
import { ITabResponse } from 'apps/smart-views/smartviews.types';
import { classNames } from 'common/utils/helpers/helpers';

interface IHeader {
  tabData: ITabResponse;
  allTabIds: string[];
  tabId: string;
}

const CustomTypeTabHeader = (props: IHeader): JSX.Element => {
  const { tabData, allTabIds, tabId } = props;

  const { primaryHeaderConfig, tabSettings, tabType, entityCode } = generateTabInfoDetails(
    tabData,
    allTabIds
  );

  return (
    <div className={classNames(primaryHeaderStyles.primary_header, styles.container)}>
      <div className={classNames(primaryHeaderStyles.header_title, styles.title, 'ng_h_2_m')}>
        {tabData?.TabConfiguration.Title}
      </div>
      <Info
        primaryHeaderConfig={primaryHeaderConfig}
        tabSettings={tabSettings}
        tabType={tabType}
        entityCode={entityCode}
        tabId={tabId}
      />
    </div>
  );
};

export default CustomTypeTabHeader;
