import { IMenuItem } from 'common/component-lib/action-wrapper/action-wrapper.types';
import TabSettings from '../../tab-settings';
import { HeaderAction } from 'apps/smart-views/constants/constants';
import { useEffect, useState } from 'react';
import EntityImport from 'apps/smart-views/components/external-components/entity-import/EntityImport';
import EntityExport from 'common/component-lib/entity-export';
import { logSVModuleUsage } from 'apps/smart-views/utils/utils';
import ListCreate from 'common/component-lib/entity-actions/list-create';
import { setShowHiddenLists } from 'apps/smart-views/components/smartview-tab/smartview-tab.store';
import ListDetailsActionsRenderer from 'common/component-lib/entity-actions/list-details-actions';
import { ShowListType } from 'apps/smart-views/components/custom-tabs/manage-lists/manage-lists.types';

interface IActionsRenderer {
  selectedAction: IMenuItem | null;
  tabId: string;
}

interface IActionRendererComponent {
  selectedAction: IMenuItem | null;
  tabId: string;
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const HeaderActionType: Record<string, React.FC<IActionRendererComponent>> = {
  [HeaderAction.SelectColumns]: TabSettings,
  [HeaderAction.ManageFilters]: TabSettings,
  [HeaderAction.ImportLeads]: EntityImport,
  [HeaderAction.ExportLeads]: EntityExport,
  [HeaderAction.CreateList]: ListCreate,
  [HeaderAction.CreateEmptyList]: ListCreate,
  [HeaderAction.ListEdit]: ListDetailsActionsRenderer,
  [HeaderAction.DeleteAllLead]: ListDetailsActionsRenderer,
  [HeaderAction.Delete]: ListDetailsActionsRenderer,
  [HeaderAction.UpdateAllLead]: ListDetailsActionsRenderer,
  [HeaderAction.SendEmailAction]: ListDetailsActionsRenderer,
  [HeaderAction.ViewScheduledEmail]: ListDetailsActionsRenderer,
  [HeaderAction.CustomActions]: ListDetailsActionsRenderer,
  [HeaderAction.ListAddMore]: ListDetailsActionsRenderer
};

const HeaderActionsRenderer = ({ selectedAction, tabId }: IActionsRenderer): JSX.Element | null => {
  const [showSettings, setShowSettings] = useState({
    [HeaderAction.SelectColumns]: false,
    [HeaderAction.ManageFilters]: false,
    [HeaderAction.ImportLeads]: false,
    [HeaderAction.ExportLeads]: false,
    [HeaderAction.CreateList]: false,
    [HeaderAction.CreateEmptyList]: false,
    [HeaderAction.CustomActions]: false
  });

  useEffect(() => {
    if (!selectedAction) return;
    const workArea = selectedAction.value;
    let workAreaValue: string | undefined;
    if (Object.values(HeaderAction)?.includes(selectedAction.value))
      setShowSettings({ ...showSettings, [selectedAction.value]: true });
    else if (workArea === ShowListType.HIDE) {
      setShowHiddenLists(tabId, true);
    } else if (workArea === ShowListType.SHOW) {
      setShowHiddenLists(tabId, false);
    }

    //Manage filter and Manage Column will be logged while saving the selections
    if (![HeaderAction.ManageFilters, HeaderAction.SelectColumns]?.includes(selectedAction.value)) {
      logSVModuleUsage(tabId, workArea, { workAreaValue });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAction]);

  if (!selectedAction) {
    return null;
  }

  const handleShow = (show: boolean): void => {
    setShowSettings({ ...showSettings, [selectedAction.value]: show });
  };

  const isCustomActions = (): string | undefined => {
    if (selectedAction?.connectorConfig) {
      return HeaderAction.CustomActions;
    }
  };

  const Component =
    HeaderActionType?.[selectedAction?.value] ?? HeaderActionType[isCustomActions() as string];

  if (
    (Component && showSettings[selectedAction?.value]) ??
    HeaderActionType[isCustomActions() as string]
  ) {
    return (
      <Component
        selectedAction={selectedAction}
        tabId={tabId}
        show={showSettings[selectedAction?.value] ?? showSettings[isCustomActions() as string]}
        setShow={handleShow}
      />
    );
  }

  return null;
};

export default HeaderActionsRenderer;
