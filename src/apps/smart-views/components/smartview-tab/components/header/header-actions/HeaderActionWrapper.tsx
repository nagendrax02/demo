import { ActionWrapper } from 'v2/action-wrapper';
import { IMenuItem } from 'common/component-lib/action-wrapper/action-wrapper.types';
import { IProcessMenuItem } from 'common/utils/process/process.types';

import { IHeaderAction } from 'apps/smart-views/components/smartview-tab/smartview-tab.types';
import { CallerSource } from 'common/utils/rest-client';
import { HEADER_ACTION_ID } from './constant';
import FeatureRestriction from 'common/utils/feature-restriction';
import {
  FeatureRestrictionActionTypes,
  FeatureRestrictionModuleTypes
} from 'common/utils/feature-restriction/feature-restriction.types';

interface IHeaderActionWrapper {
  convertedAction: IHeaderAction;
  action: IHeaderAction;
  handleMenuItemSelect: (data: IProcessMenuItem) => Promise<void>;
  setSelectedHeaderAction: React.Dispatch<React.SetStateAction<IMenuItem | null>>;
  buttonElement: ({
    convertedAction,
    action
  }: {
    convertedAction: IHeaderAction;
    action: IHeaderAction;
  }) => JSX.Element;
}

const HeaderActionWrapper = (props: IHeaderActionWrapper): JSX.Element => {
  const { convertedAction, action, handleMenuItemSelect, setSelectedHeaderAction, buttonElement } =
    props;

  const quickAddLead = {
    [HEADER_ACTION_ID.QuickAddLead]: true
  };

  return (
    <ActionWrapper
      action={convertedAction}
      key={action.id}
      onMenuItemSelect={(menuItemData: IMenuItem) => {
        if (menuItemData?.workAreaConfig) {
          handleMenuItemSelect(menuItemData);
        }
        setSelectedHeaderAction({ ...menuItemData });
      }}>
      {quickAddLead[convertedAction?.id] ? (
        <FeatureRestriction
          actionName={
            FeatureRestrictionActionTypes[FeatureRestrictionModuleTypes.SmartViews].QuickAddLead
          }
          moduleName={FeatureRestrictionModuleTypes.SmartViews}
          callerSource={CallerSource.SmartViews}>
          {buttonElement({ convertedAction, action })}
        </FeatureRestriction>
      ) : (
        buttonElement({ convertedAction, action })
      )}
    </ActionWrapper>
  );
};

export default HeaderActionWrapper;
