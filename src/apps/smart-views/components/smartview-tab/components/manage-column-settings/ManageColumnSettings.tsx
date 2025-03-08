import { HeaderAction } from 'apps/smart-views/constants/constants';
import TabSettings from '../tab-settings';
import { IGetIsFeatureRestriction } from 'apps/smart-views/smartviews.types';

interface IManageColumnSettings {
  activeTabId: string;
  show: boolean;
  setShow: (show: boolean) => void;
  featureRestriction?: IGetIsFeatureRestriction | null;
}

const ManageColumnSettings = (props: IManageColumnSettings): JSX.Element | null => {
  const { setShow, show, activeTabId, featureRestriction } = props;
  if (show) {
    return (
      <TabSettings
        selectedAction={{
          label: HeaderAction.SelectColumns,
          value: HeaderAction.SelectColumns
        }}
        tabId={activeTabId}
        show={show}
        setShow={setShow}
        featureRestrictionData={featureRestriction || undefined}
      />
    );
  }
  return null;
};

ManageColumnSettings.defaultProps = {
  featureRestriction: undefined
};

export default ManageColumnSettings;
